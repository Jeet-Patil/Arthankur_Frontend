import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../Navbar';

// Function to get URL parameters
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr || '');
}

const VirtualPitch = () => {
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [participants, setParticipants] = useState([]);
    
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const localStreamRef = useRef(null);
    
    // Function to generate random ID
    function randomID(len) {
        let result = "";
        const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
        const maxPos = chars.length;
        len = len || 5;
        for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return result;
    }

    // Handler for joining a room
    const handleJoinRoom = (specificRoomID = null) => {
        const newRoomID = specificRoomID || roomID || randomID(5);
        setRoomID(newRoomID);
        setShowVideoCall(true);
    };

    // Handler for creating a new room
    const handleCreateRoom = () => {
        const newRoomID = randomID(5);
        setRoomID(newRoomID);
        setShowVideoCall(true);
    };

    // Handler for exiting the video call
    const handleExitCall = () => {
        // Stop all media tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        setShowVideoCall(false);
    };
    
    // Toggle audio
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };
    
    // Toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
            }
        }
    };
    
    // Initialize local video
    useEffect(() => {
        if (showVideoCall && localVideoRef.current) {
            // Request user media
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    localVideoRef.current.srcObject = stream;
                    localStreamRef.current = stream;
                    
                    // Mock participants for demonstration
                    setParticipants([
                        { id: 'you', name: 'You (Host)', isLocal: true },
                        { id: 'participant1', name: 'John Doe', isLocal: false },
                        { id: 'participant2', name: 'Jane Smith', isLocal: false }
                    ]);
                })
                .catch(err => {
                    console.error('Error accessing media devices:', err);
                    alert('Failed to access camera and microphone. Please check permissions.');
                    setShowVideoCall(false);
                });
                
            // Cleanup when component unmounts or call ends
            return () => {
                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => track.stop());
                }
            };
        }
    }, [showVideoCall]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {!showVideoCall ? (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Virtual Pitch Sessions</h1>
                        <p className="text-gray-600 mb-8">
                            Join virtual pitch sessions from promising startups. Filter by industry, funding stage, and more.
                        </p>
                        
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <input 
                                    type="text" 
                                    placeholder="Search pitches by startup name, industry, etc."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">All Industries</option>
                                    <option value="tech">Technology</option>
                                    <option value="health">Healthcare</option>
                                    <option value="edu">Education</option>
                                    <option value="finance">Finance</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Video Call Join Section */}
                        <div className="bg-indigo-50 p-6 rounded-lg mb-8">
                            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Join or Start a Virtual Pitch Session</h2>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-indigo-700 mb-1">
                                        Enter Room ID to Join
                                    </label>
                                    <input
                                        type="text"
                                        value={roomID}
                                        onChange={(e) => setRoomID(e.target.value)}
                                        placeholder="Enter room ID"
                                        className="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={() => handleJoinRoom()}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={!roomID}
                                    >
                                        Join Room
                                    </button>
                                    <button
                                        onClick={handleCreateRoom}
                                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Create New Room
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Scheduled Pitches */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Pitch Sessions</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Example scheduled pitch sessions */}
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Startup Name {item}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Technology • Seed Funding</p>
                                            <p className="text-sm text-gray-600 mb-3">Brief description of the startup and what they're pitching.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    Tomorrow, 3:00 PM
                                                </span>
                                                <button
                                                    onClick={() => handleJoinRoom(`pitch-room-${item}`)}
                                                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                >
                                                    Join Pitch
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-screen bg-gray-900">
                    {/* Video Call Interface */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-auto">
                        {/* Local video */}
                        <div className="relative rounded-lg overflow-hidden bg-black">
                            <video 
                                ref={localVideoRef} 
                                autoPlay 
                                muted 
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                You (Host)
                            </div>
                        </div>
                        
                        {/* Placeholder remote videos for demo */}
                        <div className="relative rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-white text-3xl">
                                JD
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                John Doe
                            </div>
                        </div>
                        
                        <div className="relative rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-white text-3xl">
                                JS
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                Jane Smith
                            </div>
                        </div>
                    </div>
                    
                    {/* Call controls */}
                    <div className="h-16 bg-gray-800 flex items-center justify-center space-x-4 px-4">
                        <button 
                            onClick={toggleMute}
                            className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMuted ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                )}
                            </svg>
                        </button>
                        
                        <button 
                            onClick={toggleVideo}
                            className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-600'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={handleExitCall}
                            className="p-3 rounded-full bg-red-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m-4 4l2 2m0 0l2 2m-2-2l2-2" />
                            </svg>
                        </button>
                        
                        <button className="p-3 rounded-full bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        
                        <button className="p-3 rounded-full bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Share room ID */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                        <div className="text-sm mb-1">Room ID: <span className="font-bold">{roomID}</span></div>
                        <button 
                            className="text-xs bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-700 w-full"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
                                );
                                alert('Meeting link copied to clipboard!');
                            }}
                        >
                            Copy Meeting Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualPitch;
