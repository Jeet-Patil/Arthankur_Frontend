import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { storeUserData, getRedirectPath, clearUserData } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        password: '',
    });

    // Check if user was redirected from registration
    useEffect(() => {
        // If we have a state with from=register, show a welcome message
        if (location.state?.from === 'register') {
            toast.success('Registration successful! Please log in to continue.');
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Attempting login with:', formData);
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            console.log('Login response:', response.data);
            
            if (response.data.token) {
                // Store user data using utility function
                const stored = storeUserData(response.data);
                
                if (stored) {
                    toast.success('Login successful!');
                    
                    // Get redirect path and navigate
                    const redirectPath = getRedirectPath();
                    console.log('Redirecting to:', redirectPath);
                    
                    // Remove redirect path from localStorage
                    localStorage.removeItem('redirectPath');
                    
                    // Navigate to the stored path or dashboard by default
                    navigate(redirectPath);
                } else {
                    toast.error('Error storing authentication data');
                }
            } else {
                console.error('Login response missing token:', response.data);
                toast.error('Invalid login response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Display more specific error messages
            if (error.response) {
                // The request was made and the server responded with an error status
                const errorMessage = error.response.data.error || error.response.data.message || 'Invalid credentials';
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

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg 
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/register" className="text-violet-600 hover:text-violet-800">
                        Don't have an account? Register
                    </Link>
                </div>
                <div className="mt-3 text-center">
                    <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-violet-800">
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login; 