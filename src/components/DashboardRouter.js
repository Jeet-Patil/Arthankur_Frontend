import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';

const DashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add other dashboard routes as needed */}
        </Routes>
    );
};

export default DashboardRouter; 