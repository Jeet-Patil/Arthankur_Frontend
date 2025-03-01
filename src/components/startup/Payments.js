import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StripeCheckout from 'react-stripe-checkout';
import { processPayment, getPaymentHistory } from '../../services/api';
import Navbar from '../Navbar';

const Payments = () => {
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [paymentPurpose, setPaymentPurpose] = useState('service_fee');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || 'Startup';
    const userId = localStorage.getItem('userId');

    // Payment options
    const paymentOptions = [
        { id: 'service_fee', name: 'Platform Service Fee', amount: 100, description: 'Monthly platform service fee for accessing premium features' },
        { id: 'advisory', name: 'Advisory Services', amount: 500, description: 'One-time payment for expert advisory services' },
        { id: 'custom', name: 'Custom Payment', amount: amount, description: 'Make a custom payment for specific services' }
    ];

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    // Fetch payment history
    const fetchPaymentHistory = async () => {
        setHistoryLoading(true);
        try {
            const response = await getPaymentHistory();
            if (response && response.success) {
                setPaymentHistory(response.payments);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
        } finally {
            setHistoryLoading(false);
        }
    };

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
            const response = await processPayment({
                amount: amount,
                token: token,
                purpose: paymentPurpose,
                userId: userId
            });
            
            // Check if response contains success flag
            if (response && response.success) {
                setSuccess(true);
                
                // Show toast notification for successful payment
                toast.success('Payment processed successfully!');
                
                // Refresh payment history
                fetchPaymentHistory();
                
                // Reset success state after 3 seconds
                setTimeout(() => {
                    setSuccess(false);
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

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Startup Payments</h1>
                    
                    {success ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            <p className="font-semibold">Payment Successful!</p>
                            <p>Thank you for your payment. Your transaction has been processed successfully.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-8">
                                Welcome, {userName}! Use this portal to make payments for various services offered on Arthankur.
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
                                
                                <div className="flex justify-center">
                                    <StripeCheckout
                                        stripeKey="pk_test_51Off20H549Htd2C0L3Qx2vBjuAaDXolsMTwA3RHqbTd5tn4MqlKlb3f7ut6BfjLIWSs3T30RvHGIYsKjf52h81Yb00jCQEMgIh"
                                        token={handlePayment}
                                        name="Arthankur Payments"
                                        description={`Payment for ${selectedOption.name}`}
                                        amount={amount * 100} // Convert to paise/cents
                                        currency="INR"
                                        email={localStorage.getItem('userEmail')}
                                        disabled={loading || amount <= 0}
                                    >
                                        <button
                                            className={`w-full md:w-auto px-6 py-3 bg-violet-600 text-white font-medium rounded-md shadow-sm 
                                                ${(loading || amount <= 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-700'}`}
                                            disabled={loading || amount <= 0}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : `Pay ₹${amount}`}
                                        </button>
                                    </StripeCheckout>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* Payment History Section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-medium text-gray-700 mb-4">Payment History</h2>
                        
                        {historyLoading ? (
                            <div className="text-center py-4">
                                <svg className="animate-spin h-8 w-8 text-violet-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : paymentHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Purpose
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(payment.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {payment.purpose}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ₹{payment.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {payment.status === 'success' ? 'Successful' : 'Failed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                                No payment history available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
