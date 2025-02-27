import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { getUserProfile, updateUserProfile } from '../services/api';
import Navbar from './Navbar';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        website: '',
        linkedin: '',
        twitter: '',
        skills: '',
        interests: ''
    });

    // Get user data from token and fetch profile from API
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            
            fetchUserProfile(userId);
        } catch (error) {
            console.error('Error decoding token:', error);
            toast.error('Authentication error. Please login again.');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const fetchUserProfile = async (userId) => {
        try {
            setLoading(true);
            const userData = await getUserProfile(userId);
            setUser(userData);
            
            // Initialize form data with user data
            setFormData({
                name: userData.name || '',
                bio: userData.bio || '',
                location: userData.location || '',
                website: userData.website || '',
                linkedin: userData.linkedin || '',
                twitter: userData.twitter || '',
                skills: userData.skills ? userData.skills.join(', ') : '',
                interests: userData.interests ? userData.interests.join(', ') : ''
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load profile data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !user) return;

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.userId;
            
            // Process arrays
            const updatedData = {
                ...formData,
                skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
                interests: formData.interests.split(',').map(interest => interest.trim()).filter(Boolean)
            };
            
            const updatedUser = await updateUserProfile(userId, updatedData);
            setUser(updatedUser);
            setEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-blue-700 p-6 text-white">
                        <h1 className="text-2xl font-bold">User Profile</h1>
                        <p className="text-blue-100">Manage your account information and settings</p>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        {editing ? (
                            /* Edit Profile Form */
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Twitter
                                        </label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Skills (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Interests (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="interests"
                                            value={formData.interests}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* Display Profile */
                            <div>
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-3xl text-blue-700">{user?.name?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                                            <p className="text-gray-600">{user?.email}</p>
                                            <p className="text-sm text-blue-600 uppercase">{user?.userType}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                                            
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Phone Number</span>
                                                    <p>{user?.phoneNumber || 'Not provided'}</p>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Location</span>
                                                    <p>{user?.location || 'Not provided'}</p>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Bio</span>
                                                    <p className="text-gray-700">{user?.bio || 'No bio provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Social & Professional</h3>
                                            
                                            <div className="space-y-3">
                                                {user?.website && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Website</span>
                                                        <p>
                                                            <a 
                                                                href={user.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {user.website}
                                                            </a>
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {user?.linkedin && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">LinkedIn</span>
                                                        <p>
                                                            <a 
                                                                href={user.linkedin} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {user.linkedin}
                                                            </a>
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                {user?.twitter && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-500">Twitter</span>
                                                        <p>
                                                            <a 
                                                                href={user.twitter} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {user.twitter}
                                                            </a>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Skills & Interests</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Skills</span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {user?.skills && user.skills.length > 0 ? (
                                                        user.skills.map((skill, index) => (
                                                            <span 
                                                                key={index} 
                                                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500">No skills listed</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Interests</span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {user?.interests && user.interests.length > 0 ? (
                                                        user.interests.map((interest, index) => (
                                                            <span 
                                                                key={index} 
                                                                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                                            >
                                                                {interest}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-500">No interests listed</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* User type specific information */}
                                    {user?.userType === 'startup' && (
                                        <div className="mt-6 border-t border-gray-200 pt-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Startup Details</h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Registration Number</span>
                                                    <p>{user?.registrationNumber || 'Not provided'}</p>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Industry</span>
                                                    <p>{user?.industry || 'Not specified'}</p>
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                    <span className="text-sm font-medium text-gray-500">About</span>
                                                    <p className="text-gray-700">{user?.about || 'No description provided'}</p>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Funding Requests</span>
                                                    <p>{user?.fundingRequests || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {user?.userType === 'investor' && (
                                        <div className="mt-6 border-t border-gray-200 pt-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-3">Investor Details</h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Investment Experience</span>
                                                    <p>{user?.investmentExperience || 'Not specified'}</p>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-sm font-medium text-gray-500">Investments Made</span>
                                                    <p>{user?.investments || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Member Since</span>
                                                <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                                                <p>{new Date(user?.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
