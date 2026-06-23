'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { StreamingPlatform, StreamQuality } from '@socialboost/types';

interface RTMPStreamerProps {
  sessionId: string;
  streamKey: string;
  rtmpUrl: string;
  platforms: StreamingPlatform[];
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
  onError?: (error: Error) => void;
}

export default function RTMPStreamer({
  sessionId,
  streamKey,
  rtmpUrl,
  platforms,
  onStreamStart,
  onStreamEnd,
  onError,
}: RTMPStreamerProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [streamStats, setStreamStats] = useState({
    bitrate: 0,
    fps: 0,
    droppedFrames: 0,
    bandwidth: 0,
    latency: 0,
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeStream = useCallback(async () => {
    try {
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Create RTCPeerConnection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Create data channel for control messages
      const dataChannel = peerConnection.createDataChannel('control');
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        console.log('Data channel opened');
        sendControlMessage({ type: 'init', sessionId, platforms });
      };

      dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleControlMessage(message);
      };

      // Handle connection events
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        setIsConnected(peerConnection.iceConnectionState === 'connected');
      };

      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsStreaming(true);
          onStreamStart?.();
          startStatsCollection();
        } else if (peerConnection.connectionState === 'disconnected') {
          setIsStreaming(false);
          setIsConnected(false);
          onStreamEnd?.();
          stopStatsCollection();
        }
      };

      peerConnection.onerror = (error) => {
        console.error('Peer connection error:', error);
        onError?.(new Error('Connection error'));
      };

    } catch (error) {
      console.error('Error initializing stream:', error);
      onError?.(error as Error);
    }
  }, [sessionId, platforms, onStreamStart, onStreamEnd, onError]);

  const sendControlMessage = useCallback((message: any) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify(message));
    }
  }, []);

  const handleControlMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'stats':
        setStreamStats(message.data);
        break;
      case 'error':
        onError?.(new Error(message.data));
        break;
      default:
        console.log('Received message:', message);
    }
  }, [onError]);

  const startStatsCollection = useCallback(() => {
    statsIntervalRef.current = setInterval(async () => {
      if (peerConnectionRef.current) {
        try {
          const stats = await peerConnectionRef.current.getStats();
          let bitrate = 0;
          let fps = 0;
          let droppedFrames = 0;
          let bandwidth = 0;
          let latency = 0;

          stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.kind === 'video') {
              bitrate = report.bitrate || 0;
              fps = report.framesPerSecond || 0;
              droppedFrames = report.packetsLost || 0;
            }
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
              bandwidth = report.availableOutgoingBitrate || 0;
              latency = report.roundTripTime || 0;
            }
          });

          setStreamStats({
            bitrate: Math.round(bitrate / 1000), // Convert to kbps
            fps,
            droppedFrames,
            bandwidth: Math.round(bandwidth / 1000), // Convert to kbps
            latency: Math.round(latency * 1000), // Convert to ms
          });

          // Send stats to server
          sendControlMessage({
            type: 'stats',
            data: {
              sessionId,
              platforms,
              metrics: {
                bitrate: Math.round(bitrate / 1000),
                fps,
                droppedFrames,
                bandwidth: Math.round(bandwidth / 1000),
                latency: Math.round(latency * 1000),
              },
            },
          });
        } catch (error) {
          console.error('Error getting stats:', error);
        }
      }
    }, 5000); // Every 5 seconds
  }, [sessionId, platforms, sendControlMessage]);

  const stopStatsCollection = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  const startStreaming = useCallback(async () => {
    if (!isConnected) {
      await initializeStream();
    }
  }, [isConnected, initializeStream]);

  const stopStreaming = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    stopStatsCollection();
    setIsStreaming(false);
    setIsConnected(false);
  }, [stopStatsCollection]);

  const switchCamera = useCallback(async () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const currentFacingMode = videoTrack.getSettings().facingMode;
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: newFacingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 },
            },
            audio: true,
          });

          const newVideoTrack = newStream.getVideoTracks()[0];
          
          if (peerConnectionRef.current) {
            const sender = peerConnectionRef.current.getSenders().find(
              (sender) => sender.track?.kind === 'video'
            );
            
            if (sender) {
              await sender.replaceTrack(newVideoTrack);
            }
          }

          // Stop old track
          videoTrack.stop();
          
          // Update stream reference
          mediaStreamRef.current = newStream;

          sendControlMessage({
            type: 'camera_switched',
            data: { facingMode: newFacingMode },
          });
        } catch (error) {
          console.error('Error switching camera:', error);
          onError?.(error as Error);
        }
      }
    }
  }, [sendControlMessage, onError]);

  const toggleAudio = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        
        sendControlMessage({
          type: 'audio_toggled',
          data: { enabled: audioTrack.enabled },
        });
      }
    }
  }, [sendControlMessage]);

  const updateQuality = useCallback((quality: StreamQuality) => {
    const qualitySettings = {
      [StreamQuality.LOW]: { width: 640, height: 360, bitrate: 1000 },
      [StreamQuality.MEDIUM]: { width: 1280, height: 720, bitrate: 2500 },
      [StreamQuality.HIGH]: { width: 1920, height: 1080, bitrate: 5000 },
      [StreamQuality.ULTRA]: { width: 3840, height: 2160, bitrate: 15000 },
    };

    const settings = qualitySettings[quality];
    
    sendControlMessage({
      type: 'quality_changed',
      data: { quality, settings },
    });
  }, [sendControlMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Stream Control</h3>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className={`flex items-center space-x-2 space-x-reverse ${
            isConnected ? 'text-green-600' : 'text-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className={`flex items-center space-x-2 space-x-reverse ${
            isStreaming ? 'text-red-600' : 'text-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isStreaming ? 'bg-red-500' : 'bg-gray-400'
            } ${isStreaming ? 'animate-pulse' : ''}`}></div>
            <span className="text-sm font-medium">
              {isStreaming ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Stream Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Bitrate</p>
          <p className="text-sm font-semibold">{streamStats.bitrate} kbps</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">FPS</p>
          <p className="text-sm font-semibold">{streamStats.fps}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Dropped Frames</p>
          <p className="text-sm font-semibold">{streamStats.droppedFrames}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Bandwidth</p>
          <p className="text-sm font-semibold">{streamStats.bandwidth} kbps</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Latency</p>
          <p className="text-sm font-semibold">{streamStats.latency} ms</p>
        </div>
      </div>

      {/* Platform Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Status</h4>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2 space-x-reverse">
                <i className={`fab fa-${platform} text-sm`}></i>
                <span className="text-sm font-medium capitalize">{platform}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Connected</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-4">
        <div className="flex justify-center space-x-4 space-x-reverse">
          {!isStreaming ? (
            <button
              onClick={startStreaming}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <i className="fas fa-play ml-2"></i>
              Start Streaming
            </button>
          ) : (
            <button
              onClick={stopStreaming}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
            >
              <i className="fas fa-stop ml-2"></i>
              Stop Streaming
            </button>
          )}
        </div>

        {isStreaming && (
          <div className="flex justify-center space-x-3 space-x-reverse">
            <button
              onClick={switchCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <i className="fas fa-sync-alt ml-2"></i>
              Switch Camera
            </button>
            
            <button
              onClick={toggleAudio}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <i className="fas fa-microphone ml-2"></i>
              Toggle Audio
            </button>
            
            <select
              onChange={(e) => updateQuality(e.target.value as StreamQuality)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value={StreamQuality.LOW}>360p</option>
              <option value={StreamQuality.MEDIUM}>720p</option>
              <option value={StreamQuality.HIGH}>1080p</option>
              <option value={StreamQuality.ULTRA}>4K</option>
            </select>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Stream Information</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <p><strong>Session ID:</strong> {sessionId}</p>
          <p><strong>Stream Key:</strong> {streamKey}</p>
          <p><strong>RTMP URL:</strong> {rtmpUrl}</p>
          <p><strong>Platforms:</strong> {platforms.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
