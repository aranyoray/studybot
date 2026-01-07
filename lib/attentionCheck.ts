/**
 * Attention Check System
 * Validates session quality and flags inattentive or invalid sessions
 */

export interface AttentionCheckResult {
  passed: boolean
  responseTime: number
  timestamp: number
  checkType: 'simple' | 'catch-question' | 'consistency'
}

export interface SessionQualityMetrics {
  attentionChecksPassed: number
  attentionChecksFailed: number
  attentionScore: number // 0-100
  isValidSession: boolean
  qualityFlags: string[]
}

export class AttentionCheckSystem {
  private checks: AttentionCheckResult[] = []
  private responsePatterns: number[] = []
  private interactionEvents: number[] = []

  // Thresholds
  private readonly MIN_ATTENTION_CHECKS_PASSED = 2 // out of 3
  private readonly MAX_RESPONSE_TIME_VARIANCE = 0.8 // coefficient of variation
  private readonly MIN_INTERACTION_EVENTS = 5
  private readonly SUSPICIOUS_PATTERN_THRESHOLD = 0.9 // too regular = bot-like

  /**
   * Generate a simple attention check question
   */
  generateSimpleCheck(): {
    question: string
    correctAnswer: string | number
    options: (string | number)[]
    type: 'simple'
  } {
    const checks = [
      {
        question: 'What color is the sky on a clear day?',
        correctAnswer: 'Blue',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
      },
      {
        question: 'How many fingers are on one hand?',
        correctAnswer: 5,
        options: [3, 4, 5, 6],
      },
      {
        question: 'Click the star: ⭐',
        correctAnswer: '⭐',
        options: ['❤️', '⭐', '🌙', '☀️'],
      },
      {
        question: 'What comes after 2? (1, 2, __, 4)',
        correctAnswer: 3,
        options: [2, 3, 4, 5],
      },
    ]

    const check = checks[Math.floor(Math.random() * checks.length)]

    return {
      ...check,
      type: 'simple' as const,
    }
  }

  /**
   * Generate a catch question that appears within normal content
   */
  generateCatchQuestion(): {
    question: string
    correctAnswer: string
    options: string[]
    type: 'catch-question'
  } {
    return {
      question: 'This is an attention check. Please select "I am paying attention"',
      correctAnswer: 'I am paying attention',
      options: [
        'I am paying attention',
        'Continue',
        'Next',
        'Skip',
      ],
      type: 'catch-question' as const,
    }
  }

  /**
   * Record attention check result
   */
  recordCheck(
    userAnswer: string | number,
    correctAnswer: string | number,
    responseTime: number,
    checkType: 'simple' | 'catch-question' | 'consistency'
  ): AttentionCheckResult {
    const passed = String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase()

    const result: AttentionCheckResult = {
      passed,
      responseTime,
      timestamp: Date.now(),
      checkType,
    }

    this.checks.push(result)

    return result
  }

  /**
   * Record response pattern for consistency analysis
   */
  recordResponse(responseTime: number): void {
    this.responsePatterns.push(responseTime)

    // Keep only last 20 responses
    if (this.responsePatterns.length > 20) {
      this.responsePatterns.shift()
    }
  }

  /**
   * Record interaction event (click, keypress, etc.)
   */
  recordInteraction(): void {
    this.interactionEvents.push(Date.now())

    // Keep only last 50 events
    if (this.interactionEvents.length > 50) {
      this.interactionEvents.shift()
    }
  }

  /**
   * Detect suspicious response patterns (bot-like behavior)
   */
  private detectSuspiciousPatterns(): boolean {
    if (this.responsePatterns.length < 5) return false

    // Check if responses are too regular (same timing)
    const mean =
      this.responsePatterns.reduce((a, b) => a + b, 0) / this.responsePatterns.length
    const variance =
      this.responsePatterns.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) /
      this.responsePatterns.length
    const coefficientOfVariation = Math.sqrt(variance) / mean

