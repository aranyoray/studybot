/**
 * Advanced Multimodal Engagement Tracker
 * Integrates eye tracking, audio analysis, microexpressions, and gestures
 * for comprehensive engagement monitoring with disorder-specific thresholds
 */

import { getEyeTracker, EyeGazePoint, ScanpathData } from './eyeTracker'

export interface EngagementMetrics {
  // Basic metrics
  focusTime: number
  activeTime: number
  interactionCount: number
  mouseMovement: number

  // Eye tracking metrics
  eyeTrackingScore: number
  avgFixationDuration: number
  gazeDispersion: number
  saccadeVelocity: number

  // Audio metrics (set separately)
  audioEngagementScore: number
  speechRate: number
  responseLatency: number

  // Multimodal scores
  attentionScore: number
  engagementScore: number
  frustrationLevel: number
  confusionLevel: number

  // Classification
  engagementLevel: 'high' | 'medium' | 'low' | 'critical'
}

export interface EngagementSnapshot {
  timestamp: number
  isFocused: boolean
  mouseX: number
  mouseY: number
  hasInteraction: boolean

  // Eye tracking data
  eyeGaze: EyeGazePoint | null
  fixationDuration: number

  // Scores
  attentionScore: number
  engagementScore: number
  frustrationLevel: number
}

export interface AdaptiveThresholds {
  minAttentionScore: number
  criticalAttentionScore: number
  minEngagementScore: number
  criticalEngagementScore: number
  maxFrustrationLevel: number
  criticalFrustrationLevel: number
  recommendedSessionLength: number
  maxSessionLength: number
  breakFrequency: number
}

class AdvancedEngagementTracker {
  private startTime: number = Date.now()
  private lastFocusTime: number = Date.now()
  private lastMousePos: { x: number; y: number } = { x: 0, y: 0 }
  private totalMouseDistance: number = 0
  private interactionCount: number = 0
  private isFocused: boolean = true
  private focusStartTime: number = Date.now()
  private totalFocusTime: number = 0
  private snapshots: EngagementSnapshot[] = []
  private lastSnapshotTime: number = 0

  // Eye tracking
  private eyeTracker: any = null
  private eyeTrackingEnabled: boolean = false

  // Audio metrics (updated externally)
  private audioEngagementScore: number = 0
  private speechRate: number = 0
  private responseLatency: number = 0

  // Frustration and confusion tracking
  private frustrationLevel: number = 0
  private confusionLevel: number = 0

  // Adaptive thresholds
  private thresholds: AdaptiveThresholds = {
    minAttentionScore: 50,
    criticalAttentionScore: 30,
    minEngagementScore: 55,
    criticalEngagementScore: 35,
    maxFrustrationLevel: 60,
    criticalFrustrationLevel: 80,
    recommendedSessionLength: 25,
    maxSessionLength: 45,
    breakFrequency: 20,
  }

  private readonly SNAPSHOT_INTERVAL = 2000 // 2 seconds
  private readonly MOUSE_THRESHOLD = 5

  constructor() {
    this.setupListeners()
  }

  setThresholds(thresholds: Partial<AdaptiveThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
    console.log('AdvancedEngagementTracker: Updated thresholds', this.thresholds)
  }

  async enableEyeTracking(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    try {
      this.eyeTracker = getEyeTracker()
      const started = await this.eyeTracker.startTracking()

      if (started) {
        this.eyeTrackingEnabled = true
        console.log('AdvancedEngagementTracker: Eye tracking enabled')
      }

      return started
    } catch (error) {
      console.error('AdvancedEngagementTracker: Failed to enable eye tracking', error)
      return false
    }
  }

  disableEyeTracking(): void {
    if (this.eyeTracker) {
      this.eyeTracker.stopTracking()
      this.eyeTrackingEnabled = false
      console.log('AdvancedEngagementTracker: Eye tracking disabled')
    }
  }

