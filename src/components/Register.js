import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEligibilityForm, setShowEligibilityForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        registrationNumber: '',
        industry: '',
        about: '',
        name: '',
        investmentExperience: '',
        // Additional fields for government scheme eligibility
        startupStage: '',
        industryType: '',
        annualRevenue: '',
        numberOfEmployees: '',
        registeredLocation: '',
        existingGovernmentSupport: 'No'
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Sending registration data:', {
                ...formData,
                userType
            });
            
            const response = await axios.post('http://localhost:5000/api/users/register', {
                ...formData,
                userType
            });

            if (response.data.token) {
                // Don't store token after registration, user should login explicitly
                // localStorage.setItem('token', response.data.token);
                toast.success('Registration successful! Please login to continue.');
                
                // Navigate to login with state to indicate they're coming from registration
                navigate('/login', { state: { from: 'register', email: formData.email } });
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Display more specific error messages
            if (error.response) {
                // The request was made and the server responded with an error status
                const errorMessage = error.response.data.error || error.response.data.message || 'Registration failed';
                toast.error(errorMessage);
                console.error('Server response:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your internet connection.');
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request
                toast.error('Error setting up request: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartupContinue = (e) => {
        e.preventDefault();
        setShowEligibilityForm(true);
    };

    if (!userType) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Choose Account Type</h2>
                    <div className="space-y-4">
                        <button
                            onClick={() => setUserType('startup')}
                            className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700"
                        >
                            Register as Startup
                        </button>
                        <button
                            onClick={() => setUserType('investor')}
                            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
                        >
                            Register as Investor
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // First part of startup registration
    if (userType === 'startup' && !showEligibilityForm) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                        Startup Registration
                    </h2>
                    <form onSubmit={handleStartupContinue} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="text"
                            name="registrationNumber"
                            placeholder="Registration Number"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <input
                            type="text"
                            name="industry"
                            placeholder="Industry"
                            value={formData.industry}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <textarea
                            name="about"
                            placeholder="About your startup"
                            value={formData.about}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg hover:opacity-90"
                        >
                            Continue to Eligibility
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-violet-600 hover:text-violet-800">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Second part of startup registration - Government scheme eligibility
    if (userType === 'startup' && showEligibilityForm) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                        Scheme Eligibility Information
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Startup Stage</label>
                            <select
                                name="startupStage"
                                value={formData.startupStage}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            >
                                <option value="">Select Startup Stage</option>
                                <option value="Idea">Idea</option>
                                <option value="Prototype">Prototype</option>
                                <option value="Early Stage">Early Stage</option>
                                <option value="Growth">Growth</option>
                                <option value="Mature">Mature</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Industry Type</label>
                            <select
                                name="industryType"
                                value={formData.industryType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            >
                                <option value="">Select Industry</option>
                                <option value="IT/Tech">IT/Tech</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Finance">Finance</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Services">Services</option>
                                <option value="Retail">Retail</option>
                                <option value="Energy">Energy</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Annual Revenue</label>
                            <select
                                name="annualRevenue"
                                value={formData.annualRevenue}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            >
                                <option value="">Select Revenue Range</option>
                                <option value="Pre-revenue">Pre-revenue</option>
                                <option value="0-10 Lakhs">0-10 Lakhs</option>
                                <option value="10-50 Lakhs">10-50 Lakhs</option>
                                <option value="50 Lakhs-1 Crore">50 Lakhs-1 Crore</option>
                                <option value="1-5 Crore">1-5 Crore</option>
                                <option value="5+ Crore">5+ Crore</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Number of Employees</label>
                            <input
                                type="number"
                                name="numberOfEmployees"
                                placeholder="Number of Employees"
                                value={formData.numberOfEmployees}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Registered Location</label>
                            <select
                                name="registeredLocation"
                                value={formData.registeredLocation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Metro City">Metro City</option>
                                <option value="Tier 1 City">Tier 1 City</option>
                                <option value="Tier 2 City">Tier 2 City</option>
                                <option value="Tier 3 City">Tier 3 City</option>
                                <option value="Rural Area">Rural Area</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Existing Government Support</label>
                            <select
                                name="existingGovernmentSupport"
                                value={formData.existingGovernmentSupport}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg 
                            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {isLoading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button 
                            onClick={() => setShowEligibilityForm(false)}
                            className="text-violet-600 hover:text-violet-800"
                        >
                            Back to Basic Information
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Investor Registration
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common fields */}
                    <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />

                    <select
                        name="investmentExperience"
                        value={formData.investmentExperience}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    >
                        <option value="">Select Investment Experience</option>
                        <option value="beginner">Beginner (0-2 years)</option>
                        <option value="intermediate">Intermediate (2-5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                    </select>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg 
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-violet-600 hover:text-violet-800">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register; 