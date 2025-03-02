import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // This is a placeholder - you will need to implement the actual API endpoint
            // await axios.post('http://localhost:5000/api/users/forgot-password', { email });
            
            // For now, just simulate success
            setTimeout(() => {
                setResetSent(true);
                toast.success('Password reset instructions sent to your email!');
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Password reset error:', error);
            
            if (error.response) {
                const errorMessage = error.response.data.error || error.response.data.message || 'Failed to send reset email';
                toast.error(errorMessage);
            } else if (error.request) {
                toast.error('No response from server. Please check your internet connection.');
            } else {
                toast.error('Error setting up request: ' + error.message);
            }
            setIsLoading(false);
        }
    };

    if (resetSent) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Check Your Email</h2>
                        <p className="text-gray-600 mb-6">
                            We've sent password reset instructions to {email}. Please check your inbox.
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                            If you don't see the email, check your spam folder.
                        </p>
                        <div className="mt-6">
                            <Link to="/login" className="text-violet-600 hover:text-violet-800">
                                Return to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-2 rounded-lg 
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                        {isLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-violet-600 hover:text-violet-800">
                        Remember your password? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 