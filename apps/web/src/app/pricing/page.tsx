'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      currency: 'EGP',
      features: [
        { name: '1 social account', included: true },
        { name: '10 posts per month', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Community support', included: true },
        { name: 'AI content generation', included: false },
        { name: 'Live streaming', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
      ],
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For growing creators and businesses',
      price: { monthly: 199, yearly: 1990 },
      currency: 'EGP',
      features: [
        { name: '4 social accounts', included: true },
        { name: 'Unlimited posts', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'AI content generation', included: true },
        { name: 'Live streaming', included: true },
        { name: 'Trend analysis', included: true },
        { name: 'Email support', included: true },
        { name: 'Priority support', included: false },
      ],
      highlighted: true,
    },
    {
      name: 'Elite',
      description: 'For established brands and agencies',
      price: { monthly: 499, yearly: 4990 },
      currency: 'EGP',
      features: [
        { name: 'Unlimited social accounts', included: true },
        { name: 'Unlimited posts', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'AI content generation', included: true },
        { name: 'Live streaming', included: true },
        { name: 'Competitor analysis', included: true },
        { name: 'Priority support', included: true },
        { name: 'Personal consultations', included: true },
      ],
      highlighted: false,
    },
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, Apple Pay, and local payment methods including InstaPay, Vodafone Cash, STC Pay, and K-Net.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 7-day free trial. No credit card required to start.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all new subscriptions.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
              <p className="text-gray-600 mt-1">Choose the perfect plan for your needs</p>
            </div>
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            Choose the perfect plan for your social media management needs
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center space-x-4 space-x-reverse"
          >
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-sm">(Save 17%)</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`card p-8 relative ${
                plan.highlighted ? 'ring-2 ring-primary-500 ring-offset-2' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="badge badge-primary">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price[billingCycle]}
                  <span className="text-lg text-gray-600 mr-1">{plan.currency}</span>
                  <span className="text-lg text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3 space-x-reverse">
                    {feature.included ? (
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XMarkIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full btn ${
                  plan.highlighted ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare All Features
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Elite
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Social Accounts
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">4</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Posts
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Unlimited</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Live Streaming
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    AI Content Generation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Advanced Analytics
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <XMarkIcon className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary-600 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators and businesses using SocialBoost
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link href="/streaming" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Start Free Trial
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
