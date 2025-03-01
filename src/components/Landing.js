import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import SuccessStories from './SuccessStories';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Previous Hero Section */}
            <div className="bg-gradient-to-r from-violet-500 to-pink-500 pb-20">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-white">₹ Arthankur</span>
                    </div>
                    <Link 
                        to="/login" 
                        className="bg-white text-violet-600 px-6 py-2 rounded-md font-semibold hover:bg-opacity-90"
                    >
                        Get Started
                    </Link>
                </nav>

                {/* Hero Section */}
                <main className="container mx-auto px-4 text-center pt-20">
                    <h1 className="text-6xl font-bold text-white mb-6">
                        Give Wings To Your Startup
                    </h1>
                    <h2 className="text-4xl font-bold text-white/80 mb-8">
                        with Smart Financial Solutions
                    </h2>
                    <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
                        Connect with investors, access government schemes, and grow your business with AI-powered financial tools.
                    </p>
                    <Link 
                        to="/login" 
                        className="inline-block bg-white text-violet-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90"
                    >
                        Get Started →
                    </Link>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
                        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">AI-Powered Matching</h3>
                            <p className="text-white/70">Connect with the right investors and lenders using our smart algorithms</p>
                        </div>

                        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Simplified Compliance</h3>
                            <p className="text-white/70">Automated tax filing and compliance management system</p>
                        </div>

                        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Government Schemes</h3>
                            <p className="text-white/70">Access all eligible government schemes and benefits in one place</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* New Features Section */}
            <div className="container mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    Everything You Need to Grow Your Business
                </h2>
                <p className="text-xl text-center text-gray-600 mb-16">
                    Comprehensive tools and resources to help your startup thrive in the Indian market
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Funding Marketplace */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Funding Marketplace</h3>
                        <p className="text-gray-600">Connect with investors, VCs, and lenders through our AI-powered matchmaking system</p>
                    </div>

                    {/* Loan Aggregator */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H4c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Loan Aggregator</h3>
                        <p className="text-gray-600">Compare and apply for business loans from multiple lenders in one place</p>
                    </div>

                    {/* Smart Tax Filing */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-4v1h4v5h-4v1h4v2H7V8h6v3z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Tax Filing</h3>
                        <p className="text-gray-600">Automated tax compliance and filing system with AI-driven insights</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Government Schemes */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Government Schemes</h3>
                        <p className="text-gray-600">Access and apply for eligible government schemes and benefits</p>
                    </div>

                    {/* Financial Planning */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Planning</h3>
                        <p className="text-gray-600">AI-powered financial forecasting and business health analysis</p>
                    </div>

                    {/* Community Hub */}
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="bg-violet-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Community Hub</h3>
                        <p className="text-gray-600">Connect with fellow entrepreneurs, mentors, and industry experts</p>
                    </div>
                </div>
            </div>

            <SuccessStories />
        </div>
    );
} 