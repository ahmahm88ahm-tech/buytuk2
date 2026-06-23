'use client';

import { useState, useEffect } from 'react';
import { 
  StreamSession, 
  StreamingStatus, 
  StreamingPlatform,
  StreamAnalytics,
  StreamStats
} from '@socialboost/types';

interface StreamingDashboardProps {
  userId: string;
}

export default function StreamingDashboard({ userId }: StreamingDashboardProps) {
  const [sessions, setSessions] = useState<StreamSession[]>([]);
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<StreamSession | null>(null);

  useEffect(() => {
    fetchStreamData();
  }, [userId]);

  const fetchStreamData = async () => {
    try {
      setLoading(true);
      
      // Fetch stream sessions
      const sessionsResponse = await fetch(`/api/streaming/sessions/${userId}`);
      const sessionsData = await sessionsResponse.json();
      setSessions(sessionsData);

      // Fetch stream statistics
      const statsResponse = await fetch(`/api/streaming/stats/${userId}`);
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching stream data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: StreamingStatus): string => {
    switch (status) {
      case StreamingStatus.LIVE: return 'text-red-600 bg-red-100';
      case StreamingStatus.ENDED: return 'text-gray-600 bg-gray-100';
      case StreamingStatus.PREPARING: return 'text-yellow-600 bg-yellow-100';
      case StreamingStatus.ERROR: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: StreamingStatus): string => {
    switch (status) {
      case StreamingStatus.LIVE: return 'Live Now';
      case StreamingStatus.ENDED: return 'Ended';
      case StreamingStatus.PREPARING: return 'Preparing';
      case StreamingStatus.ERROR: return 'Error';
      default: return 'Idle';
    }
  };

  const getPlatformIcon = (platform: StreamingPlatform): string => {
    const icons = {
      [StreamingPlatform.FACEBOOK]: 'fab fa-facebook',
      [StreamingPlatform.INSTAGRAM]: 'fab fa-instagram',
      [StreamingPlatform.YOUTUBE]: 'fab fa-youtube',
      [StreamingPlatform.TIKTOK]: 'fab fa-tiktok',
      [StreamingPlatform.TWITCH]: 'fab fa-twitch',
      [StreamingPlatform.LINKEDIN]: 'fab fa-linkedin'
    };
    return icons[platform] || 'fas fa-video';
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Streams</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <i className="fas fa-video text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.totalViews)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <i className="fas fa-eye text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Viewers</p>
                <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.peakViewers)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <i className="fas fa-users text-purple-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.engagementRate.toFixed(1)}%</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <i className="fas fa-heart text-orange-600"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Performance */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.platformBreakdown).map(([platform, data]) => (
              <div key={platform} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <i className={`${getPlatformIcon(platform as StreamingPlatform)} text-lg`}></i>
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <span className="text-sm text-gray-600">{data.sessions} streams</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{formatNumber(data.views)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Viewers</span>
                    <span className="font-medium">{formatNumber(data.viewers)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{data.engagement.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Streams */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Streams</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stream
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platforms
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viewers
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.title}
                      </div>
                      {session.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {session.description}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 space-x-reverse">
                      {session.platforms.filter(p => p.isActive).map((platform) => (
                        <i
                          key={platform.platform}
                          className={`${getPlatformIcon(platform.platform)} text-gray-600`}
                          title={platform.platform}
                        ></i>
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.duration ? formatDuration(session.duration) : '-'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(session.viewerCount)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(session.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="text-blue-600 hover:text-blue-900 ml-2"
                    >
                      <i className="fas fa-chart-line"></i>
                    </button>
                    {session.status === StreamingStatus.LIVE && (
                      <button
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        <i className="fas fa-stop"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-video text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500">No streams yet</p>
              <p className="text-gray-400 text-sm">Start your first live stream to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Stream Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSession.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedSession.description}</p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <StreamAnalyticsDetails analytics={selectedSession.analytics} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StreamAnalyticsDetailsProps {
  analytics: StreamAnalytics;
}

function StreamAnalyticsDetails({ analytics }: StreamAnalyticsDetailsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(analytics.totalViews)}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Peak Viewers</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(analytics.peakViewers)}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Duration</p>
          <p className="text-xl font-bold text-gray-900">{Math.round(analytics.averageViewDuration)}s</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Engagement</p>
          <p className="text-xl font-bold text-gray-900">
            {((analytics.engagement.likes + analytics.engagement.comments + analytics.engagement.shares) / analytics.totalViews * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Engagement Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <i className="fas fa-heart text-blue-600 text-2xl mb-2"></i>
            <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.engagement.likes)}</p>
            <p className="text-sm text-gray-600">Likes</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <i className="fas fa-comment text-green-600 text-2xl mb-2"></i>
            <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.engagement.comments)}</p>
            <p className="text-sm text-gray-600">Comments</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <i className="fas fa-share text-purple-600 text-2xl mb-2"></i>
            <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.engagement.shares)}</p>
            <p className="text-sm text-gray-600">Shares</p>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Audience Demographics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Age Groups</p>
            <div className="space-y-2">
              {Object.entries(analytics.demographics.ageGroups).map(([age, percentage]) => (
                <div key={age} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{age}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Gender</p>
            <div className="space-y-2">
              {Object.entries(analytics.demographics.genders).map(([gender, percentage]) => (
                <div key={gender} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 capitalize">{gender}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Top Countries</p>
            <div className="space-y-2">
              {Object.entries(analytics.demographics.countries)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([country, viewers]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{country}</span>
                    <span className="text-sm text-gray-700">{formatNumber(viewers)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Real-time Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.realTime.currentViewers)}</p>
            <p className="text-sm text-gray-600">Current Viewers</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{(analytics.realTime.bandwidth / 1000).toFixed(1)} Mbps</p>
            <p className="text-sm text-gray-600">Bandwidth</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{analytics.realTime.droppedFrames}</p>
            <p className="text-sm text-gray-600">Dropped Frames</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{analytics.realTime.latency}ms</p>
            <p className="text-sm text-gray-600">Latency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
