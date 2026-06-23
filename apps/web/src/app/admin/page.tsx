'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CogIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: { monthly: number; yearly: number }
  currency: string
  features: { name: string; included: boolean }[]
  highlighted: boolean
  isActive: boolean
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    validUntil: string
  }
}

interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'instapay' | 'vodafone_cash' | 'stc_pay' | 'knet'
  currency: string[]
  isActive: boolean
  fees: {
    percentage: number
    fixed: number
  }
  config: Record<string, any>
}

interface AdminUser {
  id: string
  email: string
  username: string
  role: 'admin' | 'moderator' | 'support'
  permissions: string[]
  isActive: boolean
  lastLogin: string
  createdAt: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'payments' | 'users' | 'analytics'>('pricing')
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    // Load admin data
    loadPricingPlans()
    loadPaymentMethods()
    loadAdminUsers()
    setLoading(false)
  }, [])

  const loadPricingPlans = () => {
    setPricingPlans([
      {
        id: '1',
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
        ],
        highlighted: false,
        isActive: true,
      },
      {
        id: '2',
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
          { name: 'Priority support', included: true },
        ],
        highlighted: true,
        isActive: true,
        discount: {
          type: 'percentage',
          value: 20,
          validUntil: '2026-05-12',
        },
      },
      {
        id: '3',
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
          { name: 'Personal consultations', included: true },
        ],
        highlighted: false,
        isActive: true,
      },
      {
        id: '4',
        name: 'Weekly',
        description: 'Short-term access for events',
        price: { monthly: 99, yearly: 0 },
        currency: 'EGP',
        features: [
          { name: '2 social accounts', included: true },
          { name: '50 posts', included: true },
          { name: 'Basic analytics', included: true },
          { name: 'Live streaming', included: true },
        ],
        highlighted: false,
        isActive: true,
      },
      {
        id: '5',
        name: 'Daily',
        description: '24-hour access for testing',
        price: { monthly: 29, yearly: 0 },
        currency: 'EGP',
        features: [
          { name: '1 social account', included: true },
          { name: '10 posts', included: true },
          { name: 'Basic analytics', included: true },
        ],
        highlighted: false,
        isActive: true,
      },
    ])
  }

  const loadPaymentMethods = () => {
    setPaymentMethods([
      {
        id: '1',
        name: 'Credit Card',
        type: 'card',
        currency: ['EGP', 'SAR', 'KWD', 'USD'],
        isActive: true,
        fees: { percentage: 2.9, fixed: 0.30 },
        config: {
          stripePublicKey: 'pk_live_...',
          stripeSecretKey: 'sk_live_...',
        },
      },
      {
        id: '2',
        name: 'InstaPay',
        type: 'instapay',
        currency: ['EGP'],
        isActive: true,
        fees: { percentage: 1.5, fixed: 0 },
        config: {
          merchantId: 'INSTAPAY_MERCHANT_123',
          apiKey: 'instapay_api_key_123',
        },
      },
      {
        id: '3',
        name: 'Vodafone Cash',
        type: 'vodafone_cash',
        currency: ['EGP'],
        isActive: true,
        fees: { percentage: 2.0, fixed: 0 },
        config: {
          merchantCode: 'VODAFONE_123',
          apiKey: 'vodafone_api_key_123',
        },
      },
      {
        id: '4',
        name: 'STC Pay',
        type: 'stc_pay',
        currency: ['SAR'],
        isActive: true,
        fees: { percentage: 1.8, fixed: 0 },
        config: {
          merchantId: 'STC_MERCHANT_123',
          apiKey: 'stc_api_key_123',
        },
      },
      {
        id: '5',
        name: 'K-Net',
        type: 'knet',
        currency: ['KWD'],
        isActive: true,
        fees: { percentage: 2.2, fixed: 0 },
        config: {
          merchantId: 'KNET_MERCHANT_123',
          apiKey: 'knet_api_key_123',
        },
      },
    ])
  }

  const loadAdminUsers = () => {
    setAdminUsers([
      {
        id: '1',
        email: 'admin@socialboost.com',
        username: 'superadmin',
        role: 'admin',
        permissions: ['all'],
        isActive: true,
        lastLogin: '2026-04-12T10:30:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '2',
        email: 'moderator@socialboost.com',
        username: 'moderator1',
        role: 'moderator',
        permissions: ['content_moderation', 'user_management'],
        isActive: true,
        lastLogin: '2026-04-12T09:15:00Z',
        createdAt: '2026-02-01T00:00:00Z',
      },
      {
        id: '3',
        email: 'support@socialboost.com',
        username: 'support1',
        role: 'support',
        permissions: ['support_tickets', 'user_help'],
        isActive: true,
        lastLogin: '2026-04-12T08:45:00Z',
        createdAt: '2026-03-01T00:00:00Z',
      },
    ])
  }

  const handleSavePricingPlan = (plan: Partial<PricingPlan>) => {
    if (editingItem) {
      setPricingPlans(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...plan } : p))
    } else {
      const newPlan: PricingPlan = {
        id: Date.now().toString(),
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || { monthly: 0, yearly: 0 },
        currency: plan.currency || 'EGP',
        features: plan.features || [],
        highlighted: plan.highlighted || false,
        isActive: plan.isActive || true,
      }
      setPricingPlans(prev => [...prev, newPlan])
    }
    setEditingItem(null)
    setShowCreateModal(false)
  }

  const handleSavePaymentMethod = (method: Partial<PaymentMethod>) => {
    if (editingItem) {
      setPaymentMethods(prev => prev.map(m => m.id === editingItem.id ? { ...m, ...method } : m))
    } else {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        name: method.name || '',
        type: method.type || 'card',
        currency: method.currency || ['EGP'],
        isActive: method.isActive || true,
        fees: method.fees || { percentage: 0, fixed: 0 },
        config: method.config || {},
      }
      setPaymentMethods(prev => [...prev, newMethod])
    }
    setEditingItem(null)
    setShowCreateModal(false)
  }

  const handleDeleteItem = (type: 'pricing' | 'payment', id: string) => {
    if (type === 'pricing') {
      setPricingPlans(prev => prev.filter(p => p.id !== id))
    } else {
      setPaymentMethods(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleToggleActive = (type: 'pricing' | 'payment' | 'user', id: string) => {
    if (type === 'pricing') {
      setPricingPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
    } else if (type === 'payment') {
      setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m))
    } else {
      setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage pricing, payments, users, and more</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="btn btn-secondary">
                <EyeIcon className="w-5 h-5 ml-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
            {[
              { id: 'pricing', name: 'Pricing Plans', icon: CurrencyDollarIcon },
              { id: 'payments', name: 'Payment Methods', icon: ShieldCheckIcon },
              { id: 'users', name: 'Admin Users', icon: UserGroupIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pricing Plans Tab */}
        {activeTab === 'pricing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing Plans</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-5 h-5 ml-2" />
                Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card p-6 ${plan.highlighted ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingItem(plan)
                          setShowCreateModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive('pricing', plan.id)}
                        className={`p-1 ${plan.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {plan.isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteItem('pricing', plan.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {plan.price.monthly} {plan.currency}
                      <span className="text-sm text-gray-600">/month</span>
                    </div>
                    {plan.price.yearly > 0 && (
                      <div className="text-sm text-gray-600">
                        {plan.price.yearly} {plan.currency} /year
                      </div>
                    )}
                  </div>

                  {plan.discount && (
                    <div className="mb-4 p-2 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-800">
                        {plan.discount.type === 'percentage' ? `${plan.discount.value}%` : `${plan.discount.value} ${plan.currency}`} OFF
                      </div>
                      <div className="text-xs text-green-600">
                        Valid until {new Date(plan.discount.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        {feature.included ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <XMarkIcon className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-5 h-5 ml-2" />
                Add Method
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currencies
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentMethods.map((method) => (
                    <tr key={method.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {method.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">{method.type.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {method.currency.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {method.fees.percentage}% + {method.fees.fixed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setEditingItem(method)
                              setShowCreateModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive('payment', method.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            {method.isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteItem('payment', method.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Admin Users</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="w-5 h-5 ml-2" />
                Add User
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.permissions.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setEditingItem(user)
                              setShowCreateModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive('user', user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            {user.isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteItem('user', user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">12,345</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">EGP 45,678</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">Active Streams</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                    <CogIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">API Calls</p>
                    <p className="text-2xl font-bold text-gray-900">1.2M</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue by Plan</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {pricingPlans.map((plan) => (
                      <div key={plan.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                        <span className="text-sm text-gray-600">EGP {(plan.price.monthly * 123).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Methods Usage</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{method.name}</span>
                        <span className="text-sm text-gray-600">{Math.floor(Math.random() * 1000) + 100} transactions</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit' : 'Create'} {activeTab === 'pricing' ? 'Pricing Plan' : activeTab === 'payments' ? 'Payment Method' : 'Admin User'}
              </h3>
              
              {/* Form content would go here - simplified for brevity */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-input"
                  defaultValue={editingItem?.name || ''}
                />
                <textarea
                  placeholder="Description"
                  className="form-input"
                  rows={3}
                  defaultValue={editingItem?.description || ''}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="form-input"
                  defaultValue={editingItem?.price?.monthly || ''}
                />
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingItem(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (activeTab === 'pricing') {
                      handleSavePricingPlan(editingItem || {})
                    } else if (activeTab === 'payments') {
                      handleSavePaymentMethod(editingItem || {})
                    }
                  }}
                  className="btn btn-primary"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
