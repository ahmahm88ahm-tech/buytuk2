'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  CalendarIcon,
  VideoCameraIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    engagement: 0,
    followers: 0,
    recentActivity: [],
    topPosts: [],
    platformStats: {},
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalPosts: 156,
        totalViews: 45678,
        engagement: 8.5,
        followers: 12345,
        recentActivity: [
          { type: 'post', platform: 'Facebook', time: '2 hours ago', content: 'New product launch!' },
          { type: 'stream', platform: 'YouTube', time: '5 hours ago', content: 'Live Q&A session' },
          { type: 'post', platform: 'Instagram', time: '1 day ago', content: 'Behind the scenes' },
        ],
        topPosts: [
          { id: 1, platform: 'Facebook', views: 12345, engagement: 12.5, content: 'Product announcement' },
          { id: 2, platform: 'YouTube', views: 8901, engagement: 9.8, content: 'Tutorial video' },
          { id: 3, platform: 'Instagram', views: 6789, engagement: 15.2, content: 'Story highlight' },
        ],
        platformStats: {
          Facebook: { followers: 5000, posts: 45, engagement: 8.2 },
          Instagram: { followers: 4000, posts: 67, engagement: 12.1 },
          YouTube: { followers: 2000, posts: 23, engagement: 6.5 },
          TikTok: { followers: 1345, posts: 21, engagement: 18.9 },
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  const quickActions = [
    {
      title: 'Start Live Stream',
      description: 'Go live on multiple platforms',
      icon: VideoCameraIcon,
      href: '/streaming',
      color: 'bg-red-600',
    },
    {
      title: 'Generate Content',
      description: 'Create AI-powered posts',
      icon: SparklesIcon,
      href: '/ai-tools',
      color: 'bg-purple-600',
    },
    {
      title: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: CalendarIcon,
      href: '/scheduler',
      color: 'bg-blue-600',
    },
    {
      title: 'View Analytics',
      description: 'Track your performance',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'bg-green-600',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your social media overview</p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <button className="btn btn-primary">
                <VideoCameraIcon className="w-5 h-5 ml-2" />
                Start Stream
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.engagement}%</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                  <UserGroupIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.followers.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'stream' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'stream' ? (
                            <VideoCameraIcon className="w-5 h-5 text-red-600" />
                          ) : (
                            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.content}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.platform} · {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {Object.entries(stats.platformStats).map(([platform, data], index) => (
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{platform}</span>
                        <span className="text-sm text-gray-500">{data.followers.toLocaleString()} followers</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{data.posts} posts</span>
                        <span className="font-medium text-green-600">{data.engagement}% engagement</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Posts</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {stats.topPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.content}</p>
                        <p className="text-sm text-gray-500">{post.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{post.views.toLocaleString()} views</p>
                      <p className="text-sm text-green-600">{post.engagement}% engagement</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
