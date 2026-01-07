'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  Star,
  BookOpen,
  Brain,
  MessageSquare,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Student {
  id: string
  name: string
  age: number
  gradeLevel: string
  avatar: string
  status: 'on-track' | 'needs-support' | 'excelling'
  lastSession: string
  totalSessions: number
  currentStreak: number
  averageAccuracy: number
  confidenceScore: number
  attentionScore: number
  accommodations?: string[]
  recentFlags?: string[]
}

export default function EducatorDashboard() {
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'analytics' | 'messages'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'on-track' | 'needs-support' | 'excelling'>('all')

  // Mock data - would come from API
  const classStats = {
    totalStudents: 24,
    activeToday: 18,
    averageAccuracy: 78,
    averageEngagement: 85,
    averageConfidence: 72,
    sessionsThisWeek: 156,
  }

  const students: Student[] = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      age: 10,
      gradeLevel: '4th',
      avatar: '👧',
      status: 'excelling',
      lastSession: '2 hours ago',
      totalSessions: 42,
      currentStreak: 12,
      averageAccuracy: 92,
      confidenceScore: 88,
      attentionScore: 95,
      accommodations: ['Dyslexia support', 'Extended time'],
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      age: 9,
      gradeLevel: '3rd',
      avatar: '👦',
      status: 'needs-support',
      lastSession: '1 day ago',
      totalSessions: 28,
      currentStreak: 2,
      averageAccuracy: 64,
      confidenceScore: 52,
      attentionScore: 68,
      recentFlags: ['Low confidence', 'Frustration detected'],
      accommodations: ['ADHD support', 'Frequent breaks'],
    },
    {
      id: '3',
      name: 'Sophia Chen',
      age: 11,
      gradeLevel: '5th',
      avatar: '👧',
      status: 'on-track',
      lastSession: '5 hours ago',
      totalSessions: 35,
      currentStreak: 7,
      averageAccuracy: 81,
      confidenceScore: 76,
      attentionScore: 82,
    },
    {
      id: '4',
      name: 'Jamal Williams',
      age: 10,
      gradeLevel: '4th',
      avatar: '👦',
      status: 'excelling',
      lastSession: '3 hours ago',
      totalSessions: 48,
      currentStreak: 15,
      averageAccuracy: 89,
      confidenceScore: 91,
      attentionScore: 88,
    },
    {
      id: '5',
      name: 'Olivia Martinez',
      age: 8,
      gradeLevel: '2nd',
      avatar: '👧',
      status: 'on-track',
      lastSession: '4 hours ago',
      totalSessions: 31,
      currentStreak: 8,
      averageAccuracy: 77,
      confidenceScore: 69,
      attentionScore: 79,
      accommodations: ['Dyscalculia support'],
    },
  ]

  const classProgressData = [
    { week: 'Week 1', accuracy: 65, confidence: 58, engagement: 70 },
    { week: 'Week 2', accuracy: 68, confidence: 62, engagement: 74 },
    { week: 'Week 3', accuracy: 72, confidence: 67, engagement: 78 },
    { week: 'Week 4', accuracy: 75, confidence: 71, engagement: 82 },
    { week: 'Week 5', accuracy: 78, confidence: 72, engagement: 85 },
  ]

  const skillDistribution = [
    { skill: 'Number Sense', average: 82 },
    { skill: 'Magnitude', average: 78 },
    { skill: 'Working Memory', average: 75 },
    { skill: 'Attention', average: 81 },
    { skill: 'Processing Speed', average: 73 },
  ]

  const cognitiveProfile = [
    { dimension: 'Working Memory', score: 75, fullMark: 100 },
    { dimension: 'Attention', score: 81, fullMark: 100 },
    { dimension: 'Processing Speed', score: 73, fullMark: 100 },
    { dimension: 'Math Fluency', score: 78, fullMark: 100 },
    { dimension: 'Confidence', score: 72, fullMark: 100 },
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excelling': return 'bg-green-100 text-green-800'
      case 'on-track': return 'bg-blue-100 text-blue-800'
      case 'needs-support': return 'bg-amber-100 text-amber-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excelling': return <Star className="w-4 h-4" />
      case 'on-track': return <CheckCircle className="w-4 h-4" />
      case 'needs-support': return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Educator Dashboard</h1>
              <p className="text-gray-600">Ms. Anderson's 3rd-5th Grade Class</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export Reports
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Mail className="w-4 h-4" />
                Message Parents
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-6 mt-6 border-b">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  selectedView === tab.id
                    ? 'border-purple-600 text-purple-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {[
              { label: 'Total Students', value: classStats.totalStudents, icon: Users, color: 'purple' },
              { label: 'Active Today', value: classStats.activeToday, icon: Clock, color: 'blue' },
              { label: 'Avg Accuracy', value: `${classStats.averageAccuracy}%`, icon: Target, color: 'green' },
              { label: 'Avg Engagement', value: `${classStats.averageEngagement}%`, icon: TrendingUp, color: 'pink' },
              { label: 'Avg Confidence', value: `${classStats.averageConfidence}%`, icon: Award, color: 'yellow' },
              { label: 'Sessions This Week', value: classStats.sessionsThisWeek, icon: BookOpen, color: 'indigo' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-8 h-8 text-${metric.color}-500`} />
                </div>
                <div className={`text-3xl font-bold text-gray-900 mb-1`}>{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Class Progress Over Time */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Class Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={classProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="accuracy" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Accuracy" />
                  <Area type="monotone" dataKey="confidence" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Confidence" />
                  <Area type="monotone" dataKey="engagement" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Engagement" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Distribution (Class Average)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" angle={-15} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Students Needing Support */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              Students Needing Support
            </h3>
            <div className="space-y-4">
              {students.filter(s => s.status === 'needs-support').map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{student.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.gradeLevel} Grade • Last session: {student.lastSession}</div>
                      {student.recentFlags && (
                        <div className="flex gap-2 mt-1">
                          {student.recentFlags.map((flag, i) => (
                            <span key={i} className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Contact Parent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {selectedView === 'students' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'excelling', 'on-track', 'needs-support'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-4 py-3 rounded-lg transition-all capitalize ${
                      filterStatus === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{student.avatar}</div>
                    <div>
                      <div className="font-bold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.gradeLevel} Grade • Age {student.age}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(student.status)}`}>
                    {getStatusIcon(student.status)}
                    <span className="capitalize">{student.status.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600"
                          style={{ width: `${student.averageAccuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{student.averageAccuracy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                          style={{ width: `${student.confidenceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{student.confidenceScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attention:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                          style={{ width: `${student.attentionScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{student.attentionScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="text-2xl font-bold text-purple-600">{student.totalSessions}</div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2">
                    <div className="text-2xl font-bold text-orange-600">{student.currentStreak}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600 mb-1">Last Session</div>
                    <div className="text-xs font-semibold text-green-600">{student.lastSession}</div>
                  </div>
                </div>

                {student.accommodations && student.accommodations.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-600 mb-2">Accommodations:</div>
                    <div className="flex flex-wrap gap-1">
                      {student.accommodations.map((acc, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  View Full Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedView === 'analytics' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Cognitive Profile */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Class Cognitive Profile
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={cognitiveProfile}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Class Average" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Analytics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Metrics</h3>
              <div className="space-y-6">
                {[
                  { label: 'Math Anxiety Reduction', value: 23, change: '+15%', positive: true },
                  { label: 'Confidence Improvement', value: 18, change: '+12%', positive: true },
                  { label: 'Session Completion Rate', value: 92, change: '+5%', positive: true },
                  { label: 'Average Response Time', value: 3.2, change: '-0.8s', positive: true, unit: 's' },
                  { label: 'Hint Usage Rate', value: 28, change: '-7%', positive: true, unit: '%' },
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">{metric.label}</div>
                      <div className={`text-sm ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change} from last month
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {metric.value}{metric.unit || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
