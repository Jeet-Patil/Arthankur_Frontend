import React from 'react';
import Navbar from './Navbar';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                {/* Add your dashboard content here */}
            </div>
        </div>
    );
};

export default Dashboard; 