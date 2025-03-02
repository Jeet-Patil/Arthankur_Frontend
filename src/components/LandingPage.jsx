import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Users, DollarSign, Briefcase, Shield, Target, TrendingUp, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <BarChart3 className="h-6 w-6 text-violet-600" />,
            title: 'Financial Analytics',
            description: 'Advanced analytics tools for tracking and managing your startup\'s financial health.'
        },
        {
            icon: <Users className="h-6 w-6 text-violet-600" />,
            title: 'Investor Matching',
            description: 'Connect with the right investors who align with your startup\'s vision and goals.'
        },
        {
            icon: <DollarSign className="h-6 w-6 text-violet-600" />,
            title: 'Funding Management',
            description: 'Streamlined tools for managing funding requests, tracking investments, and handling finances.'
        },
        {
            icon: <Briefcase className="h-6 w-6 text-violet-600" />,
            title: 'Virtual Meetings',
            description: 'Seamless virtual meeting rooms for startup-investor discussions and presentations.'
        }
    ];

    const statistics = [
        { value: '500+', label: 'Active Startups' },
        { value: '₹100Cr+', label: 'Total Funding' },
        { value: '1000+', label: 'Successful Matches' },
        { value: '200+', label: 'Active Investors' }
    ];

    const benefits = [
        {
            icon: <Shield className="h-6 w-6 text-violet-600" />,
            title: 'Secure Platform',
            description: 'Enterprise-grade security for all your sensitive financial data and communications.'
        },
        {
            icon: <Target className="h-6 w-6 text-violet-600" />,
            title: 'Smart Matching',
            description: 'AI-powered algorithms to match startups with the most suitable investors.'
        },
        {
            icon: <TrendingUp className="h-6 w-6 text-violet-600" />,
            title: 'Growth Tools',
            description: 'Comprehensive tools and resources to accelerate your startup\'s growth.'
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-700">
                <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Connecting Startups & MSMEs with Smart Capital
                        </h1>
                        <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
                            Streamline your fundraising process and connect with the right investors through our intelligent platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-colors"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center px-6 py-3 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-400 transition-colors"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-violet-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {statistics.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-violet-600 mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Powerful Features for Modern Startups
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to manage your startup's funding journey, from initial pitch to successful investment.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-violet-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide the tools and support you need to make your startup funding journey successful.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-violet-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 mb-4">{benefit.description}</p>
                                <button className="text-violet-600 font-medium inline-flex items-center hover:text-violet-700">
                                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-violet-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Start Your Funding Journey?
                        </h2>
                        <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of successful startups and MSMEs who have found their perfect investors through our platform.
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-colors"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8">
                        <p className="text-gray-400 text-center">
                            © 2024 Arthankur. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 