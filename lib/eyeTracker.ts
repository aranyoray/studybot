/**
 * Eye Tracking Module using WebGazer.js
 * Provides scanpath analysis, velocity mapping, and fixation detection
 */

interface EyeGazePoint {
  x: number
  y: number
  timestamp: number
  confidence: number
}

interface Fixation {
  x: number
  y: number
  duration: number // milliseconds
  startTime: number
  endTime: number
}

interface Saccade {
  fromX: number
  fromY: number
  toX: number
  toY: number
  velocity: number // degrees per second
  duration: number
  timestamp: number
}

interface ScanpathData {
  points: EyeGazePoint[]
  fixations: Fixation[]
  saccades: Saccade[]
  velocityMap: number[]
  heatmapData: number[][]
  avgFixationDuration: number
  gazeDispersion: number
}

class EyeTracker {
  private webgazer: any = null
  private gazeData: EyeGazePoint[] = []
  private isInitialized: boolean = false
  private isTracking: boolean = false

  private readonly FIXATION_THRESHOLD = 50 // pixels
  private readonly FIXATION_MIN_DURATION = 100 // milliseconds
  private readonly SCREEN_DISTANCE_CM = 60 // typical viewing distance
  private readonly SCREEN_WIDTH_CM = 34 // typical monitor width
  private readonly HEATMAP_GRID_SIZE = 50 // grid cells for heatmap

