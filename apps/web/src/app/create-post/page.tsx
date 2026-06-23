'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ContentEditor } from '../../components/content/ContentEditor'
import { ContentValidator } from '../../components/content/ContentValidator'

export default function CreatePostPage() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [validationResults, setValidationResults] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: 'X', color: 'bg-black' },
    { id: 'instagram', name: 'Instagram', icon: 'IG', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: 'FB', color: 'bg-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: 'TT', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: 'YT', color: 'bg-red-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'LI', color: 'bg-blue-700' },
  ]

  useEffect(() => {
    // Load saved draft from localStorage
    const savedDraft = localStorage.getItem('postDraft')
    if (savedDraft) {
      const draft = JSON.parse(savedDraft)
      setContent(draft.content || '')
      setSelectedPlatforms(draft.selectedPlatforms || [])
      setScheduledTime(draft.scheduledTime || '')
      setIsScheduled(draft.isScheduled || false)
    }
  }, [])

  useEffect(() => {
    // Save draft to localStorage
    const draft = {
      content,
      selectedPlatforms,
      scheduledTime,
      isScheduled,
    }
    localStorage.setItem('postDraft', JSON.stringify(draft))
  }, [content, selectedPlatforms, scheduledTime, isScheduled])

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleContentChange = (newContent: string, newImages: File[], newVideos: File[]) => {
    setContent(newContent)
    setImages(newImages)
    setVideos(newVideos)
  }

  const handleValidationChange = (results: any[]) => {
    setValidationResults(results)
  }

  const handleSubmit = async (publishImmediately: boolean = false) => {
    if (selectedPlatforms.length === 0) {
      setSubmitStatus('error')
      setSubmitMessage('Please select at least one platform')
      return
    }

    if (!content.trim() && images.length === 0 && videos.length === 0) {
      setSubmitStatus('error')
      setSubmitMessage('Please add content, images, or videos')
      return
    }

    // Check for validation errors
    const platformsWithErrors = validationResults.filter(result => !result.isValid)
    if (platformsWithErrors.length > 0) {
      setSubmitStatus('error')
      setSubmitMessage(`Cannot publish to ${platformsWithErrors.map(p => p.platform).join(', ')} due to validation errors`)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const postData = {
        content,
        platforms: selectedPlatforms,
        images: images.map(img => ({
          filename: img.name,
          size: img.size,
          format: img.name.split('.').pop()?.toLowerCase() || '',
        })),
        videos: videos.map(video => ({
          filename: video.name,
          size: video.size,
          format: video.name.split('.').pop()?.toLowerCase() || '',
          duration: 0, // Would need to calculate this
        })),
        hashtags: content.match(/#\w+/g) || [],
        mentions: content.match(/@\w+/g) || [],
        scheduledAt: isScheduled && scheduledTime ? scheduledTime : undefined,
        settings: {
          allowComments: true,
          allowSharing: true,
          visibility: 'public',
        },
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Clear draft
      localStorage.removeItem('postDraft')

      setSubmitStatus('success')
      setSubmitMessage(publishImmediately ? 'Post published successfully!' : 'Post scheduled successfully!')
      
      // Reset form after delay
      setTimeout(() => {
        setContent('')
        setImages([])
        setVideos([])
        setSelectedPlatforms([])
        setScheduledTime('')
        setIsScheduled(false)
        setSubmitStatus('idle')
        setSubmitMessage('')
      }, 3000)

    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canPublish = validationResults.length > 0 && validationResults.every(result => result.isValid)
  const hasWarnings = validationResults.some(result => result.warnings.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 mr-4">
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Create Post</h1>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              {hasWarnings && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <ExclamationTriangleIcon className="w-4 h-4 ml-2" />
                  Warnings
                </div>
              )}
              {!canPublish && validationResults.length > 0 && (
                <div className="flex items-center text-red-600 text-sm">
                  <ExclamationTriangleIcon className="w-4 h-4 ml-2" />
                  Errors
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center text-white text-xs font-bold mb-2`}>
                        {platform.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <ContentEditor
              content={content}
              images={images}
              videos={videos}
              selectedPlatforms={selectedPlatforms}
              onContentChange={handleContentChange}
              onValidationChange={handleValidationChange}
              placeholder="What would you like to share?"
            />

            {/* Scheduling Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule Post</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">Schedule for later</span>
                </label>
              </div>
              
              {isScheduled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-blue-600 ml-2" />
                      <span className="text-sm text-blue-800">
                        Post will be published at {scheduledTime ? new Date(scheduledTime).toLocaleString() : 'the selected time'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || !canPublish || selectedPlatforms.length === 0}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5 ml-2" />
                      {isScheduled ? 'Schedule Post' : 'Publish Now'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || !canPublish || selectedPlatforms.length === 0}
                  className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-5 h-5 ml-2" />
                      Save Draft
                    </>
                  )}
                </button>
              </div>
              
              {/* Status Message */}
              {submitMessage && (
                <div className={`mt-4 p-3 rounded-lg flex items-center ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircleIcon className="w-5 h-5 ml-2" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 ml-2" />
                  )}
                  <span className="text-sm font-medium">{submitMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content Validation */}
            <ContentValidator
              content={content}
              images={images}
              videos={videos}
              selectedPlatforms={selectedPlatforms}
            />

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="ml-2">Twitter/X has a 280 character limit</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">Instagram works best with 3+ images or 1 video</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">TikTok requires video content only</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">LinkedIn posts perform best with 100+ characters</span>
                </li>
                <li className="flex items-start">
                  <span className="ml-2">Use relevant hashtags for better reach</span>
                </li>
              </ul>
            </div>

            {/* Platform Limits */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Platform Limits</h4>
              <div className="space-y-2 text-sm">
                {selectedPlatforms.map(platform => {
                  const limits = {
                    twitter: { chars: 280, images: 4, videos: 1 },
                    instagram: { chars: 2200, images: 10, videos: 1 },
                    facebook: { chars: 63206, images: 10, videos: 10 },
                    tiktok: { chars: 150, images: 0, videos: 1 },
                    youtube: { chars: 5000, images: 0, videos: 1 },
                    linkedin: { chars: 3000, images: 100, videos: 20 },
                  }
                  const limit = limits[platform as keyof typeof limits]
                  if (!limit) return null
                  
                  return (
                    <div key={platform} className="flex justify-between">
                      <span className="capitalize text-gray-700">{platform}</span>
                      <span className="text-gray-500">
                        {limit.chars} chars, {limit.images} images, {limit.videos} videos
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
