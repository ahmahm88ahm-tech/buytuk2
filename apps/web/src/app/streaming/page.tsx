'use client';

import { useState } from 'react';
import LiveStreamManager from '@/components/streaming/LiveStreamManager';
import StreamingDashboard from '@/components/streaming/StreamingDashboard';

export default function StreamingPage() {
  const [activeTab, setActiveTab] = useState<'studio' | 'dashboard' | 'analytics'>('studio');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Streaming Studio</h1>
              <p className="text-gray-600 mt-1">Stream live to multiple platforms simultaneously</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 space-x-reverse" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('studio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'studio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-video ml-2"></i>
              Streaming Studio
            </button>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-line ml-2"></i>
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-analytics ml-2"></i>
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'studio' && (
          <div>
            <LiveStreamManager />
            
            {/* Quick Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                <i className="fas fa-lightbulb ml-2"></i>
                Quick Tips for Successful Streaming
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <i className="fas fa-wifi text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Stable Internet</h4>
                    <p className="text-blue-700 text-sm">Ensure you have at least 5 Mbps upload speed for HD streaming</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <i className="fas fa-microphone text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Clear Audio</h4>
                    <p className="text-blue-700 text-sm">Use a good microphone and minimize background noise</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <i className="fas fa-light text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Good Lighting</h4>
                    <p className="text-blue-700 text-sm">Position yourself facing a light source for better video quality</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <i className="fas fa-users text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Engage Audience</h4>
                    <p className="text-blue-700 text-sm">Respond to comments and interact with viewers in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <StreamingDashboard userId="current-user-id" />
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Streaming Analytics</h2>
              
              {/* Date Range Selector */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2 space-x-reverse">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    Today
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                    This Week
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                    This Month
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
                    This Year
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              {/* Analytics Charts Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewer Growth</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <i className="fas fa-chart-line text-4xl mb-2"></i>
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Comparison</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <i className="fas fa-chart-bar text-4xl mb-2"></i>
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Performing Streams */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Streams</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {rank}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stream Title {rank}</h4>
                        <p className="text-sm text-gray-600">Stream description here</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">12.5K viewers</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
