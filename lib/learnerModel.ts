/**
 * Dynamic Learner Model
 * Tracks cognitive-emotional state and adapts learning experience
 */

export interface ErrorPattern {
  errorType: 'procedural' | 'conceptual' | 'careless' | 'unknown'
  frequency: number
  lastOccurrence: number
  context: string
}

export interface ResponseMetrics {
  meanResponseTime: number // milliseconds
  responseTimeVariance: number
  hesitationCount: number // times user paused before answering
  confidenceLevel: number // 1-10
}

export interface MouseBehavior {
  trajectoryEntropy: number // higher = more uncertainty
  hesitationPatterns: number[] // pause durations
  clickAccuracy: number // distance from target
  movementSmoothness: number // lower = more erratic
}

export interface CognitiveMetrics {
  workingMemoryScore: number // 0-100
  attentionScore: number // 0-100
  processingSpeed: number // items per minute
  inhibitionControl: number // 0-100
}

export interface AffectiveState {
  confidence: number // 1-10, self-reported
  frustration: number // 0-100, inferred
  anxiety: number // 0-100, baseline from survey
  avoidanceSignals: number // count of task-avoidance behaviors
  engagement: number // 0-100
}

export interface SkillProfile {
  numberSense: number // 0-100
  magnitude: number // 0-100
  sequencing: number // 0-100
  wordProblems: number // 0-100
  arithmeticFluency: number // 0-100
}

export interface SessionHistory {
  sessionId: string
  timestamp: number
  duration: number // milliseconds
  tasksCompleted: number
  accuracy: number // 0-100
  cognitiveLoad: number // 0-100, inferred
  completionRate: number // 0-100
  reflectionResponses: string[]
}

export interface LearnerModel {
  userId: string
  createdAt: number
  lastUpdated: number

  // Performance tracking
  skillProfile: SkillProfile
  errorPatterns: ErrorPattern[]
  responseMetrics: ResponseMetrics

  // Behavioral tracking
  mouseBehavior: MouseBehavior
  attentionMetrics: {
    gazeStability: number // 0-100, if eye tracking enabled
    focusDuration: number // avg seconds before distraction
    attentionChecksPassed: number
    attentionChecksFailed: number
  }

  // Cognitive state
  cognitiveMetrics: CognitiveMetrics

  // Affective state
  affectiveState: AffectiveState

  // Adaptation parameters
  currentDifficulty: number // 1-10
  hintFrequency: number // 0-1 (0=never, 1=always)
  taskPacing: number // 0.5-2.0 multiplier
  feedbackTone: 'encouraging' | 'directive' | 'neutral'

  // Session history
  sessions: SessionHistory[]
  totalSessions: number
  consecutiveDays: number
  lastSessionDate: string // ISO date
}

export class LearnerModelEngine {
  private model: LearnerModel

  constructor(userId: string, baselineProfile?: Partial<LearnerModel>) {
    this.model = {
      userId,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      skillProfile: {
        numberSense: 50,
        magnitude: 50,
        sequencing: 50,
        wordProblems: 50,
        arithmeticFluency: 50,
      },
      errorPatterns: [],
      responseMetrics: {
        meanResponseTime: 3000,
        responseTimeVariance: 1000,
        hesitationCount: 0,
        confidenceLevel: 5,
      },
      mouseBehavior: {
        trajectoryEntropy: 0,
        hesitationPatterns: [],
        clickAccuracy: 0,
        movementSmoothness: 0,
      },
      attentionMetrics: {
        gazeStability: 50,
        focusDuration: 30,
        attentionChecksPassed: 0,
        attentionChecksFailed: 0,
      },
      cognitiveMetrics: {
        workingMemoryScore: 50,
        attentionScore: 50,
        processingSpeed: 20,
        inhibitionControl: 50,
      },
      affectiveState: {
        confidence: 5,
        frustration: 30,
        anxiety: 50,
        avoidanceSignals: 0,
        engagement: 50,
      },
      currentDifficulty: 3,
      hintFrequency: 0.5,
      taskPacing: 1.0,
      feedbackTone: 'encouraging',
      sessions: [],
      totalSessions: 0,
      consecutiveDays: 0,
      lastSessionDate: '',
      ...baselineProfile,
    }
  }

  getModel(): LearnerModel {
    return { ...this.model }
  }