  private setupListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => this.handleFocus())
      window.addEventListener('blur', () => this.handleBlur())
      document.addEventListener('visibilitychange', () => {
        document.hidden ? this.handleBlur() : this.handleFocus()
      })
    }
  }

  private handleFocus() {
    if (!this.isFocused) {
      this.isFocused = true
      this.focusStartTime = Date.now()
    }
  }

  private handleBlur() {
    if (this.isFocused) {
      this.isFocused = false
      this.totalFocusTime += Date.now() - this.focusStartTime
    }
  }

  trackMouse(x: number, y: number) {
    const distance = Math.sqrt(
      Math.pow(x - this.lastMousePos.x, 2) + Math.pow(y - this.lastMousePos.y, 2)
    )

    if (distance > this.MOUSE_THRESHOLD) {
      this.totalMouseDistance += distance
      this.lastMousePos = { x, y }
    }

    this.takeSnapshot(x, y, false)
  }

  trackInteraction() {
    this.interactionCount++

    if (this.snapshots.length > 0) {
      this.snapshots[this.snapshots.length - 1].hasInteraction = true
    }
  }

  updateAudioMetrics(engagement: number, speechRate: number, latency: number) {
    this.audioEngagementScore = engagement
    this.speechRate = speechRate
    this.responseLatency = latency
  }

  updateEmotionalState(frustration: number, confusion: number) {
    this.frustrationLevel = frustration
    this.confusionLevel = confusion
  }

  private takeSnapshot(mouseX: number, mouseY: number, hasInteraction: boolean) {
    const now = Date.now()
    if (now - this.lastSnapshotTime < this.SNAPSHOT_INTERVAL) {
      return
    }

    let eyeGaze: EyeGazePoint | null = null
    let fixationDuration = 0

    if (this.eyeTrackingEnabled && this.eyeTracker) {
      const gazeData = this.eyeTracker.getGazeData()
      if (gazeData.length > 0) {
        eyeGaze = gazeData[gazeData.length - 1]
      }

      const fixations = this.eyeTracker.getFixations()
      if (fixations.length > 0) {
        fixationDuration = fixations[fixations.length - 1].duration
      }
    }

    const metrics = this.getMetrics()

    const snapshot: EngagementSnapshot = {
      timestamp: now,
      isFocused: this.isFocused,
      mouseX,
      mouseY,
      hasInteraction,
      eyeGaze,
      fixationDuration,
      attentionScore: metrics.attentionScore,
      engagementScore: metrics.engagementScore,
      frustrationLevel: metrics.frustrationLevel,
    }

    this.snapshots.push(snapshot)

    // Keep last 30 snapshots (1 minute)
    if (this.snapshots.length > 30) {
      this.snapshots.shift()
    }

    this.lastSnapshotTime = now
  }

  getMetrics(): EngagementMetrics {
    const now = Date.now()
    const totalTime = now - this.startTime

    let currentFocusTime = this.totalFocusTime
    if (this.isFocused) {
      currentFocusTime += now - this.focusStartTime
    }

    // Basic attention score from focus
    const focusRatio = totalTime > 0 ? currentFocusTime / totalTime : 0
    const baseFocusScore = Math.min(100, focusRatio * 100)

    // Eye tracking scores
    let eyeTrackingScore = 0
    let avgFixationDuration = 0
    let gazeDispersion = 0
    let saccadeVelocity = 0

    if (this.eyeTrackingEnabled && this.eyeTracker) {
      eyeTrackingScore = this.eyeTracker.getAttentionScore()
      const scanpath: ScanpathData = this.eyeTracker.getScanpathData()
      avgFixationDuration = scanpath.avgFixationDuration
      gazeDispersion = scanpath.gazeDispersion

      if (scanpath.velocityMap.length > 0) {
        saccadeVelocity =
          scanpath.velocityMap.reduce((a, b) => a + b, 0) / scanpath.velocityMap.length
      }
    }

    // Compute combined attention score
    const attentionScore = this.eyeTrackingEnabled
      ? (baseFocusScore * 0.3 + eyeTrackingScore * 0.7)
      : baseFocusScore

    // Interaction metrics
    const interactionRate =
      totalTime > 0 ? (this.interactionCount / (totalTime / 1000)) * 10 : 0
    const mouseActivity = Math.min(100, (this.totalMouseDistance / 1000) * 10)

    // Engagement score (multimodal)
    // Weights: attention (40%), interaction (20%), mouse (10%), audio (20%), emotional (10%)
    const engagementScore = Math.min(
      100,
      attentionScore * 0.4 +
        Math.min(100, interactionRate * 10) * 0.2 +
        mouseActivity * 0.1 +
        this.audioEngagementScore * 0.2 +
        (100 - this.frustrationLevel) * 0.1
    )

    // Determine engagement level based on thresholds
    let engagementLevel: 'high' | 'medium' | 'low' | 'critical'
    if (
      attentionScore < this.thresholds.criticalAttentionScore ||
      engagementScore < this.thresholds.criticalEngagementScore ||
      this.frustrationLevel > this.thresholds.criticalFrustrationLevel
    ) {
      engagementLevel = 'critical'
    } else if (
      attentionScore < this.thresholds.minAttentionScore ||
      engagementScore < this.thresholds.minEngagementScore ||
      this.frustrationLevel > this.thresholds.maxFrustrationLevel
    ) {
      engagementLevel = 'low'
    } else if (engagementScore >= 70 && attentionScore >= 70) {
      engagementLevel = 'high'
    } else {
      engagementLevel = 'medium'
    }

    return {
      focusTime: currentFocusTime,
      activeTime: totalTime,
      interactionCount: this.interactionCount,
      mouseMovement: this.totalMouseDistance,
      eyeTrackingScore,
      avgFixationDuration,
      gazeDispersion,
      saccadeVelocity,
      audioEngagementScore: this.audioEngagementScore,
      speechRate: this.speechRate,
      responseLatency: this.responseLatency,
      attentionScore: Math.round(attentionScore),
      engagementScore: Math.round(engagementScore),
      frustrationLevel: Math.round(this.frustrationLevel),
      confusionLevel: Math.round(this.confusionLevel),
      engagementLevel,
    }
  }

  getSnapshots(): EngagementSnapshot[] {
    return this.snapshots
  }

  getScanpathData(): ScanpathData | null {
    if (this.eyeTrackingEnabled && this.eyeTracker) {
      return this.eyeTracker.getScanpathData()
    }
    return null
  }

  shouldTriggerBreak(): boolean {
    const metrics = this.getMetrics()
    const minutesActive = metrics.activeTime / 60000

    // Trigger break if:
    // 1. Session exceeds break frequency threshold
    // 2. Engagement is critical
    // 3. Frustration is too high

    if (minutesActive >= this.thresholds.breakFrequency) {
      return true
    }

    if (metrics.engagementLevel === 'critical') {
      return true
    }

    if (metrics.frustrationLevel >= this.thresholds.criticalFrustrationLevel) {
      return true
    }

    return false
  }

  shouldEndSession(): boolean {
    const metrics = this.getMetrics()
    const minutesActive = metrics.activeTime / 60000

    return minutesActive >= this.thresholds.maxSessionLength
  }

  reset() {
    this.startTime = Date.now()
    this.lastFocusTime = Date.now()
    this.lastMousePos = { x: 0, y: 0 }
    this.totalMouseDistance = 0
    this.interactionCount = 0
    this.isFocused = true
    this.focusStartTime = Date.now()
    this.totalFocusTime = 0
    this.snapshots = []
    this.lastSnapshotTime = 0
    this.audioEngagementScore = 0
    this.speechRate = 0
    this.responseLatency = 0
    this.frustrationLevel = 0
    this.confusionLevel = 0

    if (this.eyeTracker) {
      this.eyeTracker.reset()
    }
  }

  cleanup() {
    if (this.eyeTracker) {
      this.eyeTracker.cleanup()
    }
  }
}

