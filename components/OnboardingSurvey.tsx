'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, User, Brain, Target, ArrowRight, ArrowLeft } from 'lucide-react'

export interface LearningProfile {
  // Demographics
  age: number
  gradeLevel: string

  // Diagnosed conditions
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

  // Educational support
  hasIEP: boolean
  has504Plan: boolean
  receivesSpecialEducation: boolean

  // Learning preferences
  preferredLearningStyle: ('visual' | 'auditory' | 'kinesthetic' | 'reading')[]
  learningGoals: string[]
  subjectsNeedHelp: string[]

  // Engagement preferences
  preferredSessionLength: number // minutes
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible'

  // Baseline metrics
  selfReportedConfidence: number // 1-10
  motivationLevel: number // 1-10
  anxietyLevel: number // 1-10

  timestamp: number
}

interface SurveyQuestion {
  id: string
  category: 'demographics' | 'conditions' | 'support' | 'preferences' | 'goals' | 'baseline'
  question: string
  type: 'number' | 'select' | 'multiselect' | 'checkbox-group' | 'scale' | 'text'
  options?: { value: string; label: string; description?: string }[]
  required: boolean
  min?: number
  max?: number
}

const ONBOARDING_QUESTIONS: SurveyQuestion[] = [
  // Demographics
  {
    id: 'age',
    category: 'demographics',
    question: 'How old are you?',
    type: 'number',
    required: true,
    min: 5,
    max: 18,
  },
  {
    id: 'gradeLevel',
    category: 'demographics',
    question: 'What grade are you in?',
    type: 'select',
    required: true,
    options: [
      { value: 'k', label: 'Kindergarten' },
      { value: '1', label: '1st Grade' },
      { value: '2', label: '2nd Grade' },
      { value: '3', label: '3rd Grade' },
      { value: '4', label: '4th Grade' },
      { value: '5', label: '5th Grade' },
      { value: '6', label: '6th Grade' },
      { value: '7', label: '7th Grade' },
      { value: '8', label: '8th Grade' },
      { value: '9', label: '9th Grade' },
      { value: '10', label: '10th Grade' },
      { value: '11', label: '11th Grade' },
      { value: '12', label: '12th Grade' },
    ],
  },

  // Diagnosed conditions
  {
    id: 'diagnosedConditions',
    category: 'conditions',
    question: 'Have you been diagnosed with any of these learning differences or conditions?',
    type: 'checkbox-group',
    required: false,
    options: [
      {
        value: 'dyslexia',
        label: 'Dyslexia',
        description: 'Difficulty with reading and language processing'
      },
      {
        value: 'dyscalculia',
        label: 'Dyscalculia',
        description: 'Difficulty with math and numbers'
      },
      {
        value: 'adhd',
        label: 'ADHD',
        description: 'Attention-Deficit/Hyperactivity Disorder'
      },
      {
        value: 'asd',
        label: 'ASD',
        description: 'Autism Spectrum Disorder'
      },
      {
        value: 'dysgraphia',
        label: 'Dysgraphia',
        description: 'Difficulty with writing'
      },
      {
        value: 'processingDisorder',
        label: 'Processing Disorder',
        description: 'Auditory or visual processing challenges'
      },
      {
        value: 'anxietyDisorder',
        label: 'Anxiety Disorder',
        description: 'General or learning-related anxiety'
      },
      {
        value: 'other',
        label: 'Other (please specify)',
        description: ''
      },
    ],
  },

  // Educational support
  {
    id: 'hasIEP',
    category: 'support',
    question: 'Do you have an IEP (Individualized Education Program)?',
    type: 'select',
    required: false,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not-sure', label: "I'm not sure" },
    ],
  },
  {
    id: 'has504Plan',
    category: 'support',
    question: 'Do you have a 504 Plan?',
    type: 'select',
    required: false,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not-sure', label: "I'm not sure" },
    ],
  },

  // Learning preferences
  {
    id: 'preferredLearningStyle',
    category: 'preferences',
    question: 'How do you learn best? (Select all that apply)',
    type: 'checkbox-group',
    required: true,
    options: [
      { value: 'visual', label: 'Visual', description: 'Pictures, diagrams, and videos' },
      { value: 'auditory', label: 'Auditory', description: 'Listening and speaking' },
      { value: 'kinesthetic', label: 'Kinesthetic', description: 'Hands-on and movement' },
      { value: 'reading', label: 'Reading/Writing', description: 'Text and written materials' },
    ],
  },
  {
    id: 'subjectsNeedHelp',
    category: 'preferences',
    question: 'Which subjects would you like help with?',
    type: 'checkbox-group',
    required: true,
    options: [
      { value: 'math', label: 'Math' },
      { value: 'reading', label: 'Reading' },
      { value: 'writing', label: 'Writing' },
      { value: 'science', label: 'Science' },
      { value: 'social-studies', label: 'Social Studies' },
      { value: 'language', label: 'Language Arts' },
      { value: 'organization', label: 'Organization & Study Skills' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'preferredSessionLength',
    category: 'preferences',
    question: 'How long can you focus on learning at a time?',
    type: 'select',
    required: true,
    options: [
      { value: '10', label: '10 minutes' },
      { value: '15', label: '15 minutes' },
      { value: '20', label: '20 minutes' },
      { value: '30', label: '30 minutes' },
      { value: '45', label: '45 minutes' },
      { value: '60', label: '60 minutes' },
    ],
  },
  {
    id: 'timeOfDay',
    category: 'preferences',
    question: 'When do you prefer to learn?',
    type: 'select',
    required: false,
    options: [
      { value: 'morning', label: 'Morning' },
      { value: 'afternoon', label: 'Afternoon' },
      { value: 'evening', label: 'Evening' },
      { value: 'flexible', label: 'Anytime works' },
    ],
  },

  // Goals
  {
    id: 'learningGoals',
    category: 'goals',
    question: 'What are your learning goals? (Select all that apply)',
    type: 'checkbox-group',
    required: true,
    options: [
      { value: 'improve-grades', label: 'Improve my grades' },
      { value: 'build-confidence', label: 'Build confidence in learning' },
      { value: 'catch-up', label: 'Catch up with my class' },
      { value: 'challenge', label: 'Challenge myself with advanced material' },
      { value: 'homework-help', label: 'Get help with homework' },
      { value: 'test-prep', label: 'Prepare for tests' },
      { value: 'study-skills', label: 'Learn better study skills' },
      { value: 'reduce-anxiety', label: 'Reduce learning anxiety' },
    ],
  },

  // Baseline metrics
  {
    id: 'selfReportedConfidence',
    category: 'baseline',
    question: 'How confident do you feel about learning right now?',
    type: 'scale',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'motivationLevel',
    category: 'baseline',
    question: 'How motivated are you to learn and improve?',
    type: 'scale',
    required: true,
    min: 1,
    max: 10,
  },
  {
    id: 'anxietyLevel',
    category: 'baseline',
    question: 'How anxious or worried do you feel about learning?',
    type: 'scale',
    required: true,
    min: 1,
    max: 10,
  },
]

const categoryIcons = {
  demographics: User,
  conditions: Brain,
  support: Heart,
  preferences: Target,
  goals: Target,
  baseline: Heart,
}

export default function OnboardingSurvey({
  onComplete
}: {
  onComplete: (profile: LearningProfile) => void
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentAnswer, setCurrentAnswer] = useState<any>(null)
  const [otherText, setOtherText] = useState('')

  const question = ONBOARDING_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100
  const Icon = categoryIcons[question.category]

  const handleAnswer = (value: any) => {
    setCurrentAnswer(value)
  }

  const handleCheckboxGroup = (value: string) => {
    const current = currentAnswer || []
    if (current.includes(value)) {
      setCurrentAnswer(current.filter((v: string) => v !== value))
    } else {
      setCurrentAnswer([...current, value])
    }
  }

  const handleNext = () => {
    let finalAnswer = currentAnswer

    // Handle "other" text input for checkbox groups
    if (question.type === 'checkbox-group' && currentAnswer?.includes('other') && otherText) {
      finalAnswer = {
        selected: currentAnswer,
        otherText: otherText,
      }
    }

    setAnswers({ ...answers, [question.id]: finalAnswer })

    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer(null)
      setOtherText('')
    } else {
      // Survey complete - construct profile
      const profile = constructProfile({ ...answers, [question.id]: finalAnswer })
      onComplete(profile)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setCurrentAnswer(answers[ONBOARDING_QUESTIONS[currentQuestion - 1].id])
    }
  }

  const canProceed = () => {
    if (!question.required) return true
    if (currentAnswer === null || currentAnswer === undefined) return false
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return false
    if (typeof currentAnswer === 'string' && currentAnswer.trim() === '') return false
    return true
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {ONBOARDING_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <Icon className="w-12 h-12 mx-auto text-primary-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {question.question}
              </h2>
              {!question.required && (
                <p className="text-gray-500 text-sm">Optional - you can skip this</p>
              )}
            </div>

            <div className="mb-8">
              {/* Number input */}
              {question.type === 'number' && (
                <input
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswer(Number(e.target.value))}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Enter your age"
                />
              )}

              {/* Select dropdown */}
              {question.type === 'select' && (
                <select
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Select an option...</option>
                  {question.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Checkbox group */}
              {question.type === 'checkbox-group' && (
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <div key={option.value}>
                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={currentAnswer?.includes(option.value) || false}
                          onChange={() => handleCheckboxGroup(option.value)}
                          className="mt-1 w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-semibold text-gray-800">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                          )}
                        </div>
                      </label>
                      {option.value === 'other' && currentAnswer?.includes('other') && (
                        <input
                          type="text"
                          value={otherText}
                          onChange={(e) => setOtherText(e.target.value)}
                          placeholder="Please specify..."
                          className="mt-2 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Scale slider */}
              {question.type === 'scale' && (
                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Not at all</span>
                    <span>Very much</span>
                  </div>
                  <input
                    type="range"
                    min={question.min || 1}
                    max={question.max || 10}
                    value={currentAnswer || 5}
                    onChange={(e) => handleAnswer(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    {Array.from({ length: (question.max || 10) - (question.min || 1) + 1 }, (_, i) => (
                      <span key={i}>{(question.min || 1) + i}</span>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-4xl font-bold text-primary-600">{currentAnswer || 5}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4">
              {currentQuestion > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: canProceed() ? 1.05 : 1 }}
                whileTap={{ scale: canProceed() ? 0.95 : 1 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 text-lg font-semibold px-8 py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion < ONBOARDING_QUESTIONS.length - 1 ? (
                  <>
                    Next <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  'Complete Setup'
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function constructProfile(answers: Record<string, any>): LearningProfile {
  // Parse diagnosed conditions
  const conditionsArray = Array.isArray(answers.diagnosedConditions?.selected)
    ? answers.diagnosedConditions.selected
    : (answers.diagnosedConditions || [])

  const diagnosedConditions = {
    dyslexia: conditionsArray.includes('dyslexia'),
    dyscalculia: conditionsArray.includes('dyscalculia'),
    adhd: conditionsArray.includes('adhd'),
    asd: conditionsArray.includes('asd'),
    dysgraphia: conditionsArray.includes('dysgraphia'),
    processingDisorder: conditionsArray.includes('processingDisorder'),
    anxietyDisorder: conditionsArray.includes('anxietyDisorder'),
    other: conditionsArray.includes('other') ? answers.diagnosedConditions?.otherText || '' : '',
  }

  // Parse learning styles
  const learningStyles = Array.isArray(answers.preferredLearningStyle?.selected)
    ? answers.preferredLearningStyle.selected
    : (answers.preferredLearningStyle || [])

  // Parse subjects
  const subjects = Array.isArray(answers.subjectsNeedHelp?.selected)
    ? answers.subjectsNeedHelp.selected
    : (answers.subjectsNeedHelp || [])

  // Parse goals
  const goals = Array.isArray(answers.learningGoals?.selected)
    ? answers.learningGoals.selected
    : (answers.learningGoals || [])

  return {
    age: answers.age || 0,
    gradeLevel: answers.gradeLevel || '',
    diagnosedConditions,
    hasIEP: answers.hasIEP === 'yes',
    has504Plan: answers.has504Plan === 'yes',
    receivesSpecialEducation: answers.hasIEP === 'yes' || answers.has504Plan === 'yes',
    preferredLearningStyle: learningStyles,
    learningGoals: goals,
    subjectsNeedHelp: subjects,
    preferredSessionLength: Number(answers.preferredSessionLength) || 20,
    timeOfDay: answers.timeOfDay || 'flexible',
    selfReportedConfidence: answers.selfReportedConfidence || 5,
    motivationLevel: answers.motivationLevel || 5,
    anxietyLevel: answers.anxietyLevel || 5,
    timestamp: Date.now(),
  }
}