  updateFromSession(sessionData: {
    accuracy: number
    responseTimes: number[]
    errorTypes: ErrorPattern[]
    mouseData: Partial<MouseBehavior>
    cognitiveScores: Partial<CognitiveMetrics>
    affectiveInputs: Partial<AffectiveState>
    tasksCompleted: number
    reflections: string[]
  }): void {
    // Update skill profile based on accuracy
    this.updateSkillProfile(sessionData.accuracy)

    // Update response metrics
    this.updateResponseMetrics(sessionData.responseTimes)

    // Track error patterns
    this.updateErrorPatterns(sessionData.errorTypes)

    // Update mouse behavior
    this.updateMouseBehavior(sessionData.mouseData)

    // Update cognitive metrics
    this.updateCognitiveMetrics(sessionData.cognitiveScores)

    // Update affective state
    this.updateAffectiveState(sessionData.affectiveInputs)

    // Adapt parameters
    this.adaptParameters()

    // Record session
    this.recordSession({
      accuracy: sessionData.accuracy,
      tasksCompleted: sessionData.tasksCompleted,
      reflections: sessionData.reflections,
    })

    this.model.lastUpdated = Date.now()
  }

  private updateSkillProfile(accuracy: number): void {
    // Gradual skill updates using exponential moving average
    const alpha = 0.2 // learning rate
    Object.keys(this.model.skillProfile).forEach(skill => {
      this.model.skillProfile[skill as keyof SkillProfile] =
        this.model.skillProfile[skill as keyof SkillProfile] * (1 - alpha) +
        accuracy * alpha
    })
  }

  private updateResponseMetrics(responseTimes: number[]): void {
    if (responseTimes.length === 0) return

    const mean = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    const variance =
      responseTimes.reduce((sum, rt) => sum + Math.pow(rt - mean, 2), 0) /
      responseTimes.length

    this.model.responseMetrics.meanResponseTime = mean
    this.model.responseMetrics.responseTimeVariance = variance

    // Count hesitations (response times > 2x mean)
    this.model.responseMetrics.hesitationCount = responseTimes.filter(
      rt => rt > mean * 2
    ).length
  }

  private updateErrorPatterns(newErrors: ErrorPattern[]): void {
    newErrors.forEach(error => {
      const existing = this.model.errorPatterns.find(
        e => e.errorType === error.errorType && e.context === error.context
      )

      if (existing) {
        existing.frequency++
        existing.lastOccurrence = Date.now()
      } else {
        this.model.errorPatterns.push({
          ...error,
          lastOccurrence: Date.now(),
        })
      }
    })

    // Keep only recent error patterns (last 20 sessions)
    if (this.model.errorPatterns.length > 50) {
      this.model.errorPatterns.sort((a, b) => b.lastOccurrence - a.lastOccurrence)
      this.model.errorPatterns = this.model.errorPatterns.slice(0, 50)
    }
  }

  private updateMouseBehavior(data: Partial<MouseBehavior>): void {
    this.model.mouseBehavior = {
      ...this.model.mouseBehavior,
      ...data,
    }
  }

  private updateCognitiveMetrics(scores: Partial<CognitiveMetrics>): void {
    // Exponential moving average
    const alpha = 0.3
    Object.keys(scores).forEach(key => {
      const metric = key as keyof CognitiveMetrics
      this.model.cognitiveMetrics[metric] =
        this.model.cognitiveMetrics[metric] * (1 - alpha) +
        (scores[metric] || 0) * alpha
    })
  }

  private updateAffectiveState(inputs: Partial<AffectiveState>): void {
    this.model.affectiveState = {
      ...this.model.affectiveState,
      ...inputs,
    }

    // Infer frustration from behavior
    if (this.model.responseMetrics.hesitationCount > 3) {
      this.model.affectiveState.frustration = Math.min(
        100,
        this.model.affectiveState.frustration + 10
      )
    } else {
      this.model.affectiveState.frustration = Math.max(
        0,
        this.model.affectiveState.frustration - 5
      )
    }
  }

