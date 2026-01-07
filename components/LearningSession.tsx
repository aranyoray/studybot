'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Trophy, Star } from 'lucide-react'
import { getCurrentLearnerModel } from '@/lib/learnerModel'

type SessionPhase = 'mood-check' | 'calibration' | 'learning-game' | 'cognitive-game' | 'reflection' | 'reward'

interface SessionData {
  sessionId: string
  userId: string
  startTime: number
  currentPhase: SessionPhase
  phaseStartTime: number
  responses: any[]
  moodRating: number
  confidenceRating: number
}

interface MoodCheckProps {
  onComplete: (mood: number, confidence: number) => void
}

function MoodCheck({ onComplete }: MoodCheckProps) {
  const [mood, setMood] = useState(5)
  const [confidence, setConfidence] = useState(5)

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊']
  const confidenceLabels = ['Not confident', 'A little', 'Okay', 'Good', 'Very confident!']

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto text-pink-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">How are you feeling today?</h2>
          <p className="text-gray-600">Let's check in before we start!</p>
        </div>

        {/* Mood Slider */}
        <div className="mb-10">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            My mood right now:
          </label>
          <div className="flex justify-center items-center gap-4 mb-6">
            {moodEmojis.map((emoji, i) => (
              <motion.button
                key={i}
                onClick={() => setMood(i + 1)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`text-5xl transition-all ${
                  mood === i + 1 ? 'scale-125' : 'opacity-50'
                }`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Confidence Slider */}
        <div className="mb-10">
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            How confident do you feel about learning today?
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-red-300 via-yellow-300 to-green-400 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            {confidenceLabels.map((label, i) => (
              <span
                key={i}
                className={confidence === i + 1 ? 'font-bold text-purple-600' : ''}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(mood, confidence)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Let's Start! 🚀
        </motion.button>
      </motion.div>
    </div>
  )
}

interface CalibrationGameProps {
  difficulty: number
  onComplete: (accuracy: number, responseTimes: number[]) => void
}

function CalibrationGame({ difficulty, onComplete }: CalibrationGameProps) {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [problems, setProblems] = useState<any[]>([])
  const [responses, setResponses] = useState<{ correct: boolean; time: number }[]>([])
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    // Generate 5 simple problems for calibration
    const newProblems = generateCalibrationProblems(difficulty)
    setProblems(newProblems)
    setStartTime(Date.now())
  }, [difficulty])

  const handleAnswer = (answer: number) => {
    const responseTime = Date.now() - startTime
    const correct = answer === problems[currentProblem].answer

    const newResponses = [
      ...responses,
      { correct, time: responseTime },
    ]
    setResponses(newResponses)

    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1)
      setStartTime(Date.now())
    } else {
      // Calibration complete
      const accuracy = (newResponses.filter(r => r.correct).length / newResponses.length) * 100
      const times = newResponses.map(r => r.time)
      onComplete(accuracy, times)
    }
  }

  if (problems.length === 0) return <div>Loading...</div>

  const problem = problems[currentProblem]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-6">
          <Brain className="w-12 h-12 mx-auto text-blue-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Warm-Up!</h3>
          <p className="text-gray-600">Problem {currentProblem + 1} of {problems.length}</p>
        </div>

        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-gray-800 mb-6">{problem.question}</p>
          {problem.visual && (
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: problem.visual }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-blue-500 rounded-full" />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {problem.options.map((option: number, i: number) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

interface ReflectionProps {
  sessionAccuracy: number
  onComplete: (reflection: string) => void
}

function Reflection({ sessionAccuracy, onComplete }: ReflectionProps) {
  const [selectedReflection, setSelectedReflection] = useState<string>('')

  const reflectionPrompts = [
    { id: 'helped', text: 'What helped you the most today?', emoji: '🌟' },
    { id: 'tricky', text: 'What was tricky or confusing?', emoji: '🤔' },
    { id: 'proud', text: 'What are you proud of?', emoji: '🎉' },
    { id: 'learned', text: 'What did you learn?', emoji: '💡' },
  ]

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentPrompt, setCurrentPrompt] = useState(0)

  const handleAnswer = (answer: string) => {
    const prompt = reflectionPrompts[currentPrompt]
    const newAnswers = { ...answers, [prompt.id]: answer }
    setAnswers(newAnswers)

    if (currentPrompt < reflectionPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    } else {
      onComplete(JSON.stringify(newAnswers))
    }
  }

  const prompt = reflectionPrompts[currentPrompt]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <motion.div
        key={currentPrompt}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{prompt.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{prompt.text}</h3>
          <p className="text-gray-600">Take a moment to think...</p>
        </div>

        <textarea
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Type your thoughts here..."
          onBlur={(e) => {
            if (e.target.value.trim()) {
              handleAnswer(e.target.value)
            }
          }}
        />

        <button
          onClick={() => handleAnswer('Skipped')}
          className="mt-4 text-gray-500 hover:text-gray-700 underline"
        >
          Skip this question
        </button>
      </motion.div>
    </div>
  )
}

interface RewardScreenProps {
  coinsEarned: number
  badgesEarned: string[]
  streakDays: number
  onComplete: () => void
}

function RewardScreen({ coinsEarned, badgesEarned, streakDays, onComplete }: RewardScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center"
      >
        <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Great Work!</h2>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-200 to-orange-200 p-6 rounded-2xl">
            <div className="text-5xl mb-2">🪙</div>
            <p className="text-3xl font-bold text-gray-800">{coinsEarned}</p>
            <p className="text-gray-600">Coins Earned</p>
          </div>

          <div className="bg-gradient-to-br from-blue-200 to-purple-200 p-6 rounded-2xl">
            <div className="text-5xl mb-2">🔥</div>
            <p className="text-3xl font-bold text-gray-800">{streakDays}</p>
            <p className="text-gray-600">Day Streak!</p>
          </div>
        </div>

        {badgesEarned.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">New Badges!</h3>
            <div className="flex justify-center gap-4">
              {badgesEarned.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-gradient-to-br from-purple-400 to-pink-400 w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                >
                  ⭐
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg"
        >
          Finish Session
        </motion.button>
      </motion.div>
    </div>
  )
}

export default function LearningSession({ userId, onSessionComplete }: { userId: string; onSessionComplete: () => void }) {
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionId: `session-${Date.now()}`,
    userId,
    startTime: Date.now(),
    currentPhase: 'mood-check',
    phaseStartTime: Date.now(),
    responses: [],
    moodRating: 5,
    confidenceRating: 5,
  })

  const [phaseData, setPhaseData] = useState<any>({})

  const handleMoodComplete = (mood: number, confidence: number) => {
    setSessionData({
      ...sessionData,
      moodRating: mood,
      confidenceRating: confidence,
      currentPhase: 'calibration',
      phaseStartTime: Date.now(),
    })
  }

  const handleCalibrationComplete = (accuracy: number, responseTimes: number[]) => {
    setPhaseData({ calibrationAccuracy: accuracy, calibrationTimes: responseTimes })
    setSessionData({
      ...sessionData,
      currentPhase: 'learning-game',
      phaseStartTime: Date.now(),
    })
  }

  const handleLearningGameComplete = (gameData: any) => {
    setPhaseData({ ...phaseData, learningGameData: gameData })
    setSessionData({
      ...sessionData,
      currentPhase: 'cognitive-game',
      phaseStartTime: Date.now(),
    })
  }

  const handleCognitiveGameComplete = (cognitiveData: any) => {
    setPhaseData({ ...phaseData, cognitiveData })
    setSessionData({
      ...sessionData,
      currentPhase: 'reflection',
      phaseStartTime: Date.now(),
    })
  }

  const handleReflectionComplete = (reflection: string) => {
    setPhaseData({ ...phaseData, reflection })
    setSessionData({
      ...sessionData,
      currentPhase: 'reward',
      phaseStartTime: Date.now(),
    })
  }

  const handleRewardComplete = () => {
    // Submit session data to backend
    const learnerModel = getCurrentLearnerModel()
    if (learnerModel) {
      learnerModel.updateFromSession({
        accuracy: phaseData.calibrationAccuracy || 0,
        responseTimes: phaseData.calibrationTimes || [],
        errorTypes: [],
        mouseData: {},
        cognitiveScores: phaseData.cognitiveData || {},
        affectiveInputs: {
          confidence: sessionData.confidenceRating,
        },
        tasksCompleted: 10,
        reflections: [phaseData.reflection || ''],
      })
    }

    onSessionComplete()
  }

  const learnerModel = getCurrentLearnerModel()
  const difficulty = learnerModel?.getModel().currentDifficulty || 3

  return (
    <AnimatePresence mode="wait">
      {sessionData.currentPhase === 'mood-check' && (
        <MoodCheck onComplete={handleMoodComplete} />
      )}
      {sessionData.currentPhase === 'calibration' && (
        <CalibrationGame
          difficulty={difficulty}
          onComplete={handleCalibrationComplete}
        />
      )}
      {sessionData.currentPhase === 'learning-game' && (
        <div>Learning Game (To be implemented)</div>
      )}
      {sessionData.currentPhase === 'cognitive-game' && (
        <div>Cognitive Game (To be implemented)</div>
      )}
      {sessionData.currentPhase === 'reflection' && (
        <Reflection
          sessionAccuracy={phaseData.calibrationAccuracy || 0}
          onComplete={handleReflectionComplete}
        />
      )}
      {sessionData.currentPhase === 'reward' && (
        <RewardScreen
          coinsEarned={50}
          badgesEarned={['First Session']}
          streakDays={learnerModel?.getModel().consecutiveDays || 1}
          onComplete={handleRewardComplete}
        />
      )}
    </AnimatePresence>
  )
}

function generateCalibrationProblems(difficulty: number) {
  const problems = []
  const baseRange = difficulty * 3

  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * baseRange) + 1
    const b = Math.floor(Math.random() * baseRange) + 1
    const answer = a + b

    // Generate wrong options
    const wrongOptions = [
      answer + 1,
      answer - 1,
      answer + Math.floor(Math.random() * 3) + 2,
    ].filter(opt => opt > 0)

    const options = [answer, ...wrongOptions.slice(0, 3)]
      .sort(() => Math.random() - 0.5)

    problems.push({
      question: `${a} + ${b} = ?`,
      answer,
      options,
      visual: a < 10 ? a : null, // Show visual for small numbers
    })
  }

  return problems
}
