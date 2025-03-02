import axios from 'axios';
import { getUserData } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/government-schemes';

// Get all schemes
export const getAllSchemes = async () => {
    try {
        const userData = getUserData();
        if (!userData.token) {
            throw new Error('No authentication token found');
        }

        console.log('Fetching all schemes');
        const response = await axios.get(API_URL, {
            headers: {
                'x-auth-token': userData.token
            }
        });
        console.log('Schemes retrieved:', response.data.length);
        return response.data;
    } catch (error) {
        console.error('Error fetching schemes:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        throw error;
    }
};

// Get user eligibility for all schemes
export const checkEligibility = async (userId) => {
    try {
        const userData = getUserData();
        if (!userData.token) {
            throw new Error('No authentication token found');
        }

        console.log(`Checking eligibility for user ${userId}`);
        const response = await axios.get(`${API_URL}/eligibility/${userId}`, {
            headers: {
                'x-auth-token': userData.token
            }
        });
        console.log('Eligibility results retrieved:', response.data.length);
        return response.data;
    } catch (error) {
        console.error('Error checking eligibility:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
};

// Get a specific scheme by ID
export const getSchemeById = async (schemeId) => {
    try {
        const userData = getUserData();
        if (!userData.token) {
            throw new Error('No authentication token found');
        }

        console.log(`Fetching scheme with ID ${schemeId}`);
        const response = await axios.get(`${API_URL}/${schemeId}`, {
            headers: {
                'x-auth-token': userData.token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching scheme:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        throw error;
    }
}; 