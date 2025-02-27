import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedUserTypes = ['startup', 'investor'] }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Store the attempted URL to redirect back after login
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectPath', currentPath);
        return <Navigate to="/login" replace />;
    }

    // Check if user type is allowed to access this route
    try {
        const decoded = jwtDecode(token);
        const userType = decoded.userType;
        
        if (!allowedUserTypes.includes(userType)) {
            return <Navigate to="/dashboard" replace />;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;