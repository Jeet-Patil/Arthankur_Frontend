import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';

const Dashboard = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserType(decoded.userType);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const StartupDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Funding Status</h2>
                <p className="text-gray-600">Track your funding applications and progress</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Loan Applications</h2>
                <p className="text-gray-600">Monitor your loan applications status</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Government Schemes</h2>
                <p className="text-gray-600">View eligible government schemes and benefits</p>
            </div>
        </div>
    );

    const InvestorDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Investment Opportunities</h2>
                <p className="text-gray-600">View and analyze potential investment opportunities</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
                <p className="text-gray-600">Track your current investments and returns</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
                <p className="text-gray-600">Schedule and manage startup meetings</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                    {userType === 'startup' ? 'Startup Dashboard' : 'Investor Dashboard'}
                </h1>
                {userType === 'startup' ? <StartupDashboard /> : <InvestorDashboard />}
            </div>
        </div>
    );
};

export default Dashboard; 