import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import SuccessStories from './SuccessStories';
import { toast } from 'react-hot-toast';
import { getUserData, clearUserData } from '../utils/auth';

const Dashboard = () => {
    const [userType, setUserType] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const authData = getUserData();
            
            if (!authData.token || !authData.userId) {
                console.error('No token or user ID found');
                setIsLoading(false);
                return;
            }

            try {
                // First, just set the user type from authData
                setUserType(authData.userType);
                
                // Fetch full user data from the API
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': authData.token
                    }
                };
                
                console.log('Fetching current user data');
                const response = await axios.get('http://localhost:5000/api/users/me', config);
                console.log('User data response:', response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                
                // More detailed error logging for debugging
                if (error.response) {
                    console.error('Response error data:', error.response.data);
                    console.error('Response error status:', error.response.status);
                } 
                
                if (error.response && error.response.status === 401) {
                    // Handle invalid or expired token
                    clearUserData();
                    toast.error('Session expired. Please login again.');
                } else {
                    toast.error('Error loading dashboard data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const StartupDashboard = () => (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-violet-200 flex items-center justify-center border-2 border-violet-300 shadow-md">
                        <span className="text-3xl font-bold text-violet-700">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'S'}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Welcome, {userData?.name || 'Entrepreneur'}</h2>
                        <p className="text-gray-600">Manage your startup's financial journey with Arthankur</p>
                    </div>
                </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-700">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Funding Status</h2>
                    <p className="text-gray-600 mb-4">Track your funding applications and progress</p>
                    <a href="/funding" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Loan Applications</h2>
                    <p className="text-gray-600 mb-4">Monitor your loan applications status</p>
                    <a href="/loans" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Government Schemes</h2>
                    <p className="text-gray-600 mb-4">View eligible government schemes and benefits</p>
                    <a href="/government-schemes" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Financial Tools</h2>
                    <p className="text-gray-600 mb-4">Access calculators and financial planning tools</p>
                    <a href="/financial-tools" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Tax & Compliance</h2>
                    <p className="text-gray-600 mb-4">Stay updated with tax requirements and compliance</p>
                    <a href="/tax-compliance" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Community</h2>
                    <p className="text-gray-600 mb-4">Connect with fellow entrepreneurs and mentors</p>
                    <a href="/community" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                    <p className="text-gray-600 mb-4">View and update your profile information</p>
                    <a href="/profile" className="text-violet-600 hover:text-violet-800">View profile →</a>
                </div>
            </div>
        </div>
    );

    const InvestorDashboard = () => (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-violet-200 flex items-center justify-center border-2 border-violet-300 shadow-md">
                        <span className="text-3xl font-bold text-violet-700">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'I'}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Welcome, {userData?.name || 'Investor'}</h2>
                        <p className="text-gray-600">Discover promising startups and investment opportunities</p>
                    </div>
                </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-700">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Explore Startups</h2>
                    <p className="text-gray-600 mb-4">Browse through potential investment opportunities</p>
                    <a href="/explore-startups" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Virtual Pitch</h2>
                    <p className="text-gray-600 mb-4">Attend online pitch sessions from startups</p>
                    <a href="/virtual-pitch" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
                    <p className="text-gray-600 mb-4">Schedule and manage startup meetings</p>
                    <a href="/meetings" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Community</h2>
                    <p className="text-gray-600 mb-4">Connect with fellow investors and entrepreneurs</p>
                    <a href="/community" className="text-violet-600 hover:text-violet-800">View details →</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                    <p className="text-gray-600 mb-4">View and update your profile information</p>
                    <a href="/profile" className="text-violet-600 hover:text-violet-800">View profile →</a>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center h-[70vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                    {userType === 'startup' ? 'Startup Dashboard' : 'Investor Dashboard'}
                </h1>
                {userType === 'startup' ? <StartupDashboard /> : <InvestorDashboard />}
                
                {/* <SuccessStories /> */}
            </div>
        </div>
    );
};

export default Dashboard;