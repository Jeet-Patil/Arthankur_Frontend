import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Presentation } from 'lucide-react';
import Navbar from './Navbar';
import { getVirtualPitchForMeeting } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        email: '',
        title: '',
        description: '',
        dateTime: '',
        duration: 30
    });

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    // Function to format date
    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, 'MMM dd, yyyy - h:mm a');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    useEffect(() => {
        if (!currentUserId) {
            console.log('No user ID found in localStorage');
            toast.error('User ID not found. Please log in again.');
            return;
        }
        console.log('Current user ID:', currentUserId);
        fetchMeetings();
        fetchUsers();
    }, [currentUserId]);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/meetings', axiosConfig);
            console.log('Fetched meetings:', response.data);
            setMeetings(response.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            toast.error('Failed to fetch meetings');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/meetings/users', axiosConfig);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/meetings', newMeeting, axiosConfig);
            setNewMeeting({
                email: '',
                title: '',
                description: '',
                dateTime: '',
                duration: 30
            });
            setShowScheduleForm(false);
            fetchMeetings();
            toast.success('Meeting request sent successfully');
        } catch (error) {
            console.error('Error scheduling meeting:', error);
            toast.error(error.response?.data?.message || 'Error scheduling meeting');
        }
    };

    const handleMeetingResponse = async (meetingId, status) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/meetings/${meetingId}/status`,
                { status },
                axiosConfig
            );
            fetchMeetings();
            toast.success(`Meeting ${status === 'accepted' ? 'accepted' : 'declined'} successfully`);
            } catch (error) {
            console.error('Error updating meeting status:', error);
            toast.error('Failed to update meeting status');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    // Get minimum date time for the date picker (current time)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    // Function to check if the current user can respond to the meeting
    const canRespondToMeeting = (meeting) => {
        console.log('Checking meeting response capability:', {
            meetingId: meeting._id,
            status: meeting.status,
            requestedToId: meeting.requestedTo._id,
            currentUserId,
            isMatch: meeting.requestedTo._id === currentUserId
        });
        return meeting.status === 'pending' && meeting.requestedTo._id === currentUserId;
    };

    // Function to check if the current user is involved in the meeting
    const getUserRole = (meeting) => {
        if (meeting.requestedBy._id === currentUserId) return 'sender';
        if (meeting.requestedTo._id === currentUserId) return 'receiver';
        return null;
    };

    const [isLoading, setIsLoading] = useState(false);

    const joinVirtualPitch = async (meetingId) => {
        try {
            console.log('Joining virtual pitch for meeting:', meetingId);
            setIsLoading(true);
            
            const virtualPitchInfo = await getVirtualPitchForMeeting(meetingId);
            console.log('Virtual pitch info received:', virtualPitchInfo);
            
            if (virtualPitchInfo && virtualPitchInfo.virtualPitchRoomId) {
                // Check if the virtualPitchRoomId is valid
                if (!virtualPitchInfo.virtualPitchRoomId.trim()) {
                    console.error('Empty virtual pitch room ID received');
                    toast.error('Invalid virtual pitch room. Please try refreshing the page or contact support.');
                    setIsLoading(false);
                    return;
                }
                
                toast.success('Connecting to virtual pitch room...');
                const virtualPitchRoomId = virtualPitchInfo.virtualPitchRoomId;
                
                // Save meeting ID to localStorage for reference
                localStorage.setItem('currentVirtualPitchMeetingId', meetingId);
                
                // Navigate to the virtual pitch page with the room ID
                navigate(`/virtual-pitch/${virtualPitchRoomId}`);
            } else {
                console.error('Missing or invalid virtual pitch info:', virtualPitchInfo);
                toast.error('Could not find virtual pitch room. The system will create one now.');
                
                // Try to refresh the meeting to generate a new room ID
                try {
                    const response = await axios.patch(
                        `http://localhost:5000/api/meetings/${meetingId}/refresh-virtual-pitch`,
                        {},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': localStorage.getItem('token')
                            }
                        }
                    );
                    
                    if (response.data && response.data.virtualPitchRoomId) {
                        toast.success('Virtual pitch room created. Connecting now...');
                        navigate(`/virtual-pitch/${response.data.virtualPitchRoomId}`);
                    } else {
                        toast.error('Could not create virtual pitch room. Please try again later.');
                    }
                } catch (refreshError) {
                    console.error('Error refreshing virtual pitch:', refreshError);
                    toast.error('Could not create virtual pitch room. Please try again later or contact support.');
                }
            }
            
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error joining virtual pitch:', error);
            toast.error('Failed to join virtual pitch. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Meetings</h1>
                    
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setShowScheduleForm(!showScheduleForm)}
                            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
                        >
                            {showScheduleForm ? 'Cancel' : 'Schedule Meeting'}
                        </button>
                    </div>

                    {showScheduleForm && (
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Schedule New Meeting</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select User
                                        </label>
                                        <select
                                            name="email"
                                            value={newMeeting.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        >
                                            <option value="">Select a user</option>
                                            {users.map(user => (
                                                <option key={user._id} value={user.email}>
                                                    {user.name} ({user.email}) - {user.userType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newMeeting.title}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={newMeeting.description}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                            rows="3"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="dateTime"
                                            value={newMeeting.dateTime}
                                            onChange={handleInputChange}
                                            min={getMinDateTime()}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                        <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={newMeeting.duration}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                            min="15"
                                            max="180"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
                                    >
                                        Schedule Meeting
                                    </button>
                            </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {meetings.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No meetings found. Schedule a new meeting to get started!
                            </div>
                        ) : (
                            meetings.map(meeting => {
                                const canRespond = canRespondToMeeting(meeting);
                                console.log(`Meeting ${meeting._id} can respond:`, canRespond);
                                
                                return (
                                    <div key={meeting._id} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold">{meeting.title}</h3>
                                                <p className="text-gray-600">{meeting.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {getUserRole(meeting) === 'sender' && (
                                                    <span className="text-sm text-gray-500">Awaiting response</span>
                                                )}
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(meeting.status)}`}>
                                                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Requested By</p>
                                                <p className="font-medium">{meeting.requestedBy.name}</p>
                                                <p className="text-sm text-gray-500">{meeting.requestedBy.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Requested To</p>
                                                <p className="font-medium">{meeting.requestedTo.name}</p>
                                                <p className="text-sm text-gray-500">{meeting.requestedTo.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Date & Time</p>
                                                <p className="font-medium">
                                                    {formatDateTime(meeting.dateTime)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Duration</p>
                                                <p className="font-medium">{meeting.duration} minutes</p>
                                            </div>
                                        </div>
                                        
                                        {meeting.status === 'accepted' && (
                                            <div className="mb-4 p-3 bg-violet-50 rounded-lg">
                                                <p className="text-sm font-medium text-violet-800 mb-2">Virtual Pitch Session</p>
                                                <button
                                                    onClick={() => joinVirtualPitch(meeting._id)}
                                                    className="w-full bg-white border border-violet-600 text-violet-600 px-4 py-2 rounded-lg hover:bg-violet-50 transition-colors duration-200 flex items-center justify-center"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-700 mr-2"></span>
                                                            Connecting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Presentation className="h-4 w-4 mr-2" />
                                                            Join Virtual Pitch
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {canRespond && (
                                            <div className="flex space-x-2 mt-4 pt-4 border-t">
                                                <button
                                                    onClick={() => handleMeetingResponse(meeting._id, 'accepted')}
                                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Accept Meeting
                                                </button>
                                                <button
                                                    onClick={() => handleMeetingResponse(meeting._id, 'declined')}
                                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Decline Meeting
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meetings;
