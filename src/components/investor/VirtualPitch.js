import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Function to get URL parameters
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr || '');
}

const VirtualPitch = () => {
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [meetingContainerRef, setMeetingContainerRef] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
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

    // Initialize meeting when component loads
    useEffect(() => {
        // Check if URL has a roomID parameter
        const params = getUrlParams();
        const urlRoomID = params.get("roomID");
        
        if (urlRoomID) {
            setRoomID(urlRoomID);
            setShowVideoCall(true);
        }
    }, []);

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
                        
                        {/* Scheduled Pitches */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Scheduled Pitch Sessions</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Example scheduled pitch sessions */}
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Startup Name {item}</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {item % 3 === 0 ? 'Technology' : item % 3 === 1 ? 'Healthcare' : 'Finance'} • 
                                                {item % 2 === 0 ? ' Seed Funding' : ' Series A'}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3">Brief description of the startup and what they're pitching.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    {item % 2 === 0 ? 'Tomorrow' : 'Today'}, {(item * 2) % 12 || 12}:00 {(item * 2) % 12 >= 6 ? 'PM' : 'AM'}
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
