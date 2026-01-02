/**
 * Emotion and Gesture Detector
 * Uses face-api.js for microexpressions and MediaPipe Hands for gesture detection
 */

interface EmotionData {
  emotions: {
    neutral: number
    happy: number
    sad: number
    angry: number
    fearful: number
    disgusted: number
    surprised: number
  }
  valence: number // -1 to 1 (negative to positive)
  arousal: number // 0 to 1 (calm to excited)
  frustration: number // 0 to 1
  confusion: number // 0 to 1
  engagement: number // 0 to 1
  timestamp: number
}

interface GestureData {
  gestureType: string // 'pointing', 'thumbs_up', 'thumbs_down', 'hand_raise', 'fidgeting', etc.
  confidence: number
  duration: number
  timestamp: number
}

interface HandLandmark {
  x: number
  y: number
  z: number
}

class EmotionGestureDetector {
  private videoElement: HTMLVideoElement | null = null
  private canvasElement: HTMLCanvasElement | null = null
  private mediaStream: MediaStream | null = null
  private isInitialized: boolean = false
  private isDetecting: boolean = false

  // face-api.js models
  private faceApiLoaded: boolean = false
  private detectionInterval: number | null = null

  // MediaPipe Hands
  private hands: any = null
  private handsLoaded: boolean = false

  // Data storage
  private emotionHistory: EmotionData[] = []
  private gestureHistory: GestureData[] = []

  private lastHandPositions: HandLandmark[][] = []
  private fidgetingDetectionWindow: number[] = []

