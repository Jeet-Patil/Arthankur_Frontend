import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '../Navbar';

const PaymentGateway = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [paymentPurpose, setPaymentPurpose] = useState('subscription');

    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || 'Investor';
    const userId = localStorage.getItem('userId');

    // Payment options
    const paymentOptions = [
        { id: 'subscription', name: 'Monthly Subscription', amount: 100, description: 'Access to premium startup listings and investment opportunities' },
        { id: 'premium', name: 'Premium Access', amount: 500, description: 'Priority access to high-growth startups and exclusive investment deals' },
        { id: 'custom', name: 'Custom Amount', amount: amount, description: 'Specify your own amount for investment credits' }
    ];

    // Handle payment option change
    const handleOptionChange = (option) => {
        setPaymentPurpose(option.id);
        if (option.id !== 'custom') {
            setAmount(option.amount);
        }
    };

    // Handle custom amount change
    const handleAmountChange = (e) => {
        const value = parseInt(e.target.value);
        setAmount(isNaN(value) ? 0 : value);
    };

    // Process payment with Stripe
    const handlePayment = async (token) => {
        setLoading(true);
        setError(null);
        
        try {
            // Get auth token
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                throw new Error('Authentication required. Please log in again.');
            }
            
            // Validate amount before proceeding
            if (amount <= 0) {
                throw new Error('Please enter a valid payment amount');
            }
            
            // Make API call to backend
            const response = await axios.post(
                'http://localhost:5000/api/payments/process',
                {
                    amount: amount,
                    token: token,
                    purpose: paymentPurpose,
                    userId: userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    },
                    timeout: 10000 // 10 second timeout
                }
            );
            
            // Check if response contains success flag
            if (response.data && response.data.success) {
                setSuccess(true);
                
                // Show toast notification for successful payment
                toast.success('Payment processed successfully!');
                
                // Show success message for 3 seconds then redirect
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                // Handle unexpected response format
                throw new Error('Payment response was invalid. Please try again.');
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            
            // Handle different types of errors with specific messages
            let errorMessage = 'Payment processing failed';
            
            if (error.message) {
                // Custom error messages thrown above
                errorMessage = error.message;
            } else if (error.response) {
                // Server responded with an error
                if (error.response.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'No response from payment server. Please check your internet connection and try again.';
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Get the selected payment option
    const selectedOption = paymentOptions.find(option => option.id === paymentPurpose) || paymentOptions[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Investor Payment Gateway</h1>
                    
                    {success ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p className="font-semibold">Payment Successful!</p>
                            <p>Thank you for your payment. You will be redirected to the dashboard shortly.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-8">
                                Welcome, {userName}! Choose a payment option below to enhance your investment experience on Arthankur.
                            </p>
                            
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-bold">Payment Failed</p>
                                    </div>
                                    <p className="mt-2">{error}</p>
                                    <p className="mt-2 text-sm">Please try again or contact support if the problem persists.</p>
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <h2 className="text-xl font-medium text-gray-700 mb-4">Select Payment Option</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {paymentOptions.map((option) => (
                                        <div 
                                            key={option.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentPurpose === option.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-violet-300'}`}
                                            onClick={() => handleOptionChange(option)}
                                        >
                                            <h3 className="font-medium text-gray-800">{option.name}</h3>
                                            {option.id !== 'custom' && (
                                                <p className="text-2xl font-bold text-violet-600 my-2">₹{option.amount}</p>
                                            )}
                                            <p className="text-sm text-gray-600">{option.description}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {paymentPurpose === 'custom' && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Enter Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            min="10"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                    </div>
                                )}
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-medium text-gray-800 mb-2">Payment Summary</h3>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span>Option</span>
                                        <span>{selectedOption.name}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span>Amount</span>
                                        <span className="font-medium">₹{amount}</span>
                                    </div>
                                    <div className="flex justify-between py-2 mt-2">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-violet-600">₹{amount}</span>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <StripeCheckout
                                        name="Arthankur Investor"
                                        description={`Payment for ${selectedOption.name}`}
                                        amount={amount * 100} // Stripe requires amount in cents
                                        token={handlePayment}
                                        currency="INR"
                                        stripeKey="pk_test_51Off20H549Htd2C0L3Qx2vBjuAaDXolsMTwA3RHqbTd5tn4MqlKlb3f7ut6BfjLIWSs3T30RvHGIYsKjf52h81Yb00jCQEMgIh"
                                        email={localStorage.getItem('userEmail')}
                                    >
                                        <button 
                                            className="px-6 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
                                            disabled={loading || amount <= 0}
                                        >
                                            {loading ? 'Processing...' : `Pay ₹${amount}`}
                                        </button>
                                    </StripeCheckout>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;