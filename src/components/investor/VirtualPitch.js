import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Function to get URL parameters
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr || '');
}

const VirtualPitch = () => {
    const { roomId } = useParams(); // Get roomId from route params
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [meetingContainerRef, setMeetingContainerRef] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [userType, setUserType] = useState('');
    const [pitchTitle, setPitchTitle] = useState('');
    const [pitchDescription, setPitchDescription] = useState('');
    const [pitchDate, setPitchDate] = useState('');
    const [pitchTime, setPitchTime] = useState('');
    const [scheduledPitches, setScheduledPitches] = useState([]);
    const [myPitches, setMyPitches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
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

    // Get user data including user type on component mount
    useEffect(() => {
        // Get userType from localStorage or API
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUserType(userData.userType || '');
        
        // First check if we have a roomId from route params
        if (roomId) {
            setRoomID(roomId);
            setShowVideoCall(true);
        } else {
            // Otherwise check URL parameters
            const params = getUrlParams();
            const urlRoomID = params.get("roomID");
            
            if (urlRoomID) {
                setRoomID(urlRoomID);
                setShowVideoCall(true);
            }
        }

        // Fetch scheduled pitches
        fetchScheduledPitches();
        
        // If user is a startup, fetch their pitches too
        if (userData.userType === 'startup') {
            fetchMyPitches();
        }
    }, []);
    
    // Fetch scheduled pitches from API
    const fetchScheduledPitches = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            let url = 'http://localhost:9000/api/virtual-pitch';
            if (selectedIndustry) {
                url += `?industry=${selectedIndustry}`;
            }
            if (searchQuery) {
                url += `${selectedIndustry ? '&' : '?'}search=${searchQuery}`;
            }
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setScheduledPitches(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching scheduled pitches:', error);
            setError('Failed to load scheduled pitches');
            setIsLoading(false);
        }
    };
    
    // Fetch pitches created by the current user
    const fetchMyPitches = async () => {
        try {
            setIsLoading(true);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            const response = await axios.get('http://localhost:9000/api/virtual-pitch/my-pitches', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setMyPitches(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching my pitches:', error);
            setError('Failed to load your pitches');
            setIsLoading(false);
        }
    };

    // Join a virtual pitch via API
    const joinPitchViaAPI = async (pitchId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            const response = await axios.post(
                `http://localhost:9000/api/virtual-pitch/${pitchId}/join`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Get the roomId from the response and join
            if (response.data && response.data.roomId) {
                handleJoinRoom(response.data.roomId);
            }
        } catch (error) {
            console.error('Error joining pitch:', error);
            alert('Failed to join the pitch session');
        }
    };
    
    // Initialize ZegoCloud meeting
    useEffect(() => {
        if (showVideoCall && meetingContainerRef) {
            startMeeting();
        }
    }, [showVideoCall, meetingContainerRef]);

    // Start the ZegoCloud meeting
    const startMeeting = async () => {
        // Generate Kit Token
        const appID = 1445273174; // From .env
        const serverSecret = "c0a6503e0bfa49d5eac944cf2603ebf7"; // From .env
        const userID = randomID(5);
        const userName = "User_" + userID;
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            userID,
            userName
        );

        // Create instance object from Kit Token
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        
        // Start the call
        zp.joinRoom({
            container: meetingContainerRef,
            sharedLinks: [
                {
                    name: "Copy meeting link",
                    url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
            showScreenSharingButton: true,
            showTurnOffRemoteCameraButton: true,
            showTurnOffRemoteMicrophoneButton: true,
            showRemoveUserButton: true,
            showUserList: true,
            maxUsers: 50,
            layout: "Gallery", // Options: Gallery, Grid, Sidebar
            showLayoutButton: true,
            showPreJoinView: true,
            preJoinViewConfig: {
                title: "Arthankur Virtual Pitch Meeting",
            },
            branding: {
                logoURL: "https://your-logo-url.com", // Replace with your logo URL
            },
            showNonVideoUser: true,
            showTextChat: true,
            showAudioVideoSettingsButton: true,
        });
    };

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
        setShowVideoCall(false);
        // Refresh page to clean up resources
        window.location.href = window.location.pathname;
    };

    // Handler for creating a new pitch (only for startups)
    const handleCreatePitch = async () => {
        try {
            if (!pitchTitle || !pitchDescription || !selectedIndustry || !pitchDate || !pitchTime) {
                alert('Please fill in all fields');
                return;
            }
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            // Generate a room ID
            const newRoomID = randomID(8);
            
            // Combine date and time
            const scheduledDate = new Date(`${pitchDate}T${pitchTime}`);
            
            // Submit to API
            const response = await axios.post(
                'http://localhost:9000/api/virtual-pitch',
                {
                    title: pitchTitle,
                    description: pitchDescription,
                    industry: selectedIndustry,
                    roomId: newRoomID,
                    scheduledDate: scheduledDate.toISOString()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Reset form fields
            setPitchTitle('');
            setPitchDescription('');
            setPitchDate('');
            setPitchTime('');
            
            // Refresh my pitches
            fetchMyPitches();
            
            alert('Pitch session created successfully!');
        } catch (error) {
            console.error('Error creating pitch:', error);
            alert(`Failed to create pitch session: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {!showVideoCall ? (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Virtual Pitch Sessions</h1>
                        <p className="text-gray-600 mb-8">
                            {userType === 'investor' 
                                ? 'Join virtual pitch sessions from promising startups. Filter by industry, funding stage, and more.'
                                : 'Create and manage your pitch sessions for investors. Present your startup and attract funding.'}
                        </p>
                        
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <input 
                                    type="text" 
                                    placeholder="Search pitches by startup name, industry, etc."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div>
                                <select 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedIndustry}
                                    onChange={(e) => setSelectedIndustry(e.target.value)}
                                >
                                    <option value="">All Industries</option>
                                    <option value="tech">Technology</option>
                                    <option value="health">Healthcare</option>
                                    <option value="edu">Education</option>
                                    <option value="finance">Finance</option>
                                    <option value="ecommerce">E-Commerce</option>
                                    <option value="sustainability">Sustainability</option>
                                    <option value="agriculture">Agriculture</option>
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
                        
                        {/* Startup-specific: Create Pitch Form */}
                        {userType === 'startup' && (
                            <div className="bg-blue-50 p-6 rounded-lg mb-8">
                                <h2 className="text-xl font-semibold text-blue-800 mb-4">Create a New Pitch Session</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Pitch Title
                                        </label>
                                        <input
                                            type="text"
                                            value={pitchTitle}
                                            onChange={(e) => setPitchTitle(e.target.value)}
                                            placeholder="Enter pitch title"
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Industry
                                        </label>
                                        <select 
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={selectedIndustry}
                                            onChange={(e) => setSelectedIndustry(e.target.value)}
                                        >
                                            <option value="">Select Industry</option>
                                            <option value="tech">Technology</option>
                                            <option value="health">Healthcare</option>
                                            <option value="edu">Education</option>
                                            <option value="finance">Finance</option>
                                            <option value="ecommerce">E-Commerce</option>
                                            <option value="sustainability">Sustainability</option>
                                            <option value="agriculture">Agriculture</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Pitch Description
                                    </label>
                                    <textarea
                                        value={pitchDescription}
                                        onChange={(e) => setPitchDescription(e.target.value)}
                                        placeholder="Describe your pitch session"
                                        rows="3"
                                        className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={pitchDate}
                                            onChange={(e) => setPitchDate(e.target.value)}
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            value={pitchTime}
                                            onChange={(e) => setPitchTime(e.target.value)}
                                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <button
                                        onClick={handleCreatePitch}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Create Pitch Session
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Scheduled Pitches */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                {userType === 'investor' ? 'Scheduled Pitch Sessions' : 'Available Pitch Sessions'}
                            </h2>
                            
                            {isLoading ? (
                                <div className="text-center py-4">
                                    <p>Loading pitch sessions...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-4 text-red-600">
                                    <p>{error}</p>
                                </div>
                            ) : scheduledPitches.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    <p>No scheduled pitch sessions found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {scheduledPitches.map((pitch) => (
                                        <div key={pitch._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-800">{pitch.title}</h3>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {pitch.industry} • Created by: {pitch.createdBy?.name || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-gray-600 mb-3">{pitch.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        {new Date(pitch.scheduledDate).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => joinPitchViaAPI(pitch._id)}
                                                        className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                    >
                                                        Join Pitch
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* My Pitches (Only for startups) */}
                        {userType === 'startup' && (
                            <div className="mt-10">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Pitch Sessions</h2>
                                
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <p>Loading your pitch sessions...</p>
                                    </div>
                                ) : myPitches.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">
                                        <p>You haven't created any pitch sessions yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myPitches.map((pitch) => (
                                            <div key={pitch._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <div className="p-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">{pitch.title}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        {pitch.industry} • {new Date(pitch.scheduledDate).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-3">{pitch.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${pitch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {pitch.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleJoinRoom(pitch.roomId)}
                                                                className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                            >
                                                                Start Session
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-screen">
                    <div className="flex justify-end p-4 bg-white shadow-sm">
                        <button
                            onClick={handleExitCall}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Exit Meeting
                        </button>
                    </div>
                    <div 
                        className="flex-grow"
                        ref={setMeetingContainerRef}
                    />
                </div>
            )}
        </div>
    );
};

export default VirtualPitch;
