import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

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