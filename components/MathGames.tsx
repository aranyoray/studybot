'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Lightbulb, Star } from 'lucide-react'

interface GameResult {
  correct: boolean
  responseTime: number
  hintsUsed: number
  errorType?: 'procedural' | 'conceptual' | 'careless'
}

interface MathGameProps {
  difficulty: number
  hintFrequency: number
  feedbackTone: 'encouraging' | 'directive' | 'neutral'
  duration: number // milliseconds
  onComplete: (results: GameResult[]) => void
}

// Number Sense Game
export function NumberSenseGame({ difficulty, hintFrequency, feedbackTone, duration, onComplete }: MathGameProps) {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [problems, setProblems] = useState<any[]>([])
  const [results, setResults] = useState<GameResult[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [showHint, setShowHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const newProblems = generateNumberSenseProblems(difficulty, 10)
    setProblems(newProblems)
    setStartTime(Date.now())

    // Auto-complete after duration
    const timer = setTimeout(() => {
      if (results.length < problems.length) {
        onComplete(results)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const handleAnswer = (answer: number | string) => {
    const responseTime = Date.now() - startTime
    const problem = problems[currentProblem]
    const correct = answer === problem.answer

    const result: GameResult = {
      correct,
      responseTime,
      hintsUsed,
    }

    setResults([...results, result])
    setFeedback(generateFeedback(correct, feedbackTone))

    setTimeout(() => {
      setFeedback(null)
      if (currentProblem < problems.length - 1) {
        setCurrentProblem(currentProblem + 1)
        setStartTime(Date.now())
        setShowHint(false)
        setHintsUsed(0)
      } else {
        onComplete([...results, result])
      }
    }, 1500)
  }

  const requestHint = () => {
    if (Math.random() < hintFrequency) {
      setShowHint(true)
      setHintsUsed(hintsUsed + 1)
    }
  }

  if (problems.length === 0) return <div>Loading...</div>

  const problem = problems[currentProblem]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentProblem + 1} of {problems.length}</span>
            <span>{results.filter(r => r.correct).length} correct</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentProblem + 1) / problems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{problem.question}</h2>

          {/* Visual representation for number sense */}
          {problem.visual && (
            <div className="flex justify-center gap-3 mb-6 flex-wrap">
              {Array.from({ length: problem.visual }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-12 rounded-lg ${
                    problem.visualType === 'blocks' ? 'bg-blue-500' :
                    problem.visualType === 'circles' ? 'bg-green-500 rounded-full' :
                    'bg-purple-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hint */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <p className="text-gray-700">{problem.hint}</p>
          </motion.div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {problem.options.map((option: any, i: number) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Hint Button */}
        {!showHint && (
          <button
            onClick={requestHint}
            className="text-gray-600 hover:text-gray-800 underline flex items-center gap-2 mx-auto"
          >
            <Lightbulb className="w-4 h-4" />
            Need a hint?
          </button>
        )}

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
              results[results.length - 1].correct
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-red-100 border-2 border-red-300'
            }`}
          >
            {results[results.length - 1].correct ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <X className="w-6 h-6 text-red-600" />
            )}
            <p className="text-lg font-semibold">{feedback}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Magnitude Comparison Game
export function MagnitudeComparisonGame({ difficulty, hintFrequency, feedbackTone, duration, onComplete }: MathGameProps) {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [problems, setProblems] = useState<any[]>([])
  const [results, setResults] = useState<GameResult[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const newProblems = generateMagnitudeProblems(difficulty, 10)
    setProblems(newProblems)
    setStartTime(Date.now())
  }, [])

  const handleAnswer = (answer: string) => {
    const responseTime = Date.now() - startTime
    const problem = problems[currentProblem]
    const correct = answer === problem.answer

    const result: GameResult = {
      correct,
      responseTime,
      hintsUsed: 0,
    }

    setResults([...results, result])
    setFeedback(generateFeedback(correct, feedbackTone))

    setTimeout(() => {
      setFeedback(null)
      if (currentProblem < problems.length - 1) {
        setCurrentProblem(currentProblem + 1)
        setStartTime(Date.now())
      } else {
        onComplete([...results, result])
      }
    }, 1500)
  }

  if (problems.length === 0) return <div>Loading...</div>

  const problem = problems[currentProblem]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Which is {problem.comparison}?</h2>

          <div className="flex justify-center items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer('left')}
              disabled={feedback !== null}
              className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-6xl font-bold w-40 h-40 rounded-3xl shadow-xl disabled:opacity-50"
            >
              {problem.left}
            </motion.button>

            <span className="text-4xl text-gray-400">VS</span>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer('right')}
              disabled={feedback !== null}
              className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-6xl font-bold w-40 h-40 rounded-3xl shadow-xl disabled:opacity-50"
            >
              {problem.right}
            </motion.button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-xl text-center ${
              results[results.length - 1].correct
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="text-xl font-semibold">{feedback}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Helper Functions
function generateNumberSenseProblems(difficulty: number, count: number) {
  const problems = []
  const range = difficulty * 5

  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * range) + 1
    const b = Math.floor(Math.random() * range) + 1
    const operation = Math.random() > 0.5 ? '+' : '-'

    let answer: number
    let question: string

    if (operation === '+') {
      answer = a + b
      question = `${a} + ${b} = ?`
    } else {
      const larger = Math.max(a, b)
      const smaller = Math.min(a, b)
      answer = larger - smaller
      question = `${larger} - ${smaller} = ?`
    }

    const wrongOptions = [
      answer + 1,
      answer - 1,
      answer + Math.floor(Math.random() * 5) + 2,
    ].filter(opt => opt > 0 && opt !== answer)

    const options = [answer, ...wrongOptions.slice(0, 3)]
      .sort(() => Math.random() - 0.5)

    problems.push({
      question,
      answer,
      options,
      visual: a < 10 && operation === '+' ? a : null,
      visualType: ['blocks', 'circles', 'stars'][Math.floor(Math.random() * 3)],
      hint: operation === '+'
        ? `Think: Count up from ${a}`
        : `Think: Start with ${Math.max(a, b)} and take away ${Math.min(a, b)}`,
    })
  }

  return problems
}

function generateMagnitudeProblems(difficulty: number, count: number) {
  const problems = []
  const range = difficulty * 10

  for (let i = 0; i < count; i++) {
    const left = Math.floor(Math.random() * range) + 1
    const right = Math.floor(Math.random() * range) + 1
    const comparison = Math.random() > 0.5 ? 'bigger' : 'smaller'

    const answer = comparison === 'bigger'
      ? (left > right ? 'left' : 'right')
      : (left < right ? 'left' : 'right')

    problems.push({
      left,
      right,
      comparison,
      answer,
    })
  }

  return problems
}

function generateFeedback(correct: boolean, tone: 'encouraging' | 'directive' | 'neutral'): string {
  if (correct) {
    if (tone === 'encouraging') {
      return ['Great job!', 'You got it!', 'Awesome!', 'Perfect!', 'You\'re doing great!'][
        Math.floor(Math.random() * 5)
      ]
    } else if (tone === 'directive') {
      return ['Correct', 'Right answer', 'Well done', 'Good'][Math.floor(Math.random() * 4)]
    } else {
      return 'Correct'
    }
  } else {
    if (tone === 'encouraging') {
      return [
        'Not quite, but keep trying!',
        'That\'s okay! Let\'s try another one',
        'Good effort! You\'ll get the next one',
        'Keep going, you\'re learning!',
      ][Math.floor(Math.random() * 4)]
    } else if (tone === 'directive') {
      return ['Incorrect. Try again next time', 'Not correct', 'Wrong answer'][
        Math.floor(Math.random() * 3)
      ]
    } else {
      return 'Incorrect'
    }
  }
}
