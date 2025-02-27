import React from 'react';
import Navbar from '../Navbar';

const Schemes = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Government Schemes</h1>
                    <p className="text-gray-600 mb-8">
                        Access a comprehensive list of government schemes and programs designed to support startups in India.
                    </p>
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <input 
                                type="text" 
                                placeholder="Search schemes by name, category, or eligibility"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>
                        <div>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value="">All Categories</option>
                                <option value="financial">Financial Support</option>
                                <option value="tax">Tax Benefits</option>
                                <option value="incubation">Incubation</option>
                                <option value="research">Research & Development</option>
                                <option value="msme">MSME Specific</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-blue-50 p-4 border-b">
                                <h3 className="text-lg font-semibold">Startup India Seed Fund Scheme</h3>
                                <p className="text-sm text-gray-600">Ministry of Commerce and Industry</p>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Funding Amount</p>
                                        <p className="font-medium">Up to ₹20 Lakhs</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Eligibility</p>
                                        <p className="font-medium">DPIIT Recognized Startups</p>
                                    </div>
                                </div>
                                <button className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm">
                                    Check Eligibility & Apply
                                </button>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-green-50 p-4 border-b">
                                <h3 className="text-lg font-semibold">Credit Guarantee Scheme</h3>
                                <p className="text-sm text-gray-600">Ministry of MSME</p>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Provides collateral-free loans to micro and small enterprises through financial institutions, covering both term loans and working capital.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Maximum Guarantee Cover</p>
                                        <p className="font-medium">Up to ₹2 Crore</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Eligibility</p>
                                        <p className="font-medium">New & Existing MSMEs</p>
                                    </div>
                                </div>
                                <button className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm">
                                    Check Eligibility & Apply
                                </button>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-purple-50 p-4 border-b">
                                <h3 className="text-lg font-semibold">Stand-Up India</h3>
                                <p className="text-sm text-gray-600">Department of Financial Services</p>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and one woman borrower per bank branch.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Loan Amount</p>
                                        <p className="font-medium">₹10 Lakh - ₹1 Crore</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Purpose</p>
                                        <p className="font-medium">Greenfield enterprises</p>
                                    </div>
                                </div>
                                <button className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm">
                                    Check Eligibility & Apply
                                </button>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-yellow-50 p-4 border-b">
                                <h3 className="text-lg font-semibold">Atal Innovation Mission (AIM)</h3>
                                <p className="text-sm text-gray-600">NITI Aayog</p>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Promotes innovation and entrepreneurship through Atal Incubation Centers, Atal Tinkering Labs, and providing scale-up support to established incubators.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Grant Support</p>
                                        <p className="font-medium">Up to ₹10 Crore</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">For</p>
                                        <p className="font-medium">Incubators & Startups</p>
                                    </div>
                                </div>
                                <button className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm">
                                    Check Eligibility & Apply
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Recently Added Schemes</h2>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheme Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">PM Employment Generation Programme</td>
                                        <td className="px-6 py-4 whitespace-nowrap">MSME</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Subsidies up to 35%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">Design Clinic Scheme</td>
                                        <td className="px-6 py-4 whitespace-nowrap">DC-MSME</td>
                                        <td className="px-6 py-4 whitespace-nowrap">75% of project cost</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schemes;
