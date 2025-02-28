import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead } from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const userType = localStorage.getItem('userType');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark notification as read
            await markNotificationAsRead(notification._id);
            
            // If it's a meeting notification, navigate to the meeting room
            if (notification.type === 'interest_accepted' && notification.relatedTo?.meetingId) {
                navigate(`/meeting/${notification.relatedTo.meetingId}`);
            }
            
            // Update notifications list
            setNotifications(notifications.map(n => 
                n._id === notification._id ? { ...n, read: true } : n
            ));

            // Close dropdown after clicking
            setShowDropdown(false);
        } catch (error) {
            console.error('Error handling notification:', error);
            toast.error('Failed to process notification');
        }
    };

    const viewAllMeetings = () => {
        navigate('/meetings');
        setShowDropdown(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const meetingNotifications = notifications.filter(n => n.type === 'interest_accepted');

    return (
        <div className="relative">
            <button 
                className="relative p-2 text-gray-600 hover:text-violet-600 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>

                    {meetingNotifications.length > 0 && (
                        <div className="p-4 border-b border-gray-100 bg-violet-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-violet-900">Meeting Requests</h4>
                                    <p className="text-sm text-violet-700">
                                        You have {meetingNotifications.length} meeting {meetingNotifications.length === 1 ? 'request' : 'requests'}
                                    </p>
                                </div>
                                <button
                                    onClick={viewAllMeetings}
                                    className="flex items-center text-violet-600 hover:text-violet-800"
                                >
                                    View All
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                        !notification.read ? 'bg-violet-50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start">
                                        {notification.type === 'interest_accepted' && (
                                            <div className="flex-shrink-0 mr-3">
                                                <Video className="h-5 w-5 text-violet-600" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-800">{notification.title}</p>
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications; 