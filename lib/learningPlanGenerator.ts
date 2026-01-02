/**
 * Learning Plan Generator
 * Creates personalized learning plans based on user profile, goals, and progress
 */

import { generateAssistiveConfig, type AssistiveConfig } from './assistiveFeatures'

export interface LearningActivity {
  activityId: string
  activityType: 'reading' | 'math' | 'writing' | 'science' | 'game' | 'exercise' | 'assessment'
  subject: string
  title: string
  description: string
  estimatedDuration: number // minutes
  difficulty: number // 1-10
  adaptations: string[]
  goals: string[]
  resources: string[]
}

export interface LearningPlan {
  planId: string
  userId: string
  createdAt: Date
  startDate: Date
  endDate: Date

  // Customization
  activities: LearningActivity[]
  accommodations: string[]
  assistiveConfig: AssistiveConfig

  // Goals
  weeklyGoals: string[]
  dailyMinutes: number

  // Progress
  currentDifficulty: number
  paceAdjustment: number
}

export interface UserProfile {
  age: number
  gradeLevel: string
  diagnosedConditions: {
    dyslexia: boolean
    dyscalculia: boolean
    adhd: boolean
    asd: boolean
    dysgraphia: boolean
    processingDisorder: boolean
    anxietyDisorder: boolean
    other: string
  }
  preferredLearningStyle: string[]
  learningGoals: string[]
  subjectsNeedHelp: string[]
  preferredSessionLength: number
  selfReportedConfidence: number
  motivationLevel: number
  anxietyLevel: number
}

export class LearningPlanGenerator {
  private activityDatabase: Map<string, LearningActivity[]> = new Map()

  constructor() {
    this.initializeActivityDatabase()
  }

  private initializeActivityDatabase(): void {
    // Math activities
    this.activityDatabase.set('math', [
      {
        activityId: 'math-001',
        activityType: 'math',
        subject: 'math',
        title: 'Number Recognition Practice',
        description: 'Interactive games to practice recognizing and identifying numbers',
        estimatedDuration: 15,
        difficulty: 2,
        adaptations: ['visual-aids', 'number-line', 'manipulatives'],
        goals: ['number-recognition', 'counting'],
        resources: ['number-cards', 'counting-blocks'],
      },
      {
        activityId: 'math-002',
        activityType: 'math',
        subject: 'math',
        title: 'Basic Addition',
        description: 'Learn addition with visual support and step-by-step guidance',
        estimatedDuration: 20,
        difficulty: 3,
        adaptations: ['visual-calculator', 'number-line', 'step-by-step'],
        goals: ['addition', 'problem-solving'],
        resources: ['addition-cards', 'interactive-games'],
      },
      {
        activityId: 'math-003',
        activityType: 'game',
        subject: 'math',
        title: 'Math Adventure Game',
        description: 'Gamified math practice with rewards and progression',
        estimatedDuration: 25,
        difficulty: 4,
        adaptations: ['hints-available', 'adjustable-difficulty'],
        goals: ['engagement', 'math-fluency'],
        resources: ['game-platform'],
      },
    ])

    // Reading activities
    this.activityDatabase.set('reading', [
      {
        activityId: 'read-001',
        activityType: 'reading',
        subject: 'reading',
        title: 'Letter Sound Practice',
        description: 'Phonics practice with multi-sensory approach',
        estimatedDuration: 15,
        difficulty: 2,
        adaptations: ['text-to-speech', 'large-font', 'dyslexia-font'],
        goals: ['phonics', 'letter-recognition'],
        resources: ['phonics-cards', 'audio-support'],
      },
      {
        activityId: 'read-002',
        activityType: 'reading',
        subject: 'reading',
        title: 'Interactive Story Reading',
        description: 'Engaging stories with comprehension questions',
        estimatedDuration: 20,
        difficulty: 4,
        adaptations: ['text-to-speech', 'highlighting', 'chunking'],
        goals: ['reading-comprehension', 'vocabulary'],
        resources: ['digital-books', 'comprehension-tools'],
      },
    ])

    // Writing activities
    this.activityDatabase.set('writing', [
      {
        activityId: 'write-001',
        activityType: 'writing',
        subject: 'writing',
        title: 'Creative Story Starter',
        description: 'Begin creative writing with prompts and support',
        estimatedDuration: 20,
        difficulty: 3,
        adaptations: ['speech-to-text', 'word-prediction', 'grammar-help'],
        goals: ['creative-writing', 'expression'],
        resources: ['writing-prompts', 'stt-tool'],
      },
    ])

    // Organization/Study Skills
    this.activityDatabase.set('organization', [
      {
        activityId: 'org-001',
        activityType: 'exercise',
        subject: 'organization',
        title: 'Task Planning Practice',
        description: 'Learn to break down tasks and create schedules',
        estimatedDuration: 15,
        difficulty: 2,
        adaptations: ['visual-schedules', 'checklists', 'reminders'],
        goals: ['executive-function', 'planning'],
        resources: ['digital-planner', 'checklist-tool'],
      },
    ])
  }

