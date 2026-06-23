'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface PlatformLimits {
  twitter: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
  instagram: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
  facebook: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
  tiktok: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
  youtube: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
  linkedin: {
    maxCharacters: number
    maxImages: number
    maxVideos: number
    supportedFormats: string[]
  }
}

interface ValidationResult {
  platform: string
  isValid: boolean
  warnings: string[]
  errors: string[]
  characterCount: number
  imageCount: number
  videoCount: number
}

interface ContentValidatorProps {
  content: string
  images: File[]
  videos: File[]
  selectedPlatforms: string[]
  onValidationChange?: (results: ValidationResult[]) => void
}

export function ContentValidator({
  content,
  images,
  videos,
  selectedPlatforms,
  onValidationChange,
}: ContentValidatorProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [platformLimits] = useState<PlatformLimits>({
    twitter: {
      maxCharacters: 280,
      maxImages: 4,
      maxVideos: 1,
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
    },
    instagram: {
      maxCharacters: 2200,
      maxImages: 10,
      maxVideos: 1,
      supportedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'mov'],
    },
    facebook: {
      maxCharacters: 63206,
      maxImages: 10,
      maxVideos: 10,
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
    },
    tiktok: {
      maxCharacters: 150,
      maxImages: 0,
      maxVideos: 1,
      supportedFormats: ['mp4', 'mov'],
    },
    youtube: {
      maxCharacters: 5000,
      maxImages: 0,
      maxVideos: 1,
      supportedFormats: ['mp4', 'mov', 'avi', 'mkv'],
    },
    linkedin: {
      maxCharacters: 3000,
      maxImages: 100,
      maxVideos: 20,
      supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
    },
  })

  useEffect(() => {
    const results = validateContent()
    setValidationResults(results)
    onValidationChange?.(results)
  }, [content, images, videos, selectedPlatforms])

  const validateContent = (): ValidationResult[] => {
    const results: ValidationResult[] = []
    const characterCount = content.length
    const imageCount = images.length
    const videoCount = videos.length

    selectedPlatforms.forEach(platform => {
      const limits = platformLimits[platform as keyof PlatformLimits]
      const warnings: string[] = []
      const errors: string[] = []
      let isValid = true

      // Character validation
      if (characterCount > limits.maxCharacters) {
        errors.push(`Text exceeds ${limits.maxCharacters} characters limit`)
        isValid = false
      } else if (characterCount > limits.maxCharacters * 0.9) {
        warnings.push(`Text is close to ${limits.maxCharacters} characters limit`)
      }

      // Image validation
      if (imageCount > limits.maxImages) {
        errors.push(`Too many images (max: ${limits.maxImages})`)
        isValid = false
      }

      // Video validation
      if (videoCount > limits.maxVideos) {
        errors.push(`Too many videos (max: ${limits.maxVideos})`)
        isValid = false
      }

      // Format validation
      const allFiles = [...images, ...videos]
      const invalidFormats = allFiles.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase()
        return !limits.supportedFormats.includes(extension || '')
      })

      if (invalidFormats.length > 0) {
        errors.push(`Unsupported file formats: ${invalidFormats.map(f => f.name.split('.').pop()).join(', ')}`)
        isValid = false
      }

      // Platform-specific validations
      if (platform === 'twitter') {
        if (characterCount > 280) {
          errors.push('Tweet exceeds 280 characters - will not be published to Twitter/X')
        }
      } else if (platform === 'instagram') {
        if (videoCount > 0 && imageCount > 0) {
          warnings.push('Instagram posts can have either images OR videos, not both')
        }
        if (imageCount > 0 && imageCount < 3) {
          warnings.push('Instagram carousel posts work best with 3+ images')
        }
      } else if (platform === 'tiktok') {
        if (imageCount > 0) {
          errors.push('TikTok only supports video content')
          isValid = false
        }
        if (videoCount === 0) {
          errors.push('TikTok requires at least one video')
          isValid = false
        }
      } else if (platform === 'youtube') {
        if (imageCount > 0) {
          errors.push('YouTube only supports video content')
          isValid = false
        }
        if (videoCount === 0) {
          errors.push('YouTube requires at least one video')
          isValid = false
        }
      }

      results.push({
        platform,
        isValid,
        warnings,
        errors,
        characterCount,
        imageCount,
        videoCount,
      })
    })

    return results
  }

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: 'X',
      instagram: 'IG',
      facebook: 'FB',
      tiktok: 'TT',
      youtube: 'YT',
      linkedin: 'LI',
    }
    return icons[platform as keyof typeof icons] || platform
  }

  const getPlatformColor = (platform: string) => {
    const colors = {
      twitter: 'bg-black',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      facebook: 'bg-blue-600',
      tiktok: 'bg-black',
      youtube: 'bg-red-600',
      linkedin: 'bg-blue-700',
    }
    return colors[platform as keyof typeof colors] || 'bg-gray-600'
  }

  const getValidationStatus = (result: ValidationResult) => {
    if (!result.isValid) return 'error'
    if (result.warnings.length > 0) return 'warning'
    return 'success'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (selectedPlatforms.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 ml-3" />
          <p className="text-blue-800 text-sm">
            Select platforms to see validation results
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Validation</h3>
        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
          <span>Characters: {content.length}</span>
          <span>Images: {images.length}</span>
          <span>Videos: {videos.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {validationResults.map((result) => {
          const status = getValidationStatus(result)
          const limits = platformLimits[result.platform as keyof PlatformLimits]
          
          return (
            <div
              key={result.platform}
              className={`border rounded-lg p-4 ${getStatusColor(status)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${getPlatformColor(result.platform)} rounded-full flex items-center justify-center text-white text-xs font-bold ml-2`}>
                    {getPlatformIcon(result.platform)}
                  </div>
                  <div className="mr-3">
                    <h4 className="font-medium text-gray-900 capitalize">{result.platform}</h4>
                    <div className="text-sm text-gray-600">
                      {result.characterCount}/{limits.maxCharacters} chars
                      {limits.maxImages > 0 && ` · ${result.imageCount}/${limits.maxImages} images`}
                      {limits.maxVideos > 0 && ` · ${result.videoCount}/${limits.maxVideos} videos`}
                    </div>
                  </div>
                </div>
                {getStatusIcon(status)}
              </div>

              {/* Character progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Character usage</span>
                  <span>{Math.round((result.characterCount / limits.maxCharacters) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      result.characterCount > limits.maxCharacters
                        ? 'bg-red-500'
                        : result.characterCount > limits.maxCharacters * 0.9
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min((result.characterCount / limits.maxCharacters) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="space-y-1 mb-2">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start">
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 ml-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{warning}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  {result.errors.map((error, index) => (
                    <div key={index} className="flex items-start">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500 ml-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Success message */}
              {status === 'success' && (
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 ml-2" />
                  <p className="text-sm text-green-800">Content is ready for publication</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <CheckCircleIcon className="w-4 h-4 text-green-500 ml-2" />
            <span className="text-gray-700">
              {validationResults.filter(r => getValidationStatus(r) === 'success').length} platforms ready
            </span>
          </div>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 ml-2" />
            <span className="text-gray-700">
              {validationResults.filter(r => getValidationStatus(r) === 'warning').length} platforms with warnings
            </span>
          </div>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 ml-2" />
            <span className="text-gray-700">
              {validationResults.filter(r => getValidationStatus(r) === 'error').length} platforms with errors
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
