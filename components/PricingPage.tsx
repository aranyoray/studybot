'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Star, Users, School, Beaker, ArrowRight } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  popular?: boolean
  cta: string
  icon: any
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const pricingTiers: PricingTier[] = [
    {
      name: 'Individual',
      price: billingCycle === 'monthly' ? '$29' : '$290',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Perfect for parents with 1-2 children',
      icon: Users,
      features: [
        'Up to 2 student profiles',
        '10-minute daily learning sessions',
        'Adaptive math games (Number Sense, Magnitude)',
        'Cognitive training (Memory, Attention, Speed)',
        'Real-time progress dashboard',
        'Weekly progress reports via email',
        'Anxiety & confidence tracking',
        'Age-appropriate metacognitive reflection',
        'Achievement badges & rewards',
        'Mobile & desktop access',
      ],
      notIncluded: [
        'IEP/504 accommodations',
        'Parent-teacher collaboration tools',
        'Research data exports',
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Family',
      price: billingCycle === 'monthly' ? '$49' : '$490',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Best for families with multiple children',
      icon: Star,
      popular: true,
      features: [
        'Up to 5 student profiles',
        'Everything in Individual',
        'IEP/504 accommodation support',
        'Learning disorder adaptive thresholds (ADHD, ASD, Dyslexia, etc.)',
        'Text-to-speech & speech-to-text',
        'Visual accommodations (font, spacing, overlays)',
        'Priority email support',
        'Monthly parent coaching call (30 min)',
        'Custom learning plans',
        'Sibling progress comparison',
      ],
      notIncluded: [
        'Classroom management tools',
        'Research data exports',
      ],
      cta: 'Start Free Trial',
    },
    {
      name: 'Educator',
      price: billingCycle === 'monthly' ? '$99' : '$990',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'For teachers & small classrooms',
      icon: School,
      features: [
        'Up to 30 student profiles',
        'Everything in Family',
        'Classroom dashboard with all students',
        'Group analytics & insights',
        'Individual student progress tracking',
        'Parent-teacher collaboration portal',
        'Assign custom learning goals',
        'Export progress reports (PDF/CSV)',
        'Professional development resources',
        'Dedicated account manager',
        'Training webinars',
      ],
      notIncluded: [
        'Research-grade data exports',
        'IRB compliance tools',
      ],
      cta: 'Request Demo',
    },
    {
      name: 'Researcher',
      price: 'Custom',
      period: '',
      description: 'For educational research institutions',
      icon: Beaker,
      features: [
        'Unlimited student profiles',
        'Everything in Educator',
        'Research-grade data collection',
        'COPPA/GDPR/DPDA compliant exports',
        'Pseudonymized participant data',
        'Behavioral event logging',
        'Session quality validation',
        'Attention check system',
        'Custom survey integration',
        'IRB protocol support',
        'Data export (JSON/CSV) for R/SPSS',
        'API access for data pipeline',
        'White-label option',
        'Dedicated research support team',
      ],
      cta: 'Contact Sales',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <span className="text-2xl font-bold text-gray-800">Neurlearning</span>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
            Sign In
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-900 mb-6"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-8"
        >
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </motion.p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-lg ${billingCycle === 'monthly' ? 'font-bold text-purple-600' : 'text-gray-600'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-16 h-8 bg-gray-300 rounded-full transition-all"
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 2 : 34 }}
              className="absolute top-1 w-6 h-6 bg-purple-600 rounded-full"
            />
          </button>
          <span className={`text-lg ${billingCycle === 'annual' ? 'font-bold text-purple-600' : 'text-gray-600'}`}>
            Annual
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            Save 17%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-3xl shadow-xl p-8 relative ${
                tier.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <tier.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-600 text-lg">{tier.period}</span>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-full font-bold text-lg mb-8 transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tier.cta}
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </motion.button>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">What's included:</p>
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded && tier.notIncluded.length > 0 && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <p className="text-sm font-semibold text-gray-500 mb-3">Not included:</p>
                      {tier.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'Can I switch plans later?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
            },
            {
              q: 'What happens after the free trial?',
              a: 'Your 14-day free trial gives you full access to all features. No credit card required. After the trial, you can choose a paid plan or continue with limited free access.',
            },
            {
              q: 'Do you offer school/district pricing?',
              a: 'Yes! For schools and districts with 100+ students, we offer custom enterprise pricing. Contact our sales team for details.',
            },
            {
              q: 'Is my child\'s data safe?',
              a: 'Absolutely. We are COPPA, GDPR, and FERPA compliant. All student data is encrypted, pseudonymized, and never shared with third parties without explicit consent.',
            },
            {
              q: 'Can I get a refund?',
              a: 'Yes. We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform learning?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of families using Neurlearning to build confidence and reduce anxiety.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Research</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">COPPA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2026 Neurlearning. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