  private adaptParameters(): void {
    const { affectiveState, skillProfile, responseMetrics } = this.model

    // Adjust difficulty based on performance and frustration
    const avgSkill =
      Object.values(skillProfile).reduce((a, b) => a + b, 0) /
      Object.values(skillProfile).length

    if (avgSkill > 80 && affectiveState.frustration < 30) {
      // Increase difficulty
      this.model.currentDifficulty = Math.min(10, this.model.currentDifficulty + 0.5)
    } else if (avgSkill < 40 || affectiveState.frustration > 70) {
      // Decrease difficulty
      this.model.currentDifficulty = Math.max(1, this.model.currentDifficulty - 0.5)
    }

    // Adjust hint frequency based on confidence and errors
    if (affectiveState.confidence < 4 || this.model.errorPatterns.length > 10) {
      this.model.hintFrequency = Math.min(1, this.model.hintFrequency + 0.1)
    } else if (affectiveState.confidence > 7) {
      this.model.hintFrequency = Math.max(0, this.model.hintFrequency - 0.1)
    }

    // Adjust pacing based on processing speed
    if (responseMetrics.meanResponseTime > 5000) {
      this.model.taskPacing = Math.max(0.5, this.model.taskPacing - 0.1)
    } else if (responseMetrics.meanResponseTime < 2000) {
      this.model.taskPacing = Math.min(2.0, this.model.taskPacing + 0.1)
    }

    // Adjust feedback tone based on anxiety and frustration
    if (affectiveState.anxiety > 60 || affectiveState.frustration > 60) {
      this.model.feedbackTone = 'encouraging'
    } else if (affectiveState.confidence > 7 && affectiveState.engagement > 70) {
      this.model.feedbackTone = 'directive'
    } else {
      this.model.feedbackTone = 'neutral'
    }
  }

  private recordSession(data: {
    accuracy: number
    tasksCompleted: number
    reflections: string[]
  }): void {
    const session: SessionHistory = {
      sessionId: `session-${Date.now()}`,
      timestamp: Date.now(),
      duration: 600000, // 10 minutes
      tasksCompleted: data.tasksCompleted,
      accuracy: data.accuracy,
      cognitiveLoad: this.estimateCognitiveLoad(),
      completionRate: (data.tasksCompleted / 10) * 100, // assuming ~10 tasks per session
      reflectionResponses: data.reflections,
    }

    this.model.sessions.push(session)
    this.model.totalSessions++

    // Update consecutive days
    const today = new Date().toISOString().split('T')[0]
    const lastDate = this.model.lastSessionDate

    if (lastDate) {
      const daysDiff =
        (new Date(today).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24)

      if (daysDiff === 1) {
        this.model.consecutiveDays++
      } else if (daysDiff > 1) {
        this.model.consecutiveDays = 1
      }
    } else {
      this.model.consecutiveDays = 1
    }

    this.model.lastSessionDate = today

    // Keep only last 30 sessions in memory
    if (this.model.sessions.length > 30) {
      this.model.sessions.shift()
    }
  }

  private estimateCognitiveLoad(): number {
    // Estimate based on response time variance, hesitation, and errors
    const rtVariance = this.model.responseMetrics.responseTimeVariance
    const hesitation = this.model.responseMetrics.hesitationCount
    const errors = this.model.errorPatterns.length

    const loadScore =
      Math.min(100, (rtVariance / 100) * 30 + hesitation * 10 + errors * 5)

    return Math.round(loadScore)
  }

  getAdaptationRecommendations(): {
    difficulty: number
    hints: boolean
    pacing: string
    feedback: string
  } {
    return {
      difficulty: Math.round(this.model.currentDifficulty),
      hints: this.model.hintFrequency > 0.5,
      pacing:
        this.model.taskPacing < 0.8
          ? 'slower'
          : this.model.taskPacing > 1.2
          ? 'faster'
          : 'normal',
      feedback: this.model.feedbackTone,
    }
  }

  shouldTriggerIntervention(): boolean {
    // Trigger intervention if frustration is high and confidence is low
    return (
      this.model.affectiveState.frustration > 70 ||
      (this.model.affectiveState.confidence < 3 && this.model.errorPatterns.length > 5)
    )
  }
}

// Singleton for current session
let currentLearnerModel: LearnerModelEngine | null = null

export function initializeLearnerModel(
  userId: string,
  baseline?: Partial<LearnerModel>
): LearnerModelEngine {
  currentLearnerModel = new LearnerModelEngine(userId, baseline)
  return currentLearnerModel
}

export function getCurrentLearnerModel(): LearnerModelEngine | null {
  return currentLearnerModel
}
