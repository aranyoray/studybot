/**
 * Audio Analyzer using Meyda for MFCC extraction
 * Analyzes speech patterns, pitch, energy, and pauses for engagement monitoring
 */

interface AudioFeatures {
  mfcc: number[]
  rms: number // Root Mean Square (energy)
  zcr: number // Zero Crossing Rate
  spectralCentroid: number
  pitch: number
  timestamp: number
}

interface SpeechMetrics {
  averagePitch: number
  pitchVariance: number
  speechRateWPM: number
  pauseFrequency: number // pauses per minute
  averagePauseDuration: number // milliseconds
  responseLatency: number // milliseconds to first response
  confidenceScore: number // 0-100
  engagementScore: number // 0-100
}

interface PauseDetection {
  start: number
  end: number
  duration: number
}

class AudioAnalyzer {
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyzer: any = null // Meyda analyzer
  private isRecording: boolean = false
  private isInitialized: boolean = false

  private features: AudioFeatures[] = []
  private pitchHistory: number[] = []
  private energyHistory: number[] = []
  private pauses: PauseDetection[] = []

  private lastSpeechTime: number = 0
  private currentPauseStart: number | null = null
  private firstSpeechTime: number | null = null
  private questionStartTime: number | null = null

  // Thresholds
  private readonly SPEECH_THRESHOLD = 0.01 // RMS energy threshold for speech
  private readonly MIN_PAUSE_DURATION = 300 // milliseconds
  private readonly MFCC_COEFFICIENTS = 13 // Standard MFCC count

  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.warn('AudioAnalyzer: Cannot initialize on server side')
      return false
    }

    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      this.isInitialized = true
      console.log('AudioAnalyzer: Initialized successfully')
      return true
    } catch (error) {
      console.error('AudioAnalyzer: Failed to initialize', error)
      return false
    }
  }

  async startAnalysis(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize()
      if (!initialized) return false
    }

    if (!this.audioContext || !this.mediaStream) {
      return false
    }

    try {
      // Dynamic import Meyda
      const Meyda = await import('meyda')
      const meydaModule = Meyda.default || Meyda

      const source = this.audioContext.createMediaStreamSource(this.mediaStream)

      // Configure Meyda analyzer
      this.analyzer = meydaModule.createMeydaAnalyzer({
        audioContext: this.audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: [
          'mfcc',
          'rms',
          'zcr',
          'spectralCentroid',
        ],
        callback: (features: any) => {
          this.processFeatures(features)
        },
      })

      this.analyzer.start()
      this.isRecording = true
      console.log('AudioAnalyzer: Started analysis')
      return true
    } catch (error) {
      console.error('AudioAnalyzer: Failed to start analysis', error)
      return false
    }
  }

  stopAnalysis(): void {
    if (this.analyzer && this.isRecording) {
      this.analyzer.stop()
      this.isRecording = false
      console.log('AudioAnalyzer: Stopped analysis')
    }
  }

  private processFeatures(features: any): void {
    const now = Date.now()

    // Extract features
    const audioFeature: AudioFeatures = {
      mfcc: features.mfcc || Array(this.MFCC_COEFFICIENTS).fill(0),
      rms: features.rms || 0,
      zcr: features.zcr || 0,
      spectralCentroid: features.spectralCentroid || 0,
      pitch: this.estimatePitch(features),
      timestamp: now,
    }

    this.features.push(audioFeature)

    // Keep only last 100 features (about 5-10 seconds depending on buffer size)
    if (this.features.length > 100) {
      this.features.shift()
    }

    // Track pitch and energy
    if (audioFeature.pitch > 0) {
      this.pitchHistory.push(audioFeature.pitch)
      if (this.pitchHistory.length > 100) {
        this.pitchHistory.shift()
      }
    }

    this.energyHistory.push(audioFeature.rms)
    if (this.energyHistory.length > 100) {
      this.energyHistory.shift()
    }

    // Detect speech/pause
    this.detectSpeechPause(audioFeature.rms, now)
  }

  private estimatePitch(features: any): number {
    // Simple pitch estimation from spectral centroid
    // In production, use a more robust pitch detection algorithm
    if (features.spectralCentroid && features.spectralCentroid > 0) {
      return features.spectralCentroid
    }
    return 0
  }

  private detectSpeechPause(energy: number, timestamp: number): void {
    const isSpeech = energy > this.SPEECH_THRESHOLD

    if (isSpeech) {
      // Speech detected
      if (this.firstSpeechTime === null) {
        this.firstSpeechTime = timestamp
      }

      // End current pause if exists
      if (this.currentPauseStart !== null) {
        const pauseDuration = timestamp - this.currentPauseStart
        if (pauseDuration >= this.MIN_PAUSE_DURATION) {
          this.pauses.push({
            start: this.currentPauseStart,
            end: timestamp,
            duration: pauseDuration,
          })
        }
        this.currentPauseStart = null
      }

      this.lastSpeechTime = timestamp
    } else {
      // Silence detected
      if (this.lastSpeechTime > 0 && this.currentPauseStart === null) {
        this.currentPauseStart = timestamp
      }
    }
  }

  startQuestion(): void {
    // Mark when a question is asked to measure response latency
    this.questionStartTime = Date.now()
    this.firstSpeechTime = null
  }

  getSpeechMetrics(): SpeechMetrics {
    // Calculate average pitch
    const averagePitch =
      this.pitchHistory.length > 0
        ? this.pitchHistory.reduce((a, b) => a + b, 0) / this.pitchHistory.length
        : 0

    // Calculate pitch variance
    const pitchVariance =
      this.pitchHistory.length > 1
        ? this.calculateVariance(this.pitchHistory)
        : 0

    // Calculate speech rate (rough estimation)
    // In production, use speech recognition API for accurate word count
    const speechDuration = this.calculateTotalSpeechDuration()
    const speechRateWPM = speechDuration > 0 ? (this.features.length / speechDuration) * 60 * 2 : 0 // rough estimate

    // Calculate pause frequency
    const totalTime = this.features.length > 0
      ? (this.features[this.features.length - 1].timestamp - this.features[0].timestamp) / 60000
      : 1
    const pauseFrequency = this.pauses.length / Math.max(totalTime, 1)

    // Calculate average pause duration
    const averagePauseDuration =
      this.pauses.length > 0
        ? this.pauses.reduce((sum, p) => sum + p.duration, 0) / this.pauses.length
        : 0

    // Calculate response latency
    const responseLatency =
      this.questionStartTime && this.firstSpeechTime
        ? this.firstSpeechTime - this.questionStartTime
        : 0

    // Confidence score based on pitch stability and energy
    const confidenceScore = this.calculateConfidenceScore()

    // Engagement score based on multiple factors
    const engagementScore = this.calculateEngagementScore()

    return {
      averagePitch,
      pitchVariance,
      speechRateWPM,
      pauseFrequency,
      averagePauseDuration,
      responseLatency,
      confidenceScore,
      engagementScore,
    }
  }

  private calculateTotalSpeechDuration(): number {
    // Calculate total speech time (excluding pauses)
    if (this.features.length < 2) return 0

    const totalTime =
      (this.features[this.features.length - 1].timestamp - this.features[0].timestamp) / 1000
    const pauseTime = this.pauses.reduce((sum, p) => sum + p.duration, 0) / 1000

    return Math.max(0, totalTime - pauseTime)
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  private calculateConfidenceScore(): number {
    // Confidence based on:
    // 1. Stable pitch (low variance) = confident
    // 2. Consistent energy = confident
    // 3. Moderate speech rate = confident

    if (this.pitchHistory.length === 0) return 0

    const pitchStability = 100 - Math.min(100, this.calculateVariance(this.pitchHistory) / 100)
    const energyStability =
      100 - Math.min(100, this.calculateVariance(this.energyHistory) * 100)

    const confidenceScore = (pitchStability * 0.5 + energyStability * 0.5)

    return Math.round(Math.min(100, Math.max(0, confidenceScore)))
  }

  private calculateEngagementScore(): number {
    // Engagement based on:
    // 1. Speech activity (vs silence)
    // 2. Pitch variation (engaged speakers vary pitch)
    // 3. Response latency (quick responses = engaged)
    // 4. Moderate pause frequency

    const speechDuration = this.calculateTotalSpeechDuration()
    const totalTime = this.features.length > 0
      ? (this.features[this.features.length - 1].timestamp - this.features[0].timestamp) / 1000
      : 1

    const activityScore = Math.min(100, (speechDuration / totalTime) * 100)

    const pitchVariation =
      this.pitchHistory.length > 0 ? this.calculateVariance(this.pitchHistory) : 0
    const pitchScore = Math.min(100, pitchVariation / 10) // More variation = more engaged

    const metrics = this.getSpeechMetrics()
    const latencyScore =
      metrics.responseLatency > 0
        ? Math.max(0, 100 - (metrics.responseLatency / 100))
        : 100

    const idealPauseFrequency = 3 // pauses per minute
    const pauseScore = Math.max(
      0,
      100 - Math.abs(metrics.pauseFrequency - idealPauseFrequency) * 10
    )

    const engagementScore =
      activityScore * 0.4 +
      pitchScore * 0.2 +
      latencyScore * 0.2 +
      pauseScore * 0.2

    return Math.round(Math.min(100, Math.max(0, engagementScore)))
  }

  getFeatures(): AudioFeatures[] {
    return [...this.features]
  }

  getMFCCs(): number[][] {
    return this.features.map(f => f.mfcc)
  }

  reset(): void {
    this.features = []
    this.pitchHistory = []
    this.energyHistory = []
    this.pauses = []
    this.lastSpeechTime = 0
    this.currentPauseStart = null
    this.firstSpeechTime = null
    this.questionStartTime = null
    console.log('AudioAnalyzer: Reset')
  }

  cleanup(): void {
    this.stopAnalysis()

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.isInitialized = false
    this.isRecording = false
    console.log('AudioAnalyzer: Cleaned up')
  }

  isReady(): boolean {
    return this.isInitialized && this.isRecording
  }
}

// Singleton instance
let audioAnalyzerInstance: AudioAnalyzer | null = null

export function getAudioAnalyzer(): AudioAnalyzer {
  if (typeof window === 'undefined') {
    throw new Error('AudioAnalyzer can only be used on the client side')
  }

  if (!audioAnalyzerInstance) {
    audioAnalyzerInstance = new AudioAnalyzer()
  }

  return audioAnalyzerInstance
}

export type { AudioFeatures, SpeechMetrics, PauseDetection }
