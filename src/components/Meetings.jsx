import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video, Clock, Building2, DollarSign, Briefcase, PresentationScreen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getNotifications, getFundingRequestById, getVirtualPitchForMeeting, getMeetings } from '../services/api';
import Navbar from './Navbar';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            
            // Method 1: Get meetings directly from the API
            const meetingsData = await getMeetings();
            console.log('Meetings data:', meetingsData);
            setMeetings(meetingsData);
            
            // Method 2: If that doesn't work, fall back to the original implementation
            if (!meetingsData || meetingsData.length === 0) {
                const notifications = await getNotifications();
                
                // Filter only interest_accepted notifications
                const acceptedNotifications = notifications.filter(
                    notification => notification.type === 'interest_accepted'
                );

                // Fetch full funding details for each notification
                const meetingsWithDetails = await Promise.all(
                    acceptedNotifications.map(async (notification) => {
                        try {
                            const fundingDetails = await getFundingRequestById(notification.relatedTo.fundingId);
                            // Find the relevant interest in the funding request
                            const interest = fundingDetails.interests.find(
                                int => int.meetingRoomId === notification.relatedTo.meetingId
                            );
                            return {
                                ...notification,
                                fundingDetails,
                                meetingDetails: interest?.meetingDetails || {}
                            };
                        } catch (error) {
                            console.error('Error fetching funding details:', error);
                            return notification;
                        }
                    })
                );

                setMeetings(meetingsWithDetails);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            toast.error('Failed to load meetings');
            setLoading(false);
        }
    };

    const joinMeeting = (meetingId) => {
        navigate(`/meeting/${meetingId}`);
    };

    const joinVirtualPitch = async (meetingId) => {
        try {
            console.log('Joining virtual pitch for meeting:', meetingId);
            const virtualPitchInfo = await getVirtualPitchForMeeting(meetingId);
            console.log('Virtual pitch info:', virtualPitchInfo);
            
            if (virtualPitchInfo && virtualPitchInfo.virtualPitchRoomId) {
                navigate(`/virtual-pitch/${virtualPitchInfo.virtualPitchRoomId}`);
            } else {
                toast.error('Virtual pitch room not found');
            }
        } catch (error) {
            console.error('Error joining virtual pitch:', error);
            toast.error('Failed to join virtual pitch');
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Determine which data structure we're working with
    const isDirectMeetingsAPI = meetings && meetings.length > 0 && meetings[0].hasOwnProperty('requestedBy');

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">My Meetings</h1>
                    </div>

                    {meetings.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <div className="flex flex-col items-center">
                                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Meetings Yet</h3>
                                <p className="text-gray-500">
                                    {userType === 'investor' 
                                        ? 'You have no accepted funding interests yet.'
                                        : 'You haven\'t accepted any investor interests yet.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {meetings.map((meeting) => {
                                // Handle different data structures
                                const meetingId = isDirectMeetingsAPI ? meeting._id : meeting.relatedTo?.meetingId;
                                const title = isDirectMeetingsAPI ? meeting.title : (meeting.meetingDetails?.title || 'Meeting');
                                const startupName = isDirectMeetingsAPI 
                                    ? (meeting.requestedBy.userType === 'startup' ? meeting.requestedBy.name : meeting.requestedTo.name)
                                    : meeting.meetingDetails?.startupName;
                                const fundingType = isDirectMeetingsAPI ? 'N/A' : (meeting.meetingDetails?.fundingType || 'N/A');
                                const amount = isDirectMeetingsAPI ? 0 : (meeting.meetingDetails?.amount || 0);
                                const status = isDirectMeetingsAPI ? meeting.status : (meeting.read ? 'read' : 'unread');
                                
                                return (
                                    <div 
                                        key={meetingId || meeting._id} 
                                        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <Video className="h-5 w-5 text-violet-600 mr-2" />
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {title}
                                                    </h3>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    status === 'accepted' || status === 'read'
                                                        ? 'bg-green-100 text-green-800' 
                                                        : status === 'pending' 
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {status === 'read' ? 'Joined' : status.charAt(0).toUpperCase() + status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-start">
                                                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Startup</p>
                                                        <p className="font-medium text-gray-900">
                                                            {startupName || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {!isDirectMeetingsAPI && (
                                                    <>
                                                        <div className="flex items-start">
                                                            <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Funding Type</p>
                                                                <p className="font-medium text-gray-900 capitalize">
                                                                    {fundingType}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                                                            <div>
                                                                <p className="text-sm text-gray-500">Amount</p>
                                                                <p className="font-medium text-gray-900">
                                                                    {formatAmount(amount)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {isDirectMeetingsAPI && (
                                                    <div className="flex items-start">
                                                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Scheduled For</p>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(meeting.dateTime).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {new Date(meeting.createdAt).toLocaleDateString()}
                                            </div>

                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() => joinMeeting(meetingId || meeting._id)}
                                                    className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors duration-200"
                                                >
                                                    Join Meeting Room
                                                </button>
                                                
                                                <button
                                                    onClick={() => joinVirtualPitch(meetingId || meeting._id)}
                                                    className="w-full bg-white border border-violet-600 text-violet-600 py-2 px-4 rounded-lg hover:bg-violet-50 transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <PresentationScreen className="h-4 w-4 mr-2" />
                                                    Virtual Pitch
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meetings;