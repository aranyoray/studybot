'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  Brain,
  Heart,
  Clock,
  Target,
  AlertCircle,
  Download,
  Mail,
  Settings,
  ChevronRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

export default function ParentDashboard({ studentName = 'Emma' }: { studentName?: string }) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week')

  // Mock data - in production, fetch from API
  const progressData = [
    { date: 'Mon', confidence: 45, accuracy: 60, engagement: 70 },
    { date: 'Tue', confidence: 52, accuracy: 65, engagement: 75 },
    { date: 'Wed', confidence: 58, accuracy: 70, engagement: 80 },
    { date: 'Thu', confidence: 65, accuracy: 75, engagement: 82 },
    { date: 'Fri', confidence: 72, accuracy: 80, engagement: 85 },
    { date: 'Sat', confidence: 75, accuracy: 82, engagement: 88 },
    { date: 'Sun', confidence: 78, accuracy: 85, engagement: 90 },
  ]

  const skillsData = [
    { skill: 'Number Sense', score: 85 },
    { skill: 'Magnitude', score: 78 },
    { skill: 'Sequencing', score: 92 },
    { skill: 'Word Problems', score: 65 },
    { skill: 'Fluency', score: 80 },
  ]

  const radarData = [
    { subject: 'Working Memory', score: 75 },
    { subject: 'Attention', score: 82 },
    { subject: 'Processing Speed', score: 70 },
    { subject: 'Confidence', score: 78 },
    { subject: 'Engagement', score: 88 },
  ]

  const recentSessions = [
    { id: 1, date: '2024-01-07', duration: 10, accuracy: 85, confidence: 8, completed: true },
    { id: 2, date: '2024-01-06', duration: 10, accuracy: 82, confidence: 7, completed: true },
    { id: 3, date: '2024-01-05', duration: 10, accuracy: 80, confidence: 7, completed: true },
    { id: 4, date: '2024-01-04', duration: 10, accuracy: 75, confidence: 6, completed: true },
    { id: 5, date: '2024-01-03', duration: 8, accuracy: 70, confidence: 6, completed: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Neurlearning</span>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-gray-600">Parent Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Mail className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Selector & Quick Actions */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{studentName}'s Progress</h1>
            <p className="text-gray-600">Track learning journey and celebrate achievements</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              <Mail className="w-4 h-4 mr-2" />
              Email Summary
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center">
                +23% <TrendingUp className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">78/100</div>
            <div className="text-gray-600 text-sm">Confidence Score</div>
            <div className="mt-3 text-xs text-gray-500">From 63 last week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 text-sm font-medium flex items-center">
                +12% <TrendingUp className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
            <div className="text-gray-600 text-sm">Accuracy Rate</div>
            <div className="mt-3 text-xs text-gray-500">Above grade average</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 text-sm font-medium">🔥</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">7 days</div>
            <div className="text-gray-600 text-sm">Current Streak</div>
            <div className="mt-3 text-xs text-gray-500">Longest: 12 days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-gray-400 text-sm font-medium">This week</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">48 min</div>
            <div className="text-gray-600 text-sm">Learning Time</div>
            <div className="mt-3 text-xs text-gray-500">Avg: 10 min/session</div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Progress Over Time */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Progress Over Time</h2>
              <div className="flex space-x-2">
                {(['week', 'month', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      timeRange === range
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConfidence)"
                  name="Confidence"
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAccuracy)"
                  name="Accuracy"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Confidence</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Accuracy</span>
              </div>
            </div>
          </div>

          {/* Cognitive Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Cognitive Profile</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Skills Mastery</h2>
          <div className="space-y-4">
            {skillsData.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                  <span className="text-sm font-semibold text-gray-900">{skill.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-2.5 rounded-full ${
                      skill.score >= 80
                        ? 'bg-green-500'
                        : skill.score >= 60
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Sessions</h2>
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        session.completed ? 'bg-green-100' : 'bg-yellow-100'
                      }`}
                    >
                      {session.completed ? (
                        <Award className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.duration} min • {session.accuracy}% accuracy
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Confidence: {session.confidence}/10
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.completed ? 'Completed' : 'Incomplete'}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Insights & Recommendations</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-green-900 mb-1">Great Progress!</div>
                    <div className="text-sm text-green-700">
                      {studentName}'s confidence has increased by 23% this week. Keep up the consistent practice!
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">Focus Area Identified</div>
                    <div className="text-sm text-blue-700">
                      Word problems show room for improvement. The system is adjusting to provide more practice in this area.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                <div className="flex items-start">
                  <Heart className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">Emotional Wellness</div>
                    <div className="text-sm text-purple-700">
                      Frustration levels are low and engagement is high. {studentName} is enjoying the learning process!
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-yellow-900 mb-1">Streak Alert</div>
                    <div className="text-sm text-yellow-700">
                      {studentName} is on a 7-day streak! Just 5 more days to beat the personal record.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🔥', title: '7-Day Streak', desc: 'Consistency champion!' },
              { icon: '⭐', title: 'Number Master', desc: 'Mastered addition to 20' },
              { icon: '🎯', title: '90% Accuracy', desc: 'Perfect practice session' },
              { icon: '🚀', title: 'Fast Learner', desc: 'Improved speed by 30%' },
            ].map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl text-center"
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
