import React from 'react';
import { Link } from 'react-router-dom';
import SuccessStories from './SuccessStories';
import Footer from './Footer';
import './Landing.css';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-white h-screen flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100 to-white opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between w-full">
                    <div className="w-full lg:w-1/2">
                        {/* Logo and Tagline */}
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <span className="text-4xl font-bold text-violet-600 mr-2">₹</span>
                                <h1 className="text-4xl font-bold text-gray-900">Arthankur</h1>
                            </div>
                            <p className="text-2xl italic text-violet-700">Give wings to your startup</p>
                        </div>
                        
                        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                            Connect Startups 
                            <span className="block text-violet-600">with Investors</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg">
                            Arthankur is your one-stop platform for startup funding, financial tools, and investor connections.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-violet-600 text-white rounded-lg text-lg font-semibold hover:bg-violet-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white text-violet-600 rounded-lg text-lg font-semibold hover:bg-violet-50 transition-colors border-2 border-violet-600"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                    <div className="hidden lg:block w-1/2">
                        <img 
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" 
                            alt="Startup Team" 
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-violet-600 font-semibold tracking-wide uppercase mb-3">Features</h2>
                        <p className="text-4xl font-bold text-gray-900">
                            Everything you need to grow
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Feature Cards */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Funding Solutions</h3>
                            <p className="text-gray-600">
                                Connect with investors and secure funding for your startup through various channels.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Tools</h3>
                            <p className="text-gray-600">
                                Access powerful tools for financial planning, cash flow forecasting, and more.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Investor Network</h3>
                            <p className="text-gray-600">
                                Join a growing network of investors looking for promising startup opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-violet-600 font-semibold tracking-wide uppercase mb-3">Process</h2>
                        <p className="text-4xl font-bold text-gray-900">
                            How Arthankur Works
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden lg:block w-full h-0.5 bg-violet-100"></div>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Success Stories Section */}
            <SuccessStories />

            {/* Single Footer */}
            {/* <Footer /> */}
        </div>
    );
}

const steps = [
    {
        title: "Create Profile",
        description: "Sign up and complete your startup or investor profile with relevant details."
    },
    {
        title: "Connect",
        description: "Browse and connect with potential investors or promising startups."
    },
    {
        title: "Collaborate",
        description: "Schedule meetings and discuss opportunities in detail."
    },
    {
        title: "Grow",
        description: "Secure funding and grow your business with expert guidance."
    }
]; 