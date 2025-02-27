import React from 'react';
import Navbar from '../Navbar';

const ExploreStartups = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Explore Startups</h1>
                    <p className="text-gray-600 mb-8">
                        Discover promising startups looking for investment. Use the filters to find startups that match your investment criteria.
                    </p>
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <input 
                                type="text" 
                                placeholder="Search startups by name, industry, location etc."
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
                        <div>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value="">Funding Stage</option>
                                <option value="seed">Seed</option>
                                <option value="series-a">Series A</option>
                                <option value="series-b">Series B</option>
                                <option value="growth">Growth</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">TechInnovate Solutions</h3>
                                        <p className="text-sm text-gray-500">Mumbai, India</p>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Seed</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">AI-powered solutions for small businesses to automate customer support and improve efficiency.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">AI</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">SaaS</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">B2B</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="font-medium">₹50L - ₹1Cr</span>
                                        <span className="text-gray-500 ml-1">seeking</span>
                                    </div>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">HealthCare Analytics</h3>
                                        <p className="text-sm text-gray-500">Bangalore, India</p>
                                    </div>
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Series A</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Healthcare analytics platform using AI to improve patient outcomes and reduce hospital readmissions.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">HealthTech</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">AI</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Analytics</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="font-medium">₹3Cr - ₹5Cr</span>
                                        <span className="text-gray-500 ml-1">seeking</span>
                                    </div>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">EduLearn Platform</h3>
                                        <p className="text-sm text-gray-500">Delhi, India</p>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Seed</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Personalized learning platform for K-12 students with adaptive curriculum and progress tracking.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">EdTech</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">K-12</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">B2C</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="font-medium">₹1Cr - ₹2Cr</span>
                                        <span className="text-gray-500 ml-1">seeking</span>
                                    </div>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">FinSecure</h3>
                                        <p className="text-sm text-gray-500">Chennai, India</p>
                                    </div>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Series B</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Blockchain-based financial security solutions for banks and financial institutions.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">FinTech</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Blockchain</span>
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Security</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm">
                                        <span className="font-medium">₹10Cr - ₹15Cr</span>
                                        <span className="text-gray-500 ml-1">seeking</span>
                                    </div>
                                    <button className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 text-sm">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                        <button className="bg-white border border-violet-500 text-violet-600 px-4 py-2 rounded hover:bg-violet-50">
                            Load More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreStartups;
