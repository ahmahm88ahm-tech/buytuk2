'use client'

import { useState } from 'react'
import { GoogleIcon } from './GoogleIcon'

interface GoogleAuthButtonProps {
  text: string
  onClick?: () => void
  disabled?: boolean
}

export function GoogleAuthButton({ text, onClick, disabled = false }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || loading) return
    
    setLoading(true)
    try {
      if (onClick) {
        onClick()
      } else {
        // Default Google OAuth flow
        window.location.href = '/api/auth/google'
      }
    } catch (error) {
      console.error('Google auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <GoogleIcon className="w-5 h-5 mr-2" />
      {loading ? 'Connecting...' : text}
    </button>
  )
}
