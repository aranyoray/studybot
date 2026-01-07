'use client'

import { motion } from 'framer-motion'
import { Brain, Heart, Shield, TrendingUp, Users, Award, CheckCircle, Star, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'parents' | 'educators' | 'researchers'>('parents')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Neurlearning</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium">How It Works</a>
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <a href="#research" className="text-gray-700 hover:text-indigo-600 font-medium">Research</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium">Pricing</a>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">Sign In</button>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium text-sm mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Research-Backed & Privacy-First
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Personalized Learning That Builds Confidence, Not Anxiety
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered learning companion for ages 5-13. Reduces learning anxiety while strengthening
                math skills, cognitive abilities, and self-confidence through emotionally-aware, adaptive sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 font-semibold text-lg flex items-center justify-center">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-indigo-600 hover:text-indigo-600 font-semibold text-lg">
                  Watch Demo Video
                </button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-24 h-24 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Demo</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600 mt-1">Anxiety Reduced</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600 mt-1">Completion Rate</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">4.9★</div>
                    <div className="text-sm text-gray-600 mt-1">Parent Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Schools & Districts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Parent Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">12+</div>
              <div className="text-gray-600">Research Studies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Tabs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built For Everyone Who Cares About Learning</h2>
            <p className="text-xl text-gray-600">Trusted by parents, educators, and researchers worldwide</p>
          </div>

          <div className="flex justify-center space-x-4 mb-12">
            {(['parents', 'educators', 'researchers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-12"
          >
            {activeTab === 'parents' && (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">For Parents & Guardians</h3>
                  <ul className="space-y-4">
                    {[
                      'Real-time progress dashboards showing exactly how your child is doing',
                      'Weekly email reports with insights and recommendations',
                      'See anxiety levels decrease and confidence grow over time',
                      'IEP/504 accommodations automatically applied',
                      'Safe, COPPA-compliant platform with no ads or data selling',
                      'Connect with certified learning specialists for guidance',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                    View Parent Dashboard Demo
                  </button>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">This Week's Progress</span>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">+23%</div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-sm font-medium text-gray-600 mb-4">Recent Achievements</div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-yellow-500 mr-3" />
                        <span className="text-sm text-gray-700">5-day streak completed!</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-purple-500 mr-3" />
                        <span className="text-sm text-gray-700">Mastered addition to 20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'educators' && (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">For Teachers & Schools</h3>
                  <ul className="space-y-4">
                    {[
                      'Classroom dashboards track 30+ students simultaneously',
                      'Identifies struggling learners before they fall behind',
                      'Supplements your instruction with personalized practice',
                      'Detailed reports for parent-teacher conferences',
                      'Aligns with state standards and curriculum frameworks',
                      'Professional development and training included',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                    Request School Demo
                  </button>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-sm font-medium text-gray-600 mb-4">Class Overview: Grade 3A</div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">28</div>
                        <div className="text-sm text-gray-600">Students Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">87%</div>
                        <div className="text-sm text-gray-600">Avg Progress</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-2">Needs Attention</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">Student A - Low engagement</span>
                        <button className="text-xs text-indigo-600 font-medium">View</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">Student B - Anxiety spike</span>
                        <button className="text-xs text-indigo-600 font-medium">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'researchers' && (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">For Researchers & Institutions</h3>
                  <ul className="space-y-4">
                    {[
                      'Research-grade data collection with attention check validation',
                      'Export datasets in CSV/JSON for R, SPSS, or Excel analysis',
                      'COPPA/GDPR compliant pseudonymization and privacy controls',
                      'Behavioral event logs at millisecond precision',
                      'Pre/post assessment integration (surveys, cognitive tests)',
                      'Published studies in peer-reviewed journals',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                    Access Research Portal
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-sm font-medium text-gray-600 mb-4">Recent Publications</div>
                    <div className="space-y-4">
                      <div className="border-l-4 border-indigo-600 pl-4">
                        <div className="text-sm font-semibold text-gray-900">
                          Reducing Math Anxiety Through Adaptive AI
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Journal of Educational Psychology, 2024
                        </div>
                      </div>
                      <div className="border-l-4 border-purple-600 pl-4">
                        <div className="text-sm font-semibold text-gray-900">
                          Cognitive-Emotional Learning Models
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Learning Sciences Review, 2024
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-600 mb-2">Dataset Quality</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">94%</div>
                          <div className="text-xs text-gray-600">Valid Sessions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">15K+</div>
                          <div className="text-xs text-gray-600">Data Points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Learning Support</h2>
            <p className="text-xl text-gray-600">Everything your child needs to succeed</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Personalization',
                description: 'Adapts difficulty, pacing, and feedback tone based on cognitive and emotional state',
                color: 'indigo',
              },
              {
                icon: Heart,
                title: 'Emotional Awareness',
                description: 'Tracks confidence, frustration, and anxiety to prevent overwhelm and build resilience',
                color: 'pink',
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Progress',
                description: 'See skills improve week by week with detailed analytics and insights',
                color: 'green',
              },
              {
                icon: Users,
                title: 'Learning Differences Support',
                description: 'Specialized accommodations for dyslexia, dyscalculia, ADHD, ASD, and anxiety',
                color: 'purple',
              },
              {
                icon: Shield,
                title: 'Privacy & Safety First',
                description: 'COPPA compliant, no ads, no data selling. Your child\'s data is protected',
                color: 'blue',
              },
              {
                icon: Award,
                title: 'Research-Backed',
                description: 'Based on cognitive science and validated through peer-reviewed studies',
                color: 'yellow',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <feature.icon className={`w-12 h-12 text-${feature.color}-600 mb-4`} />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Parents & Educators</h2>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600">4.9/5 from 1,200+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Parent of 3rd Grader',
                content: 'My daughter went from crying during math homework to asking for "math time" every day. The confidence boost has been incredible.',
                rating: 5,
              },
              {
                name: 'Dr. James Liu',
                role: 'Elementary School Principal',
                content: 'We\'ve seen measurable improvements across our intervention groups. The data quality and insights are remarkable.',
                rating: 5,
              },
              {
                name: 'Emily R.',
                role: 'Special Education Teacher',
                content: 'Finally, a tool that truly adapts to my students\' IEPs. The emotional awareness makes all the difference.',
                rating: 5,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-600">{review.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Building Confidence Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families helping their children overcome learning anxiety and build lasting math confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg">
              Start 14-Day Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-lg hover:bg-white/10 font-bold text-lg">
              Schedule a Demo
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">No credit card required • Cancel anytime • COPPA compliant</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center text-white mb-4">
                <Brain className="h-6 w-6 mr-2" />
                <span className="font-bold text-lg">Neurlearning</span>
              </div>
              <p className="text-sm">
                AI-powered learning companion reducing anxiety and building confidence.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">For Schools</a></li>
                <li><a href="#" className="hover:text-white">Research</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">COPPA Compliance</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2024 Neurlearning. All rights reserved. Made with ❤️ for learners everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
