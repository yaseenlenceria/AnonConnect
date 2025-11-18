'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SIGNALING_SERVER_URL = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL || 'http://localhost:3001';

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export type ConnectionState = 'idle' | 'searching' | 'connecting' | 'connected' | 'disconnected' | 'error' | 'feedback';
export type Message = {
  sender: 'me' | 'peer';
  text: string;
};

export function useAnonConnect() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [country, setCountry] = useState('global');

  const socket = useRef<Socket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  const cleanupConnection = useCallback(() => {
    console.log('Cleaning up connection...');
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    setRemoteStream(null);
    setMessages([]);
    dataChannel.current = null;
  }, []);
  
  const endCall = useCallback((nextState: ConnectionState = 'feedback') => {
    socket.current?.emit('leave-room');
    cleanupConnection();
    setConnectionState(nextState);
  }, [cleanupConnection]);

  const createPeerConnection = useCallback((peerId: string) => {
    cleanupConnection();
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('ice-candidate', { to: peerId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
    
    pc.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      setupDataChannel();
    };
    
    pc.onconnectionstatechange = () => {
        if(pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            endCall('feedback');
        }
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => pc.addTrack(track, localStream.current!));
    }

    peerConnection.current = pc;
    return pc;
  }, [cleanupConnection, endCall]);
  
  const setupDataChannel = useCallback(() => {
    if (dataChannel.current) {
      dataChannel.current.onmessage = (event) => {
        setMessages((prev) => [...prev, { sender: 'peer', text: event.data }]);
      };
      dataChannel.current.onopen = () => console.log('Data channel open');
      dataChannel.current.onclose = () => console.log('Data channel closed');
    }
  }, []);

  useEffect(() => {
    if (connectionState !== 'searching' && socket.current) {
        socket.current.disconnect();
        socket.current = null;
    }
    
    if (connectionState === 'searching') {
        const s = io(SIGNALING_SERVER_URL);
        socket.current = s;

        s.on('connect', async () => {
            console.log('Connected to signaling server');
            try {
                if (!localStream.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    localStream.current = stream;
                }
                s.emit('join-queue', { country });
            } catch (err) {
                console.error('Error getting media stream:', err);
                setConnectionState('error');
            }
        });

        s.on('matched', async ({ peerId, initiator }) => {
            console.log(`Matched with ${peerId}. Initiator: ${initiator}`);
            setConnectionState('connecting');
            const pc = createPeerConnection(peerId);
            
            if (initiator) {
                dataChannel.current = pc.createDataChannel('chat');
                setupDataChannel();
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                s.emit('offer', { to: peerId, offer });
            }
        });

        s.on('offer', async ({ from, offer }) => {
            const pc = peerConnection.current || createPeerConnection(from);
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            s.emit('answer', { to: from, answer });
            setConnectionState('connected');
        });

        s.on('answer', async ({ answer }) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                setConnectionState('connected');
            }
        });

        s.on('ice-candidate', async ({ candidate }) => {
            if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
        
        s.on('peer-disconnected', () => {
            endCall('feedback');
        });
        
        return () => {
            s.disconnect();
            cleanupConnection();
        };
    }
  }, [connectionState, country, createPeerConnection, cleanupConnection, setupDataChannel, endCall]);
  
  const startSearch = useCallback((selectedCountry: string) => {
    setCountry(selectedCountry);
    setConnectionState('searching');
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (dataChannel.current?.readyState === 'open') {
      dataChannel.current.send(text);
      setMessages((prev) => [...prev, { sender: 'me', text }]);
    }
  }, []);
  
  const next = useCallback(() => {
    endCall('searching');
  }, [endCall]);

  return {
    connectionState,
    messages,
    remoteStream,
    country,
    startSearch,
    endCall,
    sendMessage,
    next,
    setCountry,
    setConnectionState
  };
}
