import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { isAuthenticated, getUserData, clearUserData } from '../utils/auth';

const ProtectedRoute = ({ children, allowedUserTypes = ['startup', 'investor'] }) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // Store the attempted URL to redirect back after login
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectPath', currentPath);
        toast.error('Please login to continue');
        return <Navigate to="/login" replace />;
    }

    // Get user data
    const userData = getUserData();
    
    // Check if user type exists
    if (!userData.userType) {
        console.error('No user type found in localStorage');
        // Clear all auth data and redirect to login
        clearUserData();
        toast.error('Authentication error. Please login again.');
        return <Navigate to="/login" replace />;
    }
    
    // Check if the user type is allowed to access this route
    if (!allowedUserTypes.includes(userData.userType)) {
        toast.error('You do not have permission to access this page');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;