  private readonly DETECTION_INTERVAL = 1000 // 1 second
  private readonly MAX_HISTORY = 60 // Keep 1 minute of data

  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.warn('EmotionGestureDetector: Cannot initialize on server side')
      return false
    }

    try {
      // Create video element
      this.videoElement = document.createElement('video')
      this.videoElement.width = 640
      this.videoElement.height = 480
      this.videoElement.autoplay = true
      this.videoElement.style.display = 'none'
      document.body.appendChild(this.videoElement)

      // Create canvas for drawing (optional)
      this.canvasElement = document.createElement('canvas')
      this.canvasElement.width = 640
      this.canvasElement.height = 480
      this.canvasElement.style.display = 'none'
      document.body.appendChild(this.canvasElement)

      // Get camera stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      this.videoElement.srcObject = this.mediaStream

      // Load face-api.js models
      await this.loadFaceApiModels()

      // Load MediaPipe Hands
      await this.loadMediaPipeHands()

      this.isInitialized = true
      console.log('EmotionGestureDetector: Initialized successfully')
      return true
    } catch (error) {
      console.error('EmotionGestureDetector: Failed to initialize', error)
      return false
    }
  }

  private async loadFaceApiModels(): Promise<void> {
    try {
      const faceapi = await import('face-api.js')

      // Load models from CDN
      const MODEL_URL = '/models' // Assumes models are in public/models directory

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ])

      this.faceApiLoaded = true
      console.log('EmotionGestureDetector: face-api.js models loaded')
    } catch (error) {
      console.error('EmotionGestureDetector: Failed to load face-api.js models', error)
    }
  }

  private async loadMediaPipeHands(): Promise<void> {
    try {
      const { Hands } = await import('@mediapipe/hands')

      this.hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        },
      })

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      this.hands.onResults((results: any) => this.processHandResults(results))

      this.handsLoaded = true
      console.log('EmotionGestureDetector: MediaPipe Hands loaded')
    } catch (error) {
      console.error('EmotionGestureDetector: Failed to load MediaPipe Hands', error)
    }
  }

  async startDetection(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize()
      if (!initialized) return false
    }

    if (!this.videoElement) return false

    this.isDetecting = true

    // Start emotion detection loop
    if (this.faceApiLoaded) {
      this.detectionInterval = window.setInterval(() => {
        this.detectEmotions()
      }, this.DETECTION_INTERVAL)
    }

    // Start gesture detection
    if (this.handsLoaded && this.hands && this.canvasElement) {
      const camera = await import('@mediapipe/camera_utils')
      const Camera = camera.Camera

      new Camera(this.videoElement, {
        onFrame: async () => {
          if (this.hands && this.canvasElement) {
            await this.hands.send({ image: this.videoElement })
          }
        },
        width: 640,
        height: 480,
      }).start()
    }

    console.log('EmotionGestureDetector: Started detection')
    return true
  }

  stopDetection(): void {
    this.isDetecting = false

    if (this.detectionInterval) {
      clearInterval(this.detectionInterval)
      this.detectionInterval = null
    }

    console.log('EmotionGestureDetector: Stopped detection')
  }

  private async detectEmotions(): Promise<void> {
    if (!this.videoElement || !this.faceApiLoaded) return

    try {
      const faceapi = await import('face-api.js')

      const detections = await faceapi
        .detectSingleFace(this.videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      if (detections && detections.expressions) {
        const emotions = {
          neutral: detections.expressions.neutral || 0,
          happy: detections.expressions.happy || 0,
          sad: detections.expressions.sad || 0,
          angry: detections.expressions.angry || 0,
          fearful: detections.expressions.fearful || 0,
          disgusted: detections.expressions.disgusted || 0,
          surprised: detections.expressions.surprised || 0,
        }

        // Calculate valence and arousal
        const valence = this.calculateValence(emotions)
        const arousal = this.calculateArousal(emotions)

        // Calculate frustration and confusion
        const frustration = this.calculateFrustration(emotions)
        const confusion = this.calculateConfusion(emotions)

        // Calculate engagement
        const engagement = this.calculateEngagement(emotions, arousal)

        const emotionData: EmotionData = {
          emotions,
          valence,
          arousal,
          frustration,
          confusion,
          engagement,
          timestamp: Date.now(),
        }

        this.emotionHistory.push(emotionData)

        // Keep only recent data
        if (this.emotionHistory.length > this.MAX_HISTORY) {
          this.emotionHistory.shift()
        }
      }
    } catch (error) {
      console.error('EmotionGestureDetector: Error detecting emotions', error)
    }
  }

  private calculateValence(emotions: EmotionData['emotions']): number {
    // Valence: negative to positive
    const positive = emotions.happy + emotions.surprised * 0.5
    const negative = emotions.sad + emotions.angry + emotions.fearful + emotions.disgusted

    return (positive - negative) // Range: -1 to 1
  }

  private calculateArousal(emotions: EmotionData['emotions']): number {
    // Arousal: calm to excited
    const excited = emotions.happy + emotions.angry + emotions.fearful + emotions.surprised
    const calm = emotions.neutral + emotions.sad * 0.5

    return excited / (excited + calm + 0.001) // Range: 0 to 1
  }

  private calculateFrustration(emotions: EmotionData['emotions']): number {
    // Frustration from anger, disgust, and low positive emotions
    return Math.min(1, emotions.angry * 0.6 + emotions.disgusted * 0.3 + (1 - emotions.happy) * 0.1)
  }

  private calculateConfusion(emotions: EmotionData['emotions']): number {
    // Confusion from mixed emotions and uncertainty
    const emotionVariance = this.calculateEmotionVariance(emotions)
    return Math.min(1, emotionVariance + emotions.surprised * 0.3)
  }

  private calculateEmotionVariance(emotions: EmotionData['emotions']): number {
    const values = Object.values(emotions)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private calculateEngagement(emotions: EmotionData['emotions'], arousal: number): number {
    // High engagement: positive emotions, moderate arousal, low frustration
    const positiveEmotions = emotions.happy + emotions.surprised * 0.3
    const negativeEmotions = emotions.sad + emotions.angry * 0.5
    const frustration = this.calculateFrustration(emotions)

    const emotionScore = Math.max(0, positiveEmotions - negativeEmotions)
    const arousalScore = 1 - Math.abs(arousal - 0.5) * 2 // Prefer moderate arousal

    return Math.min(1, emotionScore * 0.5 + arousalScore * 0.3 + (1 - frustration) * 0.2)
  }

  private processHandResults(results: any): void {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return
    }

    const landmarks = results.multiHandLandmarks[0] // Use first hand

    // Detect gestures
    const gesture = this.detectGesture(landmarks)

    if (gesture) {
      this.gestureHistory.push(gesture)

      if (this.gestureHistory.length > this.MAX_HISTORY) {
        this.gestureHistory.shift()
      }
    }

    // Detect fidgeting
    this.detectFidgeting(landmarks)

    this.lastHandPositions.push(landmarks)
    if (this.lastHandPositions.length > 10) {
      this.lastHandPositions.shift()
    }
  }

  private detectGesture(landmarks: HandLandmark[]): GestureData | null {
    // Simple gesture detection based on hand landmarks
    // In production, use a trained ML model for better accuracy

    const thumbTip = landmarks[4]
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const ringTip = landmarks[16]
    const pinkyTip = landmarks[20]
    const wrist = landmarks[0]

    // Thumbs up
    if (thumbTip.y < wrist.y && indexTip.y > wrist.y && middleTip.y > wrist.y) {
      return {
        gestureType: 'thumbs_up',
        confidence: 0.8,
        duration: 0,
        timestamp: Date.now(),
      }
    }

    // Thumbs down
    if (thumbTip.y > wrist.y && indexTip.y < wrist.y && middleTip.y < wrist.y) {
      return {
        gestureType: 'thumbs_down',
        confidence: 0.8,
        duration: 0,
        timestamp: Date.now(),
      }
    }

    // Hand raise (all fingers up)
    if (
      thumbTip.y < wrist.y &&
      indexTip.y < wrist.y &&
      middleTip.y < wrist.y &&
      ringTip.y < wrist.y &&
      pinkyTip.y < wrist.y
    ) {
      return {
        gestureType: 'hand_raise',
        confidence: 0.9,
        duration: 0,
        timestamp: Date.now(),
      }
    }

    // Pointing (index up, others down)
    if (indexTip.y < wrist.y && middleTip.y > wrist.y && ringTip.y > wrist.y) {
      return {
        gestureType: 'pointing',
        confidence: 0.7,
        duration: 0,
        timestamp: Date.now(),
      }
    }

    return null
  }

  private detectFidgeting(landmarks: HandLandmark[]): void {
    if (this.lastHandPositions.length < 5) return

    // Calculate hand movement
    const prevLandmarks = this.lastHandPositions[this.lastHandPositions.length - 1]
    const movement = this.calculateHandMovement(prevLandmarks, landmarks)

    this.fidgetingDetectionWindow.push(movement)
    if (this.fidgetingDetectionWindow.length > 20) {
      this.fidgetingDetectionWindow.shift()
    }

    // High variance in movement = fidgeting
    const movementVariance = this.calculateVariance(this.fidgetingDetectionWindow)

    if (movementVariance > 0.05) {
      // Threshold for fidgeting
      this.gestureHistory.push({
        gestureType: 'fidgeting',
        confidence: Math.min(1, movementVariance * 10),
        duration: this.DETECTION_INTERVAL,
        timestamp: Date.now(),
      })
    }
  }

  private calculateHandMovement(prev: HandLandmark[], current: HandLandmark[]): number {
    let totalMovement = 0

    for (let i = 0; i < Math.min(prev.length, current.length); i++) {
      const dx = current[i].x - prev[i].x
      const dy = current[i].y - prev[i].y
      const dz = current[i].z - prev[i].z
      totalMovement += Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    return totalMovement / prev.length
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  getLatestEmotion(): EmotionData | null {
    return this.emotionHistory.length > 0
      ? this.emotionHistory[this.emotionHistory.length - 1]
      : null
  }

  getAverageEmotion(windowSeconds: number = 10): EmotionData | null {
    const now = Date.now()
    const windowMs = windowSeconds * 1000

    const recentEmotions = this.emotionHistory.filter(
      e => now - e.timestamp < windowMs
    )

    if (recentEmotions.length === 0) return null

    // Average emotions
    const avgEmotions = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    }

    recentEmotions.forEach(e => {
      Object.keys(avgEmotions).forEach(key => {
        avgEmotions[key as keyof typeof avgEmotions] += e.emotions[key as keyof typeof e.emotions]
      })
    })

    Object.keys(avgEmotions).forEach(key => {
      avgEmotions[key as keyof typeof avgEmotions] /= recentEmotions.length
    })

    const avgValence =
      recentEmotions.reduce((sum, e) => sum + e.valence, 0) / recentEmotions.length
    const avgArousal =
      recentEmotions.reduce((sum, e) => sum + e.arousal, 0) / recentEmotions.length
    const avgFrustration =
      recentEmotions.reduce((sum, e) => sum + e.frustration, 0) / recentEmotions.length
    const avgConfusion =
      recentEmotions.reduce((sum, e) => sum + e.confusion, 0) / recentEmotions.length
    const avgEngagement =
      recentEmotions.reduce((sum, e) => sum + e.engagement, 0) / recentEmotions.length

    return {
      emotions: avgEmotions,
      valence: avgValence,
      arousal: avgArousal,
      frustration: avgFrustration,
      confusion: avgConfusion,
      engagement: avgEngagement,
      timestamp: now,
    }
  }

  getRecentGestures(windowSeconds: number = 10): GestureData[] {
    const now = Date.now()
    const windowMs = windowSeconds * 1000

    return this.gestureHistory.filter(g => now - g.timestamp < windowMs)
  }

  reset(): void {
    this.emotionHistory = []
    this.gestureHistory = []
    this.lastHandPositions = []
    this.fidgetingDetectionWindow = []
    console.log('EmotionGestureDetector: Reset')
  }

  cleanup(): void {
    this.stopDetection()

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    if (this.videoElement) {
      document.body.removeChild(this.videoElement)
      this.videoElement = null
    }

    if (this.canvasElement) {
      document.body.removeChild(this.canvasElement)
      this.canvasElement = null
    }

    this.isInitialized = false
    this.isDetecting = false
    console.log('EmotionGestureDetector: Cleaned up')
  }

  isReady(): boolean {
    return this.isInitialized && this.isDetecting
  }
}

// Singleton instance
let detectorInstance: EmotionGestureDetector | null = null

export function getEmotionGestureDetector(): EmotionGestureDetector {
  if (typeof window === 'undefined') {
    throw new Error('EmotionGestureDetector can only be used on the client side')
  }

  if (!detectorInstance) {
    detectorInstance = new EmotionGestureDetector()
  }

  return detectorInstance
}

export type { EmotionData, GestureData, HandLandmark }
