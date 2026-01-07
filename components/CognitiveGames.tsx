'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Zap, Eye } from 'lucide-react'

interface CognitiveResult {
  score: number // 0-100
  responseTime: number
  accuracy: number
}

// Working Memory Game - Sequence Recall
export function WorkingMemoryGame({ difficulty, duration, onComplete }: {
  difficulty: number
  duration: number
  onComplete: (result: CognitiveResult) => void
}) {
  const [phase, setPhase] = useState<'showing' | 'waiting' | 'recalling'>('showing')
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())

  const sequenceLength = Math.min(3 + difficulty, 9) // 3-9 items
  const showDuration = 800 // ms per item

  useEffect(() => {
    startNewRound()
  }, [])

  const startNewRound = () => {
    const newSequence = generateSequence(sequenceLength)
    setSequence(newSequence)
    setUserSequence([])
    setCurrentIndex(0)
    setPhase('showing')

    // Show sequence
    setTimeout(() => {
      setPhase('waiting')
      setTimeout(() => {
        setPhase('recalling')
      }, 1000)
    }, showDuration * sequenceLength)
  }

  const handleRecall = (number: number) => {
    const newUserSequence = [...userSequence, number]
    setUserSequence(newUserSequence)

    if (newUserSequence.length === sequence.length) {
      // Check if correct
      const correct = newUserSequence.every((num, i) => num === sequence[i])
      if (correct) {
        setScore(score + 1)
      }

      if (round < 5) {
        setRound(round + 1)
        setTimeout(() => startNewRound(), 1500)
      } else {
        // Game complete
        const accuracy = (score / 5) * 100
        const responseTime = Date.now() - startTime
        onComplete({
          score: accuracy,
          responseTime,
          accuracy,
        })
      }
    }
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 mx-auto text-purple-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Memory Challenge</h2>
          <p className="text-gray-600">Watch the sequence, then repeat it!</p>
        </div>

        {/* Round indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < round ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Showing phase */}
        {phase === 'showing' && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {sequence.map((num, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: i <= currentIndex ? 1 : 0 }}
                onAnimationComplete={() => {
                  if (i === currentIndex && i < sequence.length - 1) {
                    setTimeout(() => setCurrentIndex(i + 1), showDuration)
                  }
                }}
                className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-4xl font-bold rounded-2xl h-24 flex items-center justify-center shadow-lg"
              >
                {num}
              </motion.div>
            ))}
          </div>
        )}

        {/* Waiting phase */}
        {phase === 'waiting' && (
          <div className="text-center py-16">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-4xl mb-4"
            >
              🤔
            </motion.div>
            <p className="text-xl text-gray-600">Remember the sequence...</p>
          </div>
        )}

        {/* Recalling phase */}
        {phase === 'recalling' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {numbers.map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRecall(num)}
                  disabled={userSequence.includes(num)}
                  className={`text-3xl font-bold rounded-2xl h-20 shadow-lg transition-all ${
                    userSequence.includes(num)
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-br from-blue-400 to-purple-400 text-white hover:shadow-xl'
                  }`}
                >
                  {num}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              {userSequence.map((num, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center text-xl font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Attention & Inhibition Game - Go/No-Go Task
export function AttentionGame({ difficulty, duration, onComplete }: {
  difficulty: number
  duration: number
  onComplete: (result: CognitiveResult) => void
}) {
  const [currentStimulus, setCurrentStimulus] = useState<string>('')
  const [showStimulus, setShowStimulus] = useState(false)
  const [results, setResults] = useState<{ correct: boolean; responseTime: number }[]>([])
  const [trialCount, setTrialCount] = useState(0)
  const [startTime, setStartTime] = useState(0)

  const maxTrials = 20
  const stimulusDuration = 1000
  const interTrialInterval = 500

  useEffect(() => {
    runTrial()
  }, [])

  const runTrial = () => {
    if (trialCount >= maxTrials) {
      const accuracy = (results.filter(r => r.correct).length / results.length) * 100
      const avgResponseTime =
        results.reduce((sum, r) => sum + r.responseTime, 0) / results.length

      onComplete({
        score: accuracy,
        responseTime: avgResponseTime,
        accuracy,
      })
      return
    }

    // 70% go, 30% no-go
    const isGo = Math.random() > 0.3
    const stimulus = isGo ? '✓' : '✗'

    setCurrentStimulus(stimulus)
    setShowStimulus(true)
    setStartTime(Date.now())

    setTimeout(() => {
      // If no response by now, count as incorrect for Go trials, correct for NoGo
      if (showStimulus) {
        const result = {
          correct: !isGo, // Correct if NoGo (didn't respond)
          responseTime: stimulusDuration,
        }
        setResults([...results, result])
      }

      setShowStimulus(false)

      setTimeout(() => {
        setTrialCount(trialCount + 1)
        runTrial()
      }, interTrialInterval)
    }, stimulusDuration)
  }

  const handleResponse = () => {
    if (!showStimulus) return

    const responseTime = Date.now() - startTime
    const isGo = currentStimulus === '✓'

    const result = {
      correct: isGo, // Correct if Go trial
      responseTime,
    }

    setResults([...results, result])
    setShowStimulus(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quick Reactions!</h2>
          <p className="text-gray-600 mb-4">
            Press when you see <span className="text-green-600 font-bold">✓</span>
            <br />
            Don't press when you see <span className="text-red-600 font-bold">✗</span>
          </p>
          <p className="text-sm text-gray-500">Trial {trialCount + 1} / {maxTrials}</p>
        </div>

        <div className="flex justify-center mb-8">
          <AnimatePresence>
            {showStimulus && (
              <motion.div
                key={trialCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`text-9xl ${
                  currentStimulus === '✓' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {currentStimulus}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResponse}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold py-8 rounded-2xl shadow-lg"
        >
          PRESS!
        </motion.button>
      </motion.div>
    </div>
  )
}

// Processing Speed Game
export function ProcessingSpeedGame({ difficulty, duration, onComplete }: {
  difficulty: number
  duration: number
  onComplete: (result: CognitiveResult) => void
}) {
  const [symbols, setSymbols] = useState<{ symbol: string; target: boolean }[]>([])
  const [responses, setResponses] = useState<boolean[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())

  const symbolDuration = Math.max(500, 1500 - difficulty * 100) // Faster with higher difficulty
  const totalSymbols = 20

  useEffect(() => {
    // Generate symbol sequence
    const targetSymbol = '★'
    const distractorSymbols = ['●', '■', '▲', '♦']

    const newSymbols = Array.from({ length: totalSymbols }).map(() => {
      const isTarget = Math.random() > 0.5
      return {
        symbol: isTarget ? targetSymbol : distractorSymbols[Math.floor(Math.random() * distractorSymbols.length)],
        target: isTarget,
      }
    })

    setSymbols(newSymbols)
    showNextSymbol()
  }, [])

  const showNextSymbol = () => {
    if (currentIndex >= totalSymbols) {
      const accuracy = (score / totalSymbols) * 100
      const responseTime = Date.now() - startTime

      onComplete({
        score: accuracy,
        responseTime,
        accuracy,
      })
      return
    }

    setTimeout(() => {
      // Auto-advance if no response
      if (responses.length === currentIndex) {
        handleResponse(false)
      }
    }, symbolDuration)
  }

  const handleResponse = (isTarget: boolean) => {
    const correct = isTarget === symbols[currentIndex].target
    if (correct) {
      setScore(score + 1)
    }

    setResponses([...responses, isTarget])
    setCurrentIndex(currentIndex + 1)

    setTimeout(showNextSymbol, 200)
  }

  if (currentIndex >= symbols.length || symbols.length === 0) {
    return <div>Loading...</div>
  }

  const currentSymbol = symbols[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-red-100 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <Eye className="w-12 h-12 mx-auto text-orange-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Symbol Hunt</h2>
          <p className="text-gray-600">
            Press <span className="font-bold text-yellow-500">YES</span> when you see ★
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {currentIndex + 1} / {totalSymbols} | Score: {score}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-9xl text-gray-800"
          >
            {currentSymbol.symbol}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleResponse(true)}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white text-2xl font-bold py-6 rounded-2xl shadow-lg"
          >
            ★ YES
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleResponse(false)}
            className="bg-gradient-to-r from-red-400 to-red-600 text-white text-2xl font-bold py-6 rounded-2xl shadow-lg"
          >
            NO
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// Helper
function generateSequence(length: number): number[] {
  const sequence = []
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 9) + 1)
  }
  return sequence
}
