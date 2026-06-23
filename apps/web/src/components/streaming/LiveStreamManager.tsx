'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StreamingStatus, 
  StreamingPlatform, 
  StreamSession, 
  StreamSettings,
  StreamQuality,
  CameraSettings,
  AudioSettings,
  VideoSettings
} from '@socialboost/types';

interface LiveStreamManagerProps {
  onStreamStart?: (sessionId: string) => void;
  onStreamEnd?: (sessionId: string) => void;
  onPlatformConnected?: (platform: StreamingPlatform) => void;
  onPlatformDisconnected?: (platform: StreamingPlatform) => void;
}

export default function LiveStreamManager({
  onStreamStart,
  onStreamEnd,
  onPlatformConnected,
  onPlatformDisconnected
}: LiveStreamManagerProps) {
  const [streamStatus, setStreamStatus] = useState<StreamingStatus>(StreamingStatus.IDLE);
  const [selectedPlatforms, setSelectedPlatforms] = useState<StreamingPlatform[]>([]);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [streamQuality, setStreamQuality] = useState<StreamQuality>(StreamQuality.HIGH);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);

  const platforms = [
    { id: StreamingPlatform.FACEBOOK, name: 'Facebook', icon: 'fab fa-facebook', color: 'blue' },
    { id: StreamingPlatform.INSTAGRAM, name: 'Instagram', icon: 'fab fa-instagram', color: 'pink' },
    { id: StreamingPlatform.YOUTUBE, name: 'YouTube', icon: 'fab fa-youtube', color: 'red' },
    { id: StreamingPlatform.TIKTOK, name: 'TikTok', icon: 'fab fa-tiktok', color: 'black' },
    { id: StreamingPlatform.TWITCH, name: 'Twitch', icon: 'fab fa-twitch', color: 'purple' },
    { id: StreamingPlatform.LINKEDIN, name: 'LinkedIn', icon: 'fab fa-linkedin', color: 'blue' }
  ];

  // Camera and microphone management
  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCameraEnabled(true);
      setIsMicrophoneEnabled(true);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Failed to access camera or microphone. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraEnabled(false);
    setIsMicrophoneEnabled(false);
  }, []);

  // Platform selection
  const togglePlatform = useCallback((platform: StreamingPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }, []);

  // Stream management
  const startStream = useCallback(async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to stream to.');
      return;
    }

    if (!streamTitle.trim()) {
      alert('Please enter a stream title.');
      return;
    }

    if (!isCameraEnabled) {
      await startCamera();
    }

    setStreamStatus(StreamingStatus.PREPARING);

    try {
      // Create stream session
      const streamSettings: Partial<StreamSettings> = {
        camera: {
          deviceId: mediaStreamRef.current?.getVideoTracks()[0]?.getSettings().deviceId,
          resolution: `${streamQuality}`,
          frameRate: 30,
          facingMode: 'user',
          constraints: {}
        },
        audio: {
          enabled: isMicrophoneEnabled,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          volume: 1.0
        },
        video: {
          quality: streamQuality,
          bitrate: getBitrateForQuality(streamQuality),
          keyframeInterval: 2,
          aspectRatio: '16:9',
          filters: []
        },
        privacy: {
          visibility: 'public',
          allowComments: true,
          allowDuet: true,
          allowStitch: true,
          ageRestriction: false
        },
        scheduling: {
          isScheduled: false,
          autoStart: false
        }
      };

      const response = await fetch('/api/streaming/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: streamTitle,
          description: streamDescription,
          platforms: selectedPlatforms,
          settings: streamSettings
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const streamData = await response.json();
      
      // Initialize WebSocket for real-time updates
      initializeWebSocket(streamData.sessionId);
      
      setStreamStatus(StreamingStatus.LIVE);
      onStreamStart?.(streamData.sessionId);
      
      // Start duration counter
      startDurationCounter();
      
      // Notify platforms
      selectedPlatforms.forEach(platform => {
        onPlatformConnected?.(platform);
      });

    } catch (error) {
      console.error('Error starting stream:', error);
      setStreamStatus(StreamingStatus.ERROR);
      alert('Failed to start stream. Please try again.');
    }
  }, [selectedPlatforms, streamTitle, streamDescription, isCameraEnabled, isMicrophoneEnabled, streamQuality, onStreamStart, onPlatformConnected]);

  const stopStream = useCallback(async () => {
    setStreamStatus(StreamingStatus.ENDED);
    
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }

    try {
      await fetch('/api/streaming/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: 'current-session' })
      });
    } catch (error) {
      console.error('Error stopping stream:', error);
    }

    selectedPlatforms.forEach(platform => {
      onPlatformDisconnected?.(platform);
    });

    onStreamEnd?.('current-session');
    
    // Reset state
    setTimeout(() => {
      setStreamStatus(StreamingStatus.IDLE);
      setStreamDuration(0);
      setViewerCount(0);
    }, 2000);
  }, [selectedPlatforms, onStreamEnd, onPlatformDisconnected]);

  const initializeWebSocket = (sessionId: string) => {
    const ws = new WebSocket(`ws://localhost:3001/streaming/ws/${sessionId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected for stream updates');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'viewer_count':
          setViewerCount(data.count);
          break;
        case 'platform_status':
          // Update platform connection status
          break;
        case 'error':
          console.error('Stream error:', data.message);
          break;
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    webSocketRef.current = ws;
  };

  const startDurationCounter = () => {
    const startTime = Date.now();
    
    streamIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setStreamDuration(elapsed);
    }, 1000);
  };

  const getBitrateForQuality = (quality: StreamQuality): number => {
    switch (quality) {
      case StreamQuality.LOW: return 1000; // 1 Mbps
      case StreamQuality.MEDIUM: return 2500; // 2.5 Mbps
      case StreamQuality.HIGH: return 5000; // 5 Mbps
      case StreamQuality.ULTRA: return 15000; // 15 Mbps
      default: return 2500;
    }
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

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Streaming Studio</h2>
        <p className="text-gray-600">Stream live to multiple platforms simultaneously</p>
      </div>

      {/* Video Preview */}
      <div className="mb-6">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Stream Overlay */}
          {streamStatus === StreamingStatus.LIVE && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 space-x-reverse">
              <div className="bg-red-600 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                LIVE
              </div>
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {formatDuration(streamDuration)}
              </div>
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {formatViewerCount(viewerCount)} viewers
              </div>
            </div>
          )}

          {/* Camera Controls */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setIsCameraEnabled(!isCameraEnabled)}
              className={`p-3 rounded-full ${
                isCameraEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}
            >
              <i className={`fas ${isCameraEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
            </button>
            <button
              onClick={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}
              className={`p-3 rounded-full ${
                isMicrophoneEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}
            >
              <i className={`fas ${isMicrophoneEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Stream Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stream Title
          </label>
          <input
            type="text"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            placeholder="Enter your stream title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={streamStatus === StreamingStatus.LIVE}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stream Quality
          </label>
          <select
            value={streamQuality}
            onChange={(e) => setStreamQuality(e.target.value as StreamQuality)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={streamStatus === StreamingStatus.LIVE}
          >
            <option value={StreamQuality.LOW}>360p (Low)</option>
            <option value={StreamQuality.MEDIUM}>720p (Medium)</option>
            <option value={StreamQuality.HIGH}>1080p (High)</option>
            <option value={StreamQuality.ULTRA}>4K (Ultra)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={streamDescription}
            onChange={(e) => setStreamDescription(e.target.value)}
            placeholder="Describe your stream..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={streamStatus === StreamingStatus.LIVE}
          />
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Platforms to Stream To
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              disabled={streamStatus === StreamingStatus.LIVE}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${streamStatus === StreamingStatus.LIVE ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <i className={`${platform.icon} text-xl`} style={{ color: platform.color }}></i>
                <span className="font-medium">{platform.name}</span>
                {selectedPlatforms.includes(platform.id) && (
                  <i className="fas fa-check-circle text-green-500"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stream Controls */}
      <div className="flex justify-center space-x-4 space-x-reverse">
        {streamStatus === StreamingStatus.IDLE && (
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-video ml-2"></i>
            Enable Camera
          </button>
        )}
        
        {streamStatus === StreamingStatus.IDLE && isCameraEnabled && (
          <button
            onClick={startStream}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <i className="fas fa-broadcast-tower ml-2"></i>
            Start Live Stream
          </button>
        )}
        
        {streamStatus === StreamingStatus.PREPARING && (
          <button
            disabled
            className="px-8 py-3 bg-yellow-600 text-white rounded-lg font-semibold"
          >
            <i className="fas fa-spinner fa-spin ml-2"></i>
            Preparing Stream...
          </button>
        )}
        
        {streamStatus === StreamingStatus.LIVE && (
          <button
            onClick={stopStream}
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          >
            <i className="fas fa-stop ml-2"></i>
            End Stream
          </button>
        )}
        
        {streamStatus === StreamingStatus.ERROR && (
          <button
            onClick={() => setStreamStatus(StreamingStatus.IDLE)}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <i className="fas fa-redo ml-2"></i>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
