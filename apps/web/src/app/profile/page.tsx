'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  country: string
  city?: string
  language: string
  timezone: string
  currency: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  twoFactorEnabled: boolean
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    showEmail: boolean
    showPhone: boolean
    showBirthday: boolean
    showLocation: boolean
  }
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
    security: boolean
  }
  socialLinks: {
    website?: string
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
  createdAt: string
  lastLoginAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // Simulate API call
      const mockProfile: UserProfile = {
        id: '1',
        username: 'john_doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Digital creator and social media enthusiast',
        phone: '+201234567890',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        country: 'EG',
        city: 'Cairo',
        language: 'ar',
        timezone: 'Africa/Cairo',
        currency: 'EGP',
        isEmailVerified: true,
        isPhoneVerified: true,
        twoFactorEnabled: false,
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
          showBirthday: true,
          showLocation: true,
        },
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false,
          security: true,
        },
        socialLinks: {
          website: 'https://johndoe.com',
          facebook: 'https://facebook.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
          twitter: 'https://twitter.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          youtube: 'https://youtube.com/c/johndoe',
          tiktok: 'https://tiktok.com/@johndoe',
        },
        createdAt: '2023-01-01T00:00:00Z',
        lastLoginAt: '2026-04-12T10:30:00Z',
      }
      setProfile(mockProfile)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (section: string, data: any) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile(prev => prev ? { ...prev, ...data } : null)
      setEditingSection(null)
      setMessage({ type: 'success', text: `${section} updated successfully` })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    setSaving(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const avatarUrl = URL.createObjectURL(file)
      setProfile(prev => prev ? { ...prev, avatar: avatarUrl } : null)
      setShowAvatarModal(false)
      setMessage({ type: 'success', text: 'Avatar updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload avatar' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string }) => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setShowPasswordModal(false)
      setMessage({ type: 'success', text: 'Password changed successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setSaving(false)
    }
  }

  const handle2FASetup = async () => {
    setSaving(true)
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfile(prev => prev ? { ...prev, twoFactorEnabled: true } : null)
      setShow2FAModal(false)
      setMessage({ type: 'success', text: '2FA enabled successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to enable 2FA' })
    } finally {
      setSaving(false)
    }
  }

  const handleGoogleConnect = () => {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information</p>
          <Link href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
            </div>
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckIcon className="w-5 h-5 mr-2" />
              ) : (
                <XMarkIcon className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profile.avatar || 'https://ui-avatars.com/api/?name=' + profile.firstName + '+' + profile.lastName + '&size=150&background=3b82f6&color=fff'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <CameraIcon className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">@{profile.username}</p>
                
                <div className="mt-4 flex justify-center space-x-2 space-x-reverse">
                  {profile.isEmailVerified && (
                    <span className="badge badge-success">Email Verified</span>
                  )}
                  {profile.isPhoneVerified && (
                    <span className="badge badge-success">Phone Verified</span>
                  )}
                  {profile.twoFactorEnabled && (
                    <span className="badge badge-primary">2FA Enabled</span>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CalendarIcon className="w-4 h-4 ml-2" />
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 ml-2" />
                    {profile.city}, {profile.country}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                  >
                    <KeyIcon className="w-4 h-4 ml-2" />
                    Change Password
                  </button>
                  <button
                    onClick={() => setShow2FAModal(true)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                  >
                    <ShieldCheckIcon className="w-4 h-4 ml-2" />
                    {profile.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </button>
                  <button
                    onClick={handleGoogleConnect}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                  >
                    <GlobeAltIcon className="w-4 h-4 ml-2" />
                    Connect Google Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  {editingSection !== 'personal' ? (
                    <button
                      onClick={() => setEditingSection('personal')}
                      className="btn btn-secondary"
                    >
                      <PencilIcon className="w-4 h-4 ml-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProfile('Personal Information', {
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          bio: profile.bio,
                          phone: profile.phone,
                          dateOfBirth: profile.dateOfBirth,
                          gender: profile.gender,
                          country: profile.country,
                          city: profile.city,
                        })}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">First Name</label>
                    {editingSection === 'personal' ? (
                      <input
                        type="text"
                        className="form-input"
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    {editingSection === 'personal' ? (
                      <input
                        type="text"
                        className="form-input"
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 ml-2" />
                      <p className="text-gray-900">{profile.email}</p>
                      {profile.isEmailVerified && (
                        <CheckIcon className="w-4 h-4 text-green-500 ml-2" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    {editingSection === 'personal' ? (
                      <input
                        type="tel"
                        className="form-input"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    ) : (
                      <div className="flex items-center">
                        <PhoneIcon className="w-4 h-4 text-gray-400 ml-2" />
                        <p className="text-gray-900">{profile.phone || 'Not set'}</p>
                        {profile.isPhoneVerified && (
                          <CheckIcon className="w-4 h-4 text-green-500 ml-2" />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    {editingSection === 'personal' ? (
                      <input
                        type="date"
                        className="form-input"
                        value={profile.dateOfBirth || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    {editingSection === 'personal' ? (
                      <select
                        className="form-input"
                        value={profile.gender || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, gender: e.target.value as any } : null)}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.gender || 'Not set'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Bio</label>
                    {editingSection === 'personal' ? (
                      <textarea
                        className="form-input"
                        rows={3}
                        value={profile.bio || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                        placeholder="Tell us about yourself"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bio || 'No bio set'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Language */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Location & Language</h3>
                  {editingSection !== 'location' ? (
                    <button
                      onClick={() => setEditingSection('location')}
                      className="btn btn-secondary"
                    >
                      <PencilIcon className="w-4 h-4 ml-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProfile('Location & Language', {
                          country: profile.country,
                          city: profile.city,
                          language: profile.language,
                          timezone: profile.timezone,
                          currency: profile.currency,
                        })}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Country</label>
                    {editingSection === 'location' ? (
                      <select
                        className="form-input"
                        value={profile.country}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, country: e.target.value } : null)}
                      >
                        <option value="EG">Egypt</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="KW">Kuwait</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="QA">Qatar</option>
                        <option value="BH">Bahrain</option>
                        <option value="OM">Oman</option>
                        <option value="JO">Jordan</option>
                        <option value="LB">Lebanon</option>
                        <option value="SY">Syria</option>
                        <option value="IQ">Iraq</option>
                        <option value="MA">Morocco</option>
                        <option value="TN">Tunisia</option>
                        <option value="DZ">Algeria</option>
                        <option value="LY">Libya</option>
                        <option value="SD">Sudan</option>
                        <option value="YE">Yemen</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.country}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    {editingSection === 'location' ? (
                      <input
                        type="text"
                        className="form-input"
                        value={profile.city || ''}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, city: e.target.value } : null)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.city || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Language</label>
                    {editingSection === 'location' ? (
                      <select
                        className="form-input"
                        value={profile.language}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, language: e.target.value } : null)}
                      >
                        <option value="ar">Arabic</option>
                        <option value="en">English</option>
                        <option value="fr">French</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.language === 'ar' ? 'Arabic' : profile.language === 'en' ? 'English' : 'French'}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Timezone</label>
                    {editingSection === 'location' ? (
                      <select
                        className="form-input"
                        value={profile.timezone}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, timezone: e.target.value } : null)}
                      >
                        <option value="Africa/Cairo">Cairo (GMT+2)</option>
                        <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                        <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                        <option value="Asia/Dubai">Dubai (GMT+4)</option>
                        <option value="Asia/Qatar">Qatar (GMT+3)</option>
                        <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                        <option value="Asia/Muscat">Muscat (GMT+4)</option>
                        <option value="Asia/Amman">Amman (GMT+3)</option>
                        <option value="Asia/Beirut">Beirut (GMT+3)</option>
                        <option value="Asia/Damascus">Damascus (GMT+3)</option>
                        <option value="Asia/Baghdad">Baghdad (GMT+3)</option>
                        <option value="Africa/Tripoli">Tripoli (GMT+2)</option>
                        <option value="Africa/Tunis">Tunis (GMT+1)</option>
                        <option value="Africa/Algiers">Algiers (GMT+1)</option>
                        <option value="Africa/Casablanca">Casablanca (GMT+0)</option>
                        <option value="Asia/Aden">Aden (GMT+3)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.timezone}</p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Currency</label>
                    {editingSection === 'location' ? (
                      <select
                        className="form-input"
                        value={profile.currency}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, currency: e.target.value } : null)}
                      >
                        <option value="EGP">Egyptian Pound (EGP)</option>
                        <option value="SAR">Saudi Riyal (SAR)</option>
                        <option value="KWD">Kuwaiti Dinar (KWD)</option>
                        <option value="AED">UAE Dirham (AED)</option>
                        <option value="QAR">Qatari Riyal (QAR)</option>
                        <option value="BHD">Bahraini Dinar (BHD)</option>
                        <option value="OMR">Omani Rial (OMR)</option>
                        <option value="JOD">Jordanian Dinar (JOD)</option>
                        <option value="LBP">Lebanese Pound (LBP)</option>
                        <option value="SYP">Syrian Pound (SYP)</option>
                        <option value="IQD">Iraqi Dinar (IQD)</option>
                        <option value="LYD">Libyan Dinar (LYD)</option>
                        <option value="TND">Tunisian Dinar (TND)</option>
                        <option value="DZD">Algerian Dinar (DZD)</option>
                        <option value="MAD">Moroccan Dirham (MAD)</option>
                        <option value="YER">Yemeni Rial (YER)</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.currency}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                  {editingSection !== 'social' ? (
                    <button
                      onClick={() => setEditingSection('social')}
                      className="btn btn-secondary"
                    >
                      <PencilIcon className="w-4 h-4 ml-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProfile('Social Links', {
                          socialLinks: profile.socialLinks,
                        })}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="form-label capitalize">{platform.replace('_', ' ')}</label>
                      {editingSection === 'social' ? (
                        <input
                          type="url"
                          className="form-input"
                          value={url || ''}
                          onChange={(e) => setProfile(prev => prev ? {
                            ...prev,
                            socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                          } : null)}
                          placeholder={`https://${platform}.com/...`}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              {url}
                            </a>
                          ) : (
                            'Not set'
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                  {editingSection !== 'privacy' ? (
                    <button
                      onClick={() => setEditingSection('privacy')}
                      className="btn btn-secondary"
                    >
                      <PencilIcon className="w-4 h-4 ml-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProfile('Privacy Settings', {
                          privacy: profile.privacy,
                        })}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Profile Visibility</label>
                    {editingSection === 'privacy' ? (
                      <select
                        className="form-input"
                        value={profile.privacy.profileVisibility}
                        onChange={(e) => setProfile(prev => prev ? {
                          ...prev,
                          privacy: { ...prev.privacy, profileVisibility: e.target.value as any }
                        } : null)}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 capitalize">{profile.privacy.profileVisibility}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(profile.privacy).map(([key, value]) => {
                      if (key === 'profileVisibility') return null
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <label className="form-label mb-0 capitalize">
                            Show {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          {editingSection === 'privacy' ? (
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setProfile(prev => prev ? {
                                ...prev,
                                privacy: { ...prev.privacy, [key]: e.target.checked }
                              } : null)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                          ) : (
                            <span className={`badge ${value ? 'badge-success' : 'badge-warning'}`}>
                              {value ? 'Visible' : 'Hidden'}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                  {editingSection !== 'notifications' ? (
                    <button
                      onClick={() => setEditingSection('notifications')}
                      className="btn btn-secondary"
                    >
                      <PencilIcon className="w-4 h-4 ml-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2 space-x-reverse">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveProfile('Notification Settings', {
                          notifications: profile.notifications,
                        })}
                        disabled={saving}
                        className="btn btn-primary"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {Object.entries(profile.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="form-label mb-0 capitalize">
                        {key === 'email' ? 'Email Notifications' :
                         key === 'push' ? 'Push Notifications' :
                         key === 'sms' ? 'SMS Notifications' :
                         key === 'marketing' ? 'Marketing Emails' :
                         key === 'security' ? 'Security Alerts' : key}
                      </label>
                      {editingSection === 'notifications' ? (
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setProfile(prev => prev ? {
                            ...prev,
                            notifications: { ...prev.notifications, [key]: e.target.checked }
                          } : null)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      ) : (
                        <span className={`badge ${value ? 'badge-success' : 'badge-warning'}`}>
                          {value ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Avatar</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleAvatarUpload(file)
                    }}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn btn-primary cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse mt-6">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePasswordChange({
                    currentPassword: '',
                    newPassword: '',
                  })}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {profile.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
              </h3>
              
              <div className="space-y-4">
                {!profile.twoFactorEnabled ? (
                  <>
                    <div className="text-center">
                      <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Enable two-factor authentication to add an extra layer of security to your account.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        <li>1. We'll send a code to your phone</li>
                        <li>2. Enter the code to verify</li>
                        <li>3. Save backup codes for recovery</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <CheckIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Two-factor authentication is enabled on your account.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse mt-6">
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                {!profile.twoFactorEnabled && (
                  <button
                    onClick={handle2FASetup}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? 'Enabling...' : 'Enable 2FA'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
