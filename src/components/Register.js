import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        registrationNumber: '',
        industry: '',
        about: '',
        name: '',
        investmentExperience: ''
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
            const response = await axios.post('http://localhost:5000/api/users/register', {
                ...formData,
                userType
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                toast.success('Registration successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    {userType === 'startup' ? 'Startup Registration' : 'Investor Registration'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Common fields */}
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

                    {/* Conditional fields based on user type */}
                    {userType === 'startup' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
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
                        </>
                    )}

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