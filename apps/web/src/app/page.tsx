'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PlayIcon,
  ChartBarIcon,
  CogIcon,
  RocketLaunchIcon,
  SparklesIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      id: 0,
      title: 'AI Content Generation',
      description: 'Generate engaging content in Arabic dialects with advanced AI',
      icon: SparklesIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 1,
      title: 'Multi-Platform Streaming',
      description: 'Stream live to Facebook, Instagram, YouTube, TikTok simultaneously',
      icon: VideoCameraIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: 2,
      title: 'Advanced Analytics',
      description: 'Track performance across all platforms with detailed insights',
      icon: ChartBarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 3,
      title: 'Smart Scheduling',
      description: 'Post at optimal times based on peak engagement hours',
      icon: CogIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      currency: 'EGP',
      features: [
        '1 social account',
        '10 posts per month',
        'Basic analytics',
        'Community support',
      ],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '199',
      currency: 'EGP',
      features: [
        '4 social accounts',
        'Unlimited posts',
        'Advanced analytics',
        'AI content generation',
        'Trend analysis',
        'Email support',
      ],
      highlighted: true,
    },
    {
      name: 'Elite',
      price: '499',
      currency: 'EGP',
      features: [
        'Everything in Pro',
        'Advanced AI features',
        'Competitor analysis',
        'Priority support',
        'Custom integrations',
        'Personal consultations',
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="text-2xl font-bold text-gradient">SocialBoost</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/create-post"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Create Post
              </Link>
              <Link
                href="/streaming"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Live Streaming
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pricing
              </Link>
              <button className="btn btn-primary">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="text-gradient">SocialBoost</span>
              <br />
              <span className="text-gray-800">Social Media Management</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              AI-powered social media management platform designed for the Arab market.
              Stream live, generate content, and grow your audience across all platforms.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center space-x-4 space-x-reverse"
            >
              <Link href="/streaming" className="btn btn-primary text-lg px-8 py-3">
                <VideoCameraIcon className="w-5 h-5 ml-2" />
                Start Streaming
              </Link>
              <Link href="/dashboard" className="btn btn-secondary text-lg px-8 py-3">
                <ChartBarIcon className="w-5 h-5 ml-2" />
                View Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Social Media Success
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage and grow your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                className="card p-6 cursor-pointer"
                onClick={() => setActiveFeature(feature.id)}
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Streaming Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Stream Live to Multiple Platforms
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <VideoCameraIcon className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Platform Streaming</h3>
                    <p className="text-gray-600">
                      Stream simultaneously to Facebook, Instagram, YouTube, TikTok, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <RocketLaunchIcon className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">High-Quality Video</h3>
                    <p className="text-gray-600">
                      Support for 4K streaming with adaptive bitrate for smooth playback
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <ChartBarIcon className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Analytics</h3>
                    <p className="text-gray-600">
                      Track viewers, engagement, and performance across all platforms
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/streaming" className="btn btn-primary text-lg px-6 py-3">
                  <PlayIcon className="w-5 h-5 ml-2" />
                  Start Live Streaming
                </Link>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <VideoCameraIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Live Stream Preview</p>
                <p className="text-gray-500 text-sm mt-2">
                  Start streaming to see your live preview here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free and scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.05 }}
                className={`card p-8 ${
                  plan.highlighted
                    ? 'ring-2 ring-primary-500 ring-offset-2'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="badge badge-primary">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg text-gray-600 mr-1">
                      {plan.currency}
                    </span>
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2 space-x-reverse">
                      <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full btn ${
                    plan.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe Now'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">SocialBoost</div>
              <p className="text-gray-400">
                AI-powered social media management for the Arab market
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/streaming" className="hover:text-white transition-colors">Live Streaming</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="/ai-tools" className="hover:text-white transition-colors">AI Tools</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Service Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 SocialBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