    // Too little variation suggests automated responses
    return coefficientOfVariation < 0.1
  }

  /**
   * Detect rapid clicking (spamming)
   */
  private detectRapidClicking(): boolean {
    if (this.interactionEvents.length < 3) return false

    // Check for 3+ clicks within 500ms
    const recentEvents = this.interactionEvents.slice(-3)
    const timeSpan = recentEvents[recentEvents.length - 1] - recentEvents[0]

    return timeSpan < 500
  }

  /**
   * Check for extremely fast or slow response times
   */
  private detectAnomalousSpeed(): boolean {
    if (this.responsePatterns.length < 3) return false

    const avgResponseTime =
      this.responsePatterns.reduce((a, b) => a + b, 0) / this.responsePatterns.length

    // Too fast (< 300ms average) or too slow (> 30s average)
    return avgResponseTime < 300 || avgResponseTime > 30000
  }

  /**
   * Evaluate overall session quality
   */
  evaluateSessionQuality(): SessionQualityMetrics {
    const passed = this.checks.filter(c => c.passed).length
    const failed = this.checks.filter(c => !c.passed).length
    const total = this.checks.length

    const qualityFlags: string[] = []

    // Flag 1: Failed attention checks
    if (total > 0 && passed < this.MIN_ATTENTION_CHECKS_PASSED) {
      qualityFlags.push('FAILED_ATTENTION_CHECKS')
    }

    // Flag 2: Suspicious patterns
    if (this.detectSuspiciousPatterns()) {
      qualityFlags.push('SUSPICIOUS_PATTERN')
    }

    // Flag 3: Rapid clicking
    if (this.detectRapidClicking()) {
      qualityFlags.push('RAPID_CLICKING')
    }

    // Flag 4: Anomalous speed
    if (this.detectAnomalousSpeed()) {
      qualityFlags.push('ANOMALOUS_SPEED')
    }

    // Flag 5: Insufficient interaction
    if (this.interactionEvents.length < this.MIN_INTERACTION_EVENTS) {
      qualityFlags.push('LOW_INTERACTION')
    }

    // Calculate attention score
    const baseScore = total > 0 ? (passed / total) * 100 : 0
    const penaltyPerFlag = 10
    const attentionScore = Math.max(
      0,
      Math.round(baseScore - qualityFlags.length * penaltyPerFlag)
    )

    // Session is valid if attention score >= 60 and no critical flags
    const criticalFlags = ['FAILED_ATTENTION_CHECKS', 'SUSPICIOUS_PATTERN']
    const hasCriticalFlag = qualityFlags.some(flag => criticalFlags.includes(flag))
    const isValidSession = attentionScore >= 60 && !hasCriticalFlag

    return {
      attentionChecksPassed: passed,
      attentionChecksFailed: failed,
      attentionScore,
      isValidSession,
      qualityFlags,
    }
  }

  /**
   * Get summary report
   */
  getSummary(): {
    totalChecks: number
    passRate: number
    averageResponseTime: number
    qualityMetrics: SessionQualityMetrics
  } {
    const totalChecks = this.checks.length
    const passRate =
      totalChecks > 0
        ? (this.checks.filter(c => c.passed).length / totalChecks) * 100
        : 0

    const averageResponseTime =
      this.checks.length > 0
        ? this.checks.reduce((sum, c) => sum + c.responseTime, 0) / this.checks.length
        : 0

    const qualityMetrics = this.evaluateSessionQuality()

    return {
      totalChecks,
      passRate,
      averageResponseTime,
      qualityMetrics,
    }
  }

  /**
   * Reset for new session
   */
  reset(): void {
    this.checks = []
    this.responsePatterns = []
    this.interactionEvents = []
  }
}

// Singleton instance
let attentionCheckInstance: AttentionCheckSystem | null = null

export function getAttentionCheckSystem(): AttentionCheckSystem {
  if (!attentionCheckInstance) {
    attentionCheckInstance = new AttentionCheckSystem()
  }
  return attentionCheckInstance
}

export function resetAttentionCheckSystem(): void {
  if (attentionCheckInstance) {
    attentionCheckInstance.reset()
  }
}
