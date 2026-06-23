'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  PaperClipIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapPinIcon,
  HashtagIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ContentValidator } from './ContentValidator'

interface ContentEditorProps {
  initialContent?: string
  initialImages?: File[]
  initialVideos?: File[]
  selectedPlatforms: string[]
  onContentChange?: (content: string, images: File[], videos: File[]) => void
  onValidationChange?: (results: any[]) => void
  placeholder?: string
  maxLength?: number
}

export function ContentEditor({
  initialContent = '',
  initialImages = [],
  initialVideos = [],
  selectedPlatforms,
  onContentChange,
  onValidationChange,
  placeholder = 'What\'s on your mind?',
  maxLength,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [images, setImages] = useState<File[]>(initialImages)
  const [videos, setVideos] = useState<File[]>(initialVideos)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [location, setLocation] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [mentions, setMentions] = useState<string[]>([])

  const emojis = [
    'smile', 'grin', 'grinning', 'joy', 'rofl', 'lol', 'slightly_smiling_face',
    'upside_down_face', 'melting_face', 'wink', 'blush', 'heart_eyes', 'kissing_heart',
    'kissing', 'relaxed', 'hugging_face', 'star_struck', 'thinking_face',
    'face_exhaling', 'face_with_monocle', 'nerd_face', 'face_with_head_bandage',
    'smiling_face_with_tear', 'zany_face', 'squinting_face', 'head_bandage',
    'drooling_face', 'lying_face', 'relieved_face', 'pensive', 'sleepy',
    'confused', 'upside_down_face', 'grimacing', 'face_with_thermometer',
    'head_bandage', 'nauseated_face', 'sneezing_face', 'dizzy', 'cowboy_hat_face',
    'partying_face', 'disguised_face', 'sunglasses', 'nerd_face', 'monocle_face',
    'clown_face', 'nauseated_face', 'rolling_eyes', 'star_struck', 'heart_eyes',
    'kissing_heart', 'kissing', 'relaxed', 'hugging_face', 'star_struck',
    'thinking_face', 'face_exhaling', 'face_with_monocle', 'nerd_face',
    'face_with_head_bandage', 'smiling_face_with_tear', 'zany_face',
    'squinting_face', 'head_bandage', 'drooling_face', 'lying_face',
    'relieved_face', 'pensive', 'sleepy', 'confused', 'upside_down_face',
    'grimacing', 'face_with_thermometer', 'head_bandage', 'nauseated_face',
    'sneezing_face', 'dizzy', 'cowboy_hat_face', 'partying_face',
    'disguised_face', 'sunglasses', 'nerd_face', 'monocle_face', 'clown_face',
    'nauseated_face', 'rolling_eyes', 'star_struck', 'heart_eyes', 'kissing_heart',
  ]

  const trendingHashtags = [
    '#socialmedia', '#marketing', '#contentcreator', '#digitalmarketing',
    '#influencer', '#viral', '#trending', '#socialmediamarketing',
    '#contentmarketing', '#branding', '#entrepreneur', '#business',
    '#startup', '#tech', '#innovation', '#motivation', '#success',
    '#lifestyle', '#travel', '#food', '#fitness', '#health',
    '#beauty', '#fashion', '#art', '#music', '#entertainment',
    '#news', '#politics', '#sports', '#gaming', '#technology',
    '#science', '#education', '#culture', '#history', '#nature',
    '#photography', '#design', '#architecture', '#interiordesign',
    '#fashiondesign', '#graphicdesign', '#uidesign', '#webdesign',
    '#productdesign', '#industrialdesign', '#fashiondesigner',
    '#graphicdesigner', '#uidesigner', '#webdesigner', '#productdesigner',
    '#industrialdesigner', '#architect', '#interiordesigner',
    '#photographer', '#artist', '#musician', '#singer', '#songwriter',
    '#producer', '#director', '#actor', '#actress', '#model',
    '#influencer', '#blogger', '#vlogger', '#podcaster', '#streamer',
    '#gamer', '#developer', '#programmer', '#coder', '#softwareengineer',
    '#dataengineer', '#machinelearning', '#artificialintelligence',
    '#blockchain', '#cryptocurrency', '#nft', '#metaverse',
    '#virtualreality', '#augmentedreality', '#gamedevelopment',
    '#appdevelopment', '#webdevelopment', '#mobiledevelopment',
    '#frontend', '#backend', '#fullstack', '#devops', '#cloudcomputing',
    '#cybersecurity', '#datascience', '#analytics', '#bigdata',
    '#iot', '#robotics', '#automation', '#fintech', '#edtech',
    '#healthtech', '#biotech', '#cleantech', '#agritech', '#foodtech',
    '#fashiontech', '#beautytch', '#traveltech', '#realestatetech',
    '#properte', '#insurtech', '#legaltech', '#govtech', '#civictech',
  ]

  useEffect(() => {
    onContentChange?.(content, images, videos)
  }, [content, images, videos])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      return validTypes.includes(file.type)
    })
    setImages(prev => [...prev, ...validFiles])
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv']
      return validTypes.includes(file.type)
    })
    setVideos(prev => [...prev, ...validFiles])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + `:${emoji}:`)
    setShowEmojiPicker(false)
  }

  const addHashtag = (hashtag: string) => {
    setContent(prev => prev + ` ${hashtag}`)
    setShowHashtagSuggestions(false)
  }

  const addMention = (username: string) => {
    setContent(prev => prev + ` @${username}`)
    setMentions(prev => [...prev, username])
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (maxLength && value.length > maxLength) {
      return
    }
    setContent(value)
  }

  const getCharacterCount = () => {
    return content.length
  }

  const getCharacterCountColor = () => {
    if (maxLength) {
      const percentage = (content.length / maxLength) * 100
      if (percentage >= 100) return 'text-red-500'
      if (percentage >= 90) return 'text-yellow-500'
      if (percentage >= 75) return 'text-orange-500'
    }
    return 'text-gray-500'
  }

  return (
    <div className="space-y-4">
      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-lg"
          rows={6}
        />

        {/* Media Preview */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.name}
                </div>
              </div>
            ))}
            {videos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={URL.createObjectURL(video)}
                  className="w-full h-32 object-cover rounded-lg"
                  muted
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {video.name}
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                  <VideoCameraIcon className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Character Count */}
        {maxLength && (
          <div className="mt-2 text-right">
            <span className={`text-sm ${getCharacterCountColor()}`}>
              {getCharacterCount()} / {maxLength}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
          >
            <PhotoIcon className="w-5 h-5 ml-2" />
            <span className="text-sm">Add Photo</span>
          </label>
        </div>

        <div className="relative">
          <input
            type="file"
            id="video-upload"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
          <label
            htmlFor="video-upload"
            className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
          >
            <VideoCameraIcon className="w-5 h-5 ml-2" />
            <span className="text-sm">Add Video</span>
          </label>
        </div>

        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FaceSmileIcon className="w-5 h-5 ml-2" />
          <span className="text-sm">Emoji</span>
        </button>

        <button
          onClick={() => setShowHashtagSuggestions(!showHashtagSuggestions)}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <HashtagIcon className="w-5 h-5 ml-2" />
          <span className="text-sm">Hashtags</span>
        </button>

        <button
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <MapPinIcon className="w-5 h-5 ml-2" />
          <span className="text-sm">Location</span>
        </button>

        <button
          onClick={() => setScheduledTime(new Date().toISOString().slice(0, 16))}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <CalendarIcon className="w-5 h-5 ml-2" />
          <span className="text-sm">Schedule</span>
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto"
        >
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-2xl hover:bg-gray-100 p-1 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hashtag Suggestions */}
      {showHashtagSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto"
        >
          <h4 className="font-medium text-gray-900 mb-2">Trending Hashtags</h4>
          <div className="space-y-1">
            {trendingHashtags.slice(0, 20).map((hashtag) => (
              <button
                key={hashtag}
                onClick={() => addHashtag(hashtag)}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded transition-colors text-sm"
              >
                {hashtag}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Location Picker */}
      {showLocationPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        >
          <h4 className="font-medium text-gray-900 mb-2">Add Location</h4>
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-2 flex justify-end space-x-2 space-x-reverse">
            <button
              onClick={() => setShowLocationPicker(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (location) {
                  setContent(prev => prev + ` \n\n:map_pin: ${location}`)
                  setLocation('')
                  setShowLocationPicker(false)
                }
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </motion.div>
      )}

      {/* Scheduled Time Display */}
      {scheduledTime && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 text-blue-600 ml-2" />
              <span className="text-sm text-blue-800">
                Scheduled for: {new Date(scheduledTime).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setScheduledTime('')}
              className="text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Content Validator */}
      <ContentValidator
        content={content}
        images={images}
        videos={videos}
        selectedPlatforms={selectedPlatforms}
        onValidationChange={onValidationChange}
      />
    </div>
  )
}
