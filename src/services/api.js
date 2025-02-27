import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const FINANCIAL_API_URL = 'http://localhost:5000/api/financial';

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