import React from 'react';
import Navbar from '../Navbar';

const VirtualPitch = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Virtual Pitch Sessions</h1>
                    <p className="text-gray-600 mb-8">
                        Join virtual pitch sessions from promising startups. Filter by industry, funding stage, and more.
                    </p>
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <input 
                                type="text" 
                                placeholder="Search pitches by startup name, industry, etc."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value="">All Industries</option>
                                <option value="fintech">FinTech</option>
                                <option value="healthtech">HealthTech</option>
                                <option value="edtech">EdTech</option>
                                <option value="ai">AI & ML</option>
                                <option value="ecommerce">E-Commerce</option>
                            </select>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-4">Upcoming Pitch Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img 
                                    src="https://via.placeholder.com/400x200" 
                                    alt="Startup Pitch" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Live on June 20
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">HealthTech Revolution</h3>
                                <p className="text-sm text-gray-600 mb-3">Healthcare AI solutions for early disease detection</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">HealthTech</span>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img 
                                    src="https://via.placeholder.com/400x200" 
                                    alt="Startup Pitch" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Live on June 25
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">FinTech Innovators</h3>
                                <p className="text-sm text-gray-600 mb-3">Next-gen payment solutions for small businesses</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">FinTech</span>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative">
                                <img 
                                    src="https://via.placeholder.com/400x200" 
                                    alt="Startup Pitch" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Live on July 5
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">EdTech Solutions</h3>
                                <p className="text-sm text-gray-600 mb-3">AI-powered learning platforms for schools</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">EdTech</span>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mt-8 mb-4">Past Pitch Sessions</h2>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">Cloud Analytics</td>
                                    <td className="px-6 py-4 whitespace-nowrap">Cloud Computing</td>
                                    <td className="px-6 py-4 whitespace-nowrap">June 1, 2025</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-indigo-600 hover:text-indigo-900">Watch Recording</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">Mobile Payment Solutions</td>
                                    <td className="px-6 py-4 whitespace-nowrap">FinTech</td>
                                    <td className="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-indigo-600 hover:text-indigo-900">Watch Recording</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualPitch;
