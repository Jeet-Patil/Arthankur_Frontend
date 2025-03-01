import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const FINANCIAL_API_URL = 'http://localhost:5000/api/financial';
const FUNDING_API_URL = 'http://localhost:5000/api/funding';
const CHATBOT_API_URL = 'http://localhost:5000/api/chatbot';
const STRIPE_API_URL = 'http://localhost:5000/api/stripe';

// Helper function to get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userType', response.data.userType);
            
            // Store user info in local storage
            if (response.data.user) {
                localStorage.setItem('userName', response.data.user.name || '');
                localStorage.setItem('userId', response.data.user.id || '');
            }
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userType', response.data.userType);
            
            // Store user info in local storage
            if (response.data.user) {
                localStorage.setItem('userName', response.data.user.name || '');
                localStorage.setItem('userId', response.data.user.id || '');
            }
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch profile' };
    }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, profileData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to update profile' };
    }
};

// Cash Flow Forecasting APIs

// Save a new cash flow forecast
export const saveCashFlowForecast = async (forecastData) => {
    try {
        const response = await axios.post(`${FINANCIAL_API_URL}/forecast`, forecastData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to save cash flow forecast' };
    }
};

// Get all cash flow forecasts for a user
export const getCashFlowForecasts = async () => {
    try {
        const response = await axios.get(`${FINANCIAL_API_URL}/forecasts`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch cash flow forecasts' };
    }
};

// Get a specific cash flow forecast
export const getCashFlowForecast = async (id) => {
    try {
        const response = await axios.get(`${FINANCIAL_API_URL}/forecast/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch cash flow forecast' };
    }
};

// Update a cash flow forecast
export const updateCashFlowForecast = async (id, forecastData) => {
    try {
        const response = await axios.put(`${FINANCIAL_API_URL}/forecast/${id}`, forecastData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to update cash flow forecast' };
    }
};

// Delete a cash flow forecast
export const deleteCashFlowForecast = async (id) => {
    try {
        const response = await axios.delete(`${FINANCIAL_API_URL}/forecast/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to delete cash flow forecast' };
    }
};

// Working Capital Analysis APIs

// Save a new working capital analysis
export const saveWorkingCapitalAnalysis = async (analysisData) => {
    try {
        console.log('API service: saving working capital with data:', analysisData);
        console.log('API endpoint:', `${FINANCIAL_API_URL}/working-capital/analysis`);
        console.log('Auth header:', getAuthHeader());
        
        const response = await axios.post(`${FINANCIAL_API_URL}/working-capital/analysis`, analysisData, getAuthHeader());
        console.log('API service: received response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Working capital save error:', error);
        if (error.response) {
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);
        }
        throw error.response?.data || { error: 'Failed to save working capital analysis' };
    }
};

// Get all working capital analyses for a user
export const getWorkingCapitalAnalyses = async () => {
    try {
        const response = await axios.get(`${FINANCIAL_API_URL}/working-capital/analyses`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching analyses:', error);
        throw error.response?.data || { error: 'Failed to fetch working capital analyses' };
    }
};

// Get a specific working capital analysis
export const getWorkingCapitalAnalysis = async (id) => {
    try {
        const response = await axios.get(`${FINANCIAL_API_URL}/working-capital/analysis/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching analysis:', error);
        throw error.response?.data || { error: 'Failed to fetch working capital analysis' };
    }
};

// Update a working capital analysis
export const updateWorkingCapitalAnalysis = async (id, analysisData) => {
    try {
        const response = await axios.put(`${FINANCIAL_API_URL}/working-capital/analysis/${id}`, analysisData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error updating analysis:', error);
        throw error.response?.data || { error: 'Failed to update working capital analysis' };
    }
};

// Delete a working capital analysis
export const deleteWorkingCapitalAnalysis = async (id) => {
    try {
        const response = await axios.delete(`${FINANCIAL_API_URL}/working-capital/analysis/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error deleting analysis:', error);
        throw error.response?.data || { error: 'Failed to delete working capital analysis' };
    }
};

// Chatbot API
export const checkChatbotStatus = async () => {
    try {
        const response = await axios.get(`${CHATBOT_API_URL}/status`);
        return response.data;
    } catch (error) {
        console.error('Error checking chatbot status:', error);
        throw { status: 'unavailable', mode: 'local', reason: 'error' };
    }
};

// Send a message to the chatbot
export const sendChatMessage = async (message) => {
    try {
        const response = await axios.post(`${CHATBOT_API_URL}/message`, { message });
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error.response?.data || { error: 'Failed to send message to chatbot' };
    }
};

// Funding APIs
export const getAllFundingRequests = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/funding/all', getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching funding requests:', error);
        throw error.response?.data || { error: 'Failed to fetch funding requests' };
    }
};

// Get a specific funding request by ID
export const getFundingRequestById = async (id) => {
    try {
        const response = await axios.get(`${FUNDING_API_URL}/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching funding request:', error);
        throw error.response?.data || { error: 'Failed to fetch funding request' };
    }
};

// Express interest in a funding request
export const expressFundingInterest = async (id, message = '') => {
    try {
        const response = await axios.post(`${FUNDING_API_URL}/${id}/interest`, { message }, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error expressing funding interest:', error);
        throw error.response?.data || { error: 'Failed to express interest in funding' };
    }
};

// Accept investor interest in a funding request
export const acceptFundingInterest = async (fundingId, interestId) => {
    try {
        const response = await axios.post(
            `${FUNDING_API_URL}/${fundingId}/accept-interest/${interestId}`, 
            {}, 
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error('Error accepting funding interest:', error);
        throw error.response?.data || { error: 'Failed to accept funding interest' };
    }
};

// Delete a funding request
export const deleteFundingRequest = async (id) => {
    try {
        const response = await axios.delete(`${FUNDING_API_URL}/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error deleting funding request:', error);
        throw error.response?.data || { error: 'Failed to delete funding request' };
    }
};

// Notification APIs
export const getNotifications = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/notifications', getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error.response?.data || { error: 'Failed to fetch notifications' };
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/api/notifications/${notificationId}/read`,
            {},
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error.response?.data || { error: 'Failed to mark notification as read' };
    }
};

// Payment APIs
export const processPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${STRIPE_API_URL}/process`, paymentData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error.response?.data || { error: 'Failed to process payment' };
    }
};

export const getPaymentHistory = async () => {
    try {
        const response = await axios.get(`${STRIPE_API_URL}/history`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching payment history:', error);
        throw error.response?.data || { error: 'Failed to fetch payment history' };
    }
};