  private lastGazePoint: EyeGazePoint | null = null
  private currentFixation: Fixation | null = null
  private fixations: Fixation[] = []
  private saccades: Saccade[] = []

  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.warn('EyeTracker: Cannot initialize on server side')
      return false
    }

    try {
      // Dynamic import of WebGazer
      const WebGazer = await import('webgazer')
      this.webgazer = WebGazer.default || WebGazer

      // Configure WebGazer
      this.webgazer
        .setGazeListener((data: any, timestamp: number) => {
          if (data && this.isTracking) {
            this.handleGazeData(data.x, data.y, timestamp)
          }
        })
        .showPredictionPoints(false) // Hide red dots
        .showFaceOverlay(false) // Hide face overlay
        .showVideo(false) // Hide video preview
        .showFaceFeedbackBox(false) // Hide feedback box
        .saveDataAcrossSessions(true) // Improve accuracy over time
        .setRegression('ridge') // Use ridge regression for better accuracy

      this.isInitialized = true
      console.log('EyeTracker: Initialized successfully')
      return true
    } catch (error) {
      console.error('EyeTracker: Failed to initialize WebGazer', error)
      return false
    }
  }

  async startTracking(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize()
      if (!initialized) return false
    }

    try {
      await this.webgazer.begin()
      this.isTracking = true
      console.log('EyeTracker: Started tracking')
      return true
    } catch (error) {
      console.error('EyeTracker: Failed to start tracking', error)
      return false
    }
  }

  stopTracking(): void {
    if (this.webgazer && this.isTracking) {
      this.webgazer.pause()
      this.isTracking = false
      console.log('EyeTracker: Stopped tracking')
    }
  }

  resumeTracking(): void {
    if (this.webgazer && this.isInitialized) {
      this.webgazer.resume()
      this.isTracking = true
      console.log('EyeTracker: Resumed tracking')
    }
  }

  private handleGazeData(x: number, y: number, timestamp: number): void {
    const gazePoint: EyeGazePoint = {
      x,
      y,
      timestamp,
      confidence: 0.8, // WebGazer doesn't provide confidence, use default
    }

    this.gazeData.push(gazePoint)

    // Keep only last 1000 points (about 30 seconds at 30Hz)
    if (this.gazeData.length > 1000) {
      this.gazeData.shift()
    }

    // Process fixations and saccades
    this.processGazePoint(gazePoint)

    this.lastGazePoint = gazePoint
  }

  private processGazePoint(point: EyeGazePoint): void {
    if (!this.lastGazePoint) {
      // Start first fixation
      this.currentFixation = {
        x: point.x,
        y: point.y,
        duration: 0,
        startTime: point.timestamp,
        endTime: point.timestamp,
      }
      return
    }

    const distance = this.calculateDistance(
      this.lastGazePoint.x,
      this.lastGazePoint.y,
      point.x,
      point.y
    )

    if (distance < this.FIXATION_THRESHOLD) {
      // Continue fixation
      if (this.currentFixation) {
        this.currentFixation.endTime = point.timestamp
        this.currentFixation.duration = point.timestamp - this.currentFixation.startTime
      }
    } else {
      // Saccade detected - end fixation and create saccade
      if (this.currentFixation && this.currentFixation.duration >= this.FIXATION_MIN_DURATION) {
        this.fixations.push({ ...this.currentFixation })

        // Calculate saccade
        const saccade = this.calculateSaccade(
          this.currentFixation.x,
          this.currentFixation.y,
          point.x,
          point.y,
          this.currentFixation.endTime,
          point.timestamp
        )
        this.saccades.push(saccade)
      }

      // Start new fixation
      this.currentFixation = {
        x: point.x,
        y: point.y,
        duration: 0,
        startTime: point.timestamp,
        endTime: point.timestamp,
      }
    }
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  private calculateSaccade(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    startTime: number,
    endTime: number
  ): Saccade {
    const distance = this.calculateDistance(fromX, fromY, toX, toY)
    const duration = endTime - startTime

    // Convert pixel distance to visual angle (degrees)
    const pixelsPerCm = window.innerWidth / this.SCREEN_WIDTH_CM
    const distanceCm = distance / pixelsPerCm
    const visualAngle = 2 * Math.atan(distanceCm / (2 * this.SCREEN_DISTANCE_CM)) * (180 / Math.PI)

    // Calculate velocity in degrees per second
    const velocity = duration > 0 ? (visualAngle / duration) * 1000 : 0

    return {
      fromX,
      fromY,
      toX,
      toY,
      velocity,
      duration,
      timestamp: endTime,
    }
  }

  private generateHeatmap(): number[][] {
    const gridSize = this.HEATMAP_GRID_SIZE
    const heatmap: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))

    const cellWidth = window.innerWidth / gridSize
    const cellHeight = window.innerHeight / gridSize

    this.gazeData.forEach(point => {
      const gridX = Math.min(Math.floor(point.x / cellWidth), gridSize - 1)
      const gridY = Math.min(Math.floor(point.y / cellHeight), gridSize - 1)

      if (gridX >= 0 && gridY >= 0) {
        heatmap[gridY][gridX]++
      }
    })

    // Normalize heatmap
    const maxValue = Math.max(...heatmap.flat())
    if (maxValue > 0) {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          heatmap[i][j] = heatmap[i][j] / maxValue
        }
      }
    }

    return heatmap
  }

  getScanpathData(): ScanpathData {
    const velocityMap = this.saccades.map(s => s.velocity)
    const heatmapData = this.generateHeatmap()

    const avgFixationDuration = this.fixations.length > 0
      ? this.fixations.reduce((sum, f) => sum + f.duration, 0) / this.fixations.length
      : 0

    // Calculate gaze dispersion (standard deviation of gaze points)
    const gazeDispersion = this.calculateGazeDispersion()

    return {
      points: [...this.gazeData],
      fixations: [...this.fixations],
      saccades: [...this.saccades],
      velocityMap,
      heatmapData,
      avgFixationDuration,
      gazeDispersion,
    }
  }

  private calculateGazeDispersion(): number {
    if (this.gazeData.length < 2) return 0

    const meanX = this.gazeData.reduce((sum, p) => sum + p.x, 0) / this.gazeData.length
    const meanY = this.gazeData.reduce((sum, p) => sum + p.y, 0) / this.gazeData.length

    const variance = this.gazeData.reduce((sum, p) => {
      return sum + Math.pow(p.x - meanX, 2) + Math.pow(p.y - meanY, 2)
    }, 0) / this.gazeData.length

    return Math.sqrt(variance)
  }

  getAttentionScore(): number {
    const scanpath = this.getScanpathData()

    // Attention score based on:
    // 1. Low gaze dispersion = focused (50%)
    // 2. Longer fixations = engaged (30%)
    // 3. Lower saccade velocity = calm (20%)

    const maxDispersion = 500 // pixels
    const dispersionScore = Math.max(0, (1 - scanpath.gazeDispersion / maxDispersion)) * 100

    const targetFixationDuration = 300 // milliseconds
    const fixationScore = Math.min(100, (scanpath.avgFixationDuration / targetFixationDuration) * 100)

    const avgVelocity = scanpath.velocityMap.length > 0
      ? scanpath.velocityMap.reduce((a, b) => a + b, 0) / scanpath.velocityMap.length
      : 0
    const maxVelocity = 500 // degrees per second
    const velocityScore = Math.max(0, (1 - avgVelocity / maxVelocity)) * 100

    const attentionScore = (dispersionScore * 0.5) + (fixationScore * 0.3) + (velocityScore * 0.2)

    return Math.round(Math.min(100, Math.max(0, attentionScore)))
  }

  reset(): void {
    this.gazeData = []
    this.fixations = []
    this.saccades = []
    this.currentFixation = null
    this.lastGazePoint = null
    console.log('EyeTracker: Reset')
  }

  cleanup(): void {
    if (this.webgazer) {
      this.webgazer.end()
      this.isInitialized = false
      this.isTracking = false
      console.log('EyeTracker: Cleaned up')
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.isTracking
  }

  getGazeData(): EyeGazePoint[] {
    return [...this.gazeData]
  }

  getFixations(): Fixation[] {
    return [...this.fixations]
  }

  getSaccades(): Saccade[] {
    return [...this.saccades]
  }
}

// Singleton instance
let eyeTrackerInstance: EyeTracker | null = null

export function getEyeTracker(): EyeTracker {
  if (typeof window === 'undefined') {
    throw new Error('EyeTracker can only be used on the client side')
  }

  if (!eyeTrackerInstance) {
    eyeTrackerInstance = new EyeTracker()
  }

  return eyeTrackerInstance
}

export type { EyeGazePoint, Fixation, Saccade, ScanpathData }
