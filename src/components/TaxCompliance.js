import React from 'react';
import Navbar from './Navbar';

const TaxCompliance = () => {
    const upcomingDeadlines = [
        {
            id: 1,
            type: 'GST Filing',
            description: 'Monthly GSTR-3B return filing',
            deadline: 'March 20, 2025',
            icon: 'document'
        },
        {
            id: 2,
            type: 'TDS Return',
            description: 'Quarterly TDS return filing',
            deadline: 'March 31, 2025',
            icon: 'check'
        },
        {
            id: 3,
            type: 'Income Tax Advance Payment',
            description: 'Fourth installment of advance tax',
            deadline: 'April 15, 2025',
            icon: 'clock'
        }
    ];

    const quickActions = [
        {
            id: 1,
            title: 'File GST Return',
            icon: 'document'
        },
        {
            id: 2,
            title: 'Generate Tax Report',
            icon: 'chart'
        },
        {
            id: 3,
            title: 'View Compliance Calendar',
            icon: 'calendar'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userType="startup" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-8">
                    Tax & Compliance
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Deadlines Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-6">Upcoming Deadlines</h2>
                            <div className="space-y-4">
                                {upcomingDeadlines.map((deadline) => (
                                    <div key={deadline.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex items-start">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {deadline.type}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {deadline.description}
                                                </p>
                                                <p className="text-violet-600 font-medium mt-1">
                                                    {deadline.deadline}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.id}
                                        className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 py-3 px-4 rounded-lg text-left transition-colors duration-200"
                                    >
                                        {action.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxCompliance;