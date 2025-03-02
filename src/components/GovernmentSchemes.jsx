import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GovernmentSchemes = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Automatically redirect to the Schemes component
        navigate('/schemes');
    }, [navigate]);
    
    return null; // No need to render anything since we're redirecting
};

export default GovernmentSchemes; 