// Singleton
let advancedTrackerInstance: AdvancedEngagementTracker | null = null

export function getAdvancedEngagementTracker(): AdvancedEngagementTracker {
  if (typeof window === 'undefined') {
    throw new Error('AdvancedEngagementTracker can only be used on the client side')
  }

  if (!advancedTrackerInstance) {
    advancedTrackerInstance = new AdvancedEngagementTracker()
  }

  return advancedTrackerInstance
}

// React hook
export function useAdvancedEngagementTracking() {
  if (typeof window === 'undefined') {
    return {
      enableEyeTracking: async () => false,
      trackMouse: () => {},
      trackInteraction: () => {},
      updateAudioMetrics: () => {},
      updateEmotionalState: () => {},
      getMetrics: () => ({} as EngagementMetrics),
      getSnapshots: () => [],
      shouldTriggerBreak: () => false,
      shouldEndSession: () => false,
      setThresholds: () => {},
      reset: () => {},
    }
  }

  const tracker = getAdvancedEngagementTracker()

  return {
    enableEyeTracking: () => tracker.enableEyeTracking(),
    disableEyeTracking: () => tracker.disableEyeTracking(),
    trackMouse: (x: number, y: number) => tracker.trackMouse(x, y),
    trackInteraction: () => tracker.trackInteraction(),
    updateAudioMetrics: (engagement: number, speechRate: number, latency: number) =>
      tracker.updateAudioMetrics(engagement, speechRate, latency),
    updateEmotionalState: (frustration: number, confusion: number) =>
      tracker.updateEmotionalState(frustration, confusion),
    getMetrics: () => tracker.getMetrics(),
    getSnapshots: () => tracker.getSnapshots(),
    getScanpathData: () => tracker.getScanpathData(),
    shouldTriggerBreak: () => tracker.shouldTriggerBreak(),
    shouldEndSession: () => tracker.shouldEndSession(),
    setThresholds: (thresholds: Partial<AdaptiveThresholds>) => tracker.setThresholds(thresholds),
    reset: () => tracker.reset(),
    cleanup: () => tracker.cleanup(),
  }
}
