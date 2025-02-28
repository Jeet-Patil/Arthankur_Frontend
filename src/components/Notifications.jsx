import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Video, ArrowRight, Calendar, DollarSign, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead } from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
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
            await markNotificationAsRead(notification._id);
            
            if (notification.type === 'interest_accepted' && notification.relatedTo?.meetingId) {
                navigate(`/meeting/${notification.relatedTo.meetingId}`);
            }
            
            setNotifications(notifications.map(n => 
                n._id === notification._id ? { ...n, read: true } : n
            ));
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

    const getFilteredNotifications = () => {
        switch (activeTab) {
            case 'meetings':
                return notifications.filter(n => n.type === 'interest_accepted');
            case 'unread':
                return notifications.filter(n => !n.read);
            default:
                return notifications;
        }
    };

    const getCategoryCount = (category) => {
        switch (category) {
            case 'meetings':
                return notifications.filter(n => n.type === 'interest_accepted').length;
            case 'unread':
                return notifications.filter(n => !n.read).length;
            default:
                return notifications.length;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'interest_accepted':
                return <Video className="h-5 w-5 text-violet-600" />;
            default:
                return <Info className="h-5 w-5 text-violet-600" />;
        }
    };

    return (
        <div className="relative">
            <button 
                className="relative p-2 text-gray-600 hover:text-violet-600 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <Bell className="h-6 w-6" />
                {getCategoryCount('unread') > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {getCategoryCount('unread')}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>

                    <div className="border-b border-gray-100">
                        <div className="flex">
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-medium ${
                                    activeTab === 'all' 
                                    ? 'text-violet-600 border-b-2 border-violet-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('all')}
                            >
                                All
                                {getCategoryCount('all') > 0 && (
                                    <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                        {getCategoryCount('all')}
                                    </span>
                                )}
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-medium ${
                                    activeTab === 'meetings' 
                                    ? 'text-violet-600 border-b-2 border-violet-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('meetings')}
                            >
                                Meetings
                                {getCategoryCount('meetings') > 0 && (
                                    <span className="ml-2 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs">
                                        {getCategoryCount('meetings')}
                                    </span>
                                )}
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 text-sm font-medium ${
                                    activeTab === 'unread' 
                                    ? 'text-violet-600 border-b-2 border-violet-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('unread')}
                            >
                                Unread
                                {getCategoryCount('unread') > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                                        {getCategoryCount('unread')}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'meetings' && getCategoryCount('meetings') > 0 && (
                        <div className="p-4 border-b border-gray-100 bg-violet-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-violet-900">Meeting Requests</h4>
                                    <p className="text-sm text-violet-700">
                                        You have {getCategoryCount('meetings')} meeting {getCategoryCount('meetings') === 1 ? 'request' : 'requests'}
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
                        {getFilteredNotifications().length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications in this category
                            </div>
                        ) : (
                            getFilteredNotifications().map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                        !notification.read ? 'bg-violet-50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{notification.title}</p>
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="ml-2 w-2 h-2 bg-violet-600 rounded-full"></span>
                                        )}
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