  generatePlan(profile: UserProfile, weekDuration: number = 4): LearningPlan {
    const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + weekDuration * 7)

    // Generate assistive configuration
    const assistiveConfig = generateAssistiveConfig(profile.diagnosedConditions)

    // Select activities based on profile
    const activities = this.selectActivities(profile)

    // Generate accommodations list
    const accommodations = this.generateAccommodations(profile)

    // Generate weekly goals
    const weeklyGoals = this.generateWeeklyGoals(profile)

    // Determine daily minutes based on session length and conditions
    const dailyMinutes = this.calculateDailyMinutes(profile)

    // Set initial difficulty based on confidence
    const currentDifficulty = this.calculateInitialDifficulty(profile)

    return {
      planId,
      userId: profile.userId || 'unknown',
      createdAt: new Date(),
      startDate,
      endDate,
      activities,
      accommodations,
      assistiveConfig,
      weeklyGoals,
      dailyMinutes,
      currentDifficulty,
      paceAdjustment: 1.0,
    }
  }

  private selectActivities(profile: UserProfile): LearningActivity[] {
    const selectedActivities: LearningActivity[] = []

    // For each subject the user needs help with
    profile.subjectsNeedHelp.forEach(subject => {
      const subjectActivities = this.activityDatabase.get(subject) || []

      // Filter by difficulty (based on user confidence)
      const targetDifficulty = this.calculateInitialDifficulty(profile)
      const suitableActivities = subjectActivities.filter(
        activity => Math.abs(activity.difficulty - targetDifficulty) <= 2
      )

      // Add adaptations based on learning style and conditions
      const adaptedActivities = suitableActivities.map(activity => {
        const adaptations = [...activity.adaptations]

        // Add learning style adaptations
        if (profile.preferredLearningStyle.includes('visual')) {
          adaptations.push('visual-aids', 'diagrams', 'color-coding')
        }
        if (profile.preferredLearningStyle.includes('auditory')) {
          adaptations.push('audio-support', 'verbal-instructions')
        }
        if (profile.preferredLearningStyle.includes('kinesthetic')) {
          adaptations.push('interactive-elements', 'hands-on')
        }

        // Add condition-specific adaptations
        if (profile.diagnosedConditions.dyslexia) {
          adaptations.push('dyslexia-font', 'text-to-speech', 'line-highlighting')
        }
        if (profile.diagnosedConditions.dyscalculia) {
          adaptations.push('visual-calculator', 'number-line', 'step-by-step')
        }
        if (profile.diagnosedConditions.adhd) {
          adaptations.push('frequent-breaks', 'gamification', 'progress-tracking')
        }
        if (profile.diagnosedConditions.dysgraphia) {
          adaptations.push('speech-to-text', 'typing-allowed', 'reduced-writing')
        }

        return {
          ...activity,
          adaptations: Array.from(new Set(adaptations)), // Remove duplicates
        }
      })

      selectedActivities.push(...adaptedActivities.slice(0, 3)) // Max 3 per subject
    })

    // Ensure variety in activity types
    const balanced = this.balanceActivityTypes(selectedActivities)

    return balanced
  }

  private balanceActivityTypes(activities: LearningActivity[]): LearningActivity[] {
    // Ensure mix of games, exercises, and traditional learning
    const games = activities.filter(a => a.activityType === 'game')
    const exercises = activities.filter(a => a.activityType === 'exercise')
    const learning = activities.filter(
      a => !['game', 'exercise'].includes(a.activityType)
    )

    // Aim for 40% learning, 30% games, 30% exercises
    const balanced = [
      ...learning.slice(0, Math.ceil(activities.length * 0.4)),
      ...games.slice(0, Math.ceil(activities.length * 0.3)),
      ...exercises.slice(0, Math.ceil(activities.length * 0.3)),
    ]

    return balanced
  }

  private generateAccommodations(profile: UserProfile): string[] {
    const accommodations: string[] = []

    if (profile.diagnosedConditions.dyslexia) {
      accommodations.push(
        'Extended time for reading tasks (50% additional)',
        'Text-to-speech for all written content',
        'Dyslexia-friendly fonts and spacing',
        'Colored overlays available',
        'Line-by-line reading support'
      )
    }

    if (profile.diagnosedConditions.dyscalculia) {
      accommodations.push(
        'Visual calculator always available',
        'Number line and manipulatives provided',
        'Step-by-step problem solving guides',
        'Extended time for math (50% additional)',
        'Alternative methods for showing work'
      )
    }

    if (profile.diagnosedConditions.adhd) {
      accommodations.push(
        'Frequent structured breaks (every 15 minutes)',
        'Movement breaks encouraged',
        'Minimal distractions (focus mode)',
        'Checklist for task completion',
        'Visual schedules and timers',
        'Immediate feedback and rewards'
      )
    }

    if (profile.diagnosedConditions.asd) {
      accommodations.push(
        'Predictable structure and routines',
        'Visual schedules with clear expectations',
        'Reduced sensory stimulation',
        'Extra processing time',
        'Clear, literal instructions',
        'Quiet workspace option'
      )
    }

    if (profile.diagnosedConditions.dysgraphia) {
      accommodations.push(
        'Speech-to-text for all writing tasks',
        'Reduced writing requirements',
        'Keyboard/typing option',
        'Extended time for written work'
      )
    }

    if (profile.diagnosedConditions.processingDisorder) {
      accommodations.push(
        'Multi-modal presentation (visual + auditory)',
        'Extra processing time (75% additional)',
        'Simplified instructions',
        'Information in small chunks',
        'Frequent comprehension checks'
      )
    }

    if (profile.diagnosedConditions.anxietyDisorder) {
      accommodations.push(
        'Low-pressure environment',
        'Pause option always available',
        'Progress shown in encouraging way',
        'Mistakes treated as learning opportunities',
        'Option to skip difficult items temporarily'
      )
    }

    return accommodations
  }

  private generateWeeklyGoals(profile: UserProfile): string[] {
    const goals: string[] = []

    // Map learning goals to specific weekly targets
    if (profile.learningGoals.includes('improve-grades')) {
      goals.push('Complete 5 learning activities with 70% accuracy')
    }

    if (profile.learningGoals.includes('build-confidence')) {
      goals.push('Practice consistently for 15 minutes daily')
      goals.push('Celebrate 3 successes this week')
    }

    if (profile.learningGoals.includes('catch-up')) {
      goals.push('Master 2 foundational concepts')
      goals.push('Complete review activities in target subjects')
    }

    if (profile.learningGoals.includes('reduce-anxiety')) {
      goals.push('Use relaxation techniques before sessions')
      goals.push('Complete activities at your own pace')
    }

    if (profile.learningGoals.includes('study-skills')) {
      goals.push('Practice one new organization strategy')
      goals.push('Use planning tools daily')
    }

    // Add subject-specific goals
    profile.subjectsNeedHelp.forEach(subject => {
      goals.push(`Complete 3 ${subject} activities`)
    })

    return goals
  }

  private calculateDailyMinutes(profile: UserProfile): number {
    // Start with preferred session length
    let dailyMinutes = profile.preferredSessionLength

    // Adjust for ADHD (shorter sessions)
    if (profile.diagnosedConditions.adhd) {
      dailyMinutes = Math.min(dailyMinutes, 15)
    }

    // Adjust for anxiety (respect comfort level)
    if (profile.diagnosedConditions.anxietyDisorder) {
      dailyMinutes = Math.min(dailyMinutes, 20)
    }

    // Adjust for ASD (predictable duration)
    if (profile.diagnosedConditions.asd) {
      dailyMinutes = Math.min(dailyMinutes, 20)
    }

    return dailyMinutes
  }

  private calculateInitialDifficulty(profile: UserProfile): number {
    // Base difficulty on self-reported confidence
    // Confidence 1-3 → Difficulty 2-3
    // Confidence 4-6 → Difficulty 4-5
    // Confidence 7-10 → Difficulty 6-8

    if (profile.selfReportedConfidence <= 3) {
      return 2
    } else if (profile.selfReportedConfidence <= 6) {
      return 4
    } else {
      return 6
    }
  }

  updatePlanBasedOnProgress(
    plan: LearningPlan,
    performanceData: {
      accuracy: number
      completionRate: number
      engagementLevel: number
      frustrationLevel: number
    }
  ): LearningPlan {
    const updatedPlan = { ...plan }

    // Adjust difficulty based on performance
    if (performanceData.accuracy > 85 && performanceData.engagementLevel > 70) {
      // Increase difficulty
      updatedPlan.currentDifficulty = Math.min(10, plan.currentDifficulty + 1)
      updatedPlan.paceAdjustment = Math.min(1.5, plan.paceAdjustment + 0.1)
    } else if (performanceData.accuracy < 60 || performanceData.frustrationLevel > 70) {
      // Decrease difficulty
      updatedPlan.currentDifficulty = Math.max(1, plan.currentDifficulty - 1)
      updatedPlan.paceAdjustment = Math.max(0.5, plan.paceAdjustment - 0.1)
    }

    // Update activities based on new difficulty
    // (In production, this would fetch new activities from database)

    return updatedPlan
  }
}

// Export singleton instance
export const learningPlanGenerator = new LearningPlanGenerator()
