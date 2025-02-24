import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Store the attempted URL to redirect back after login
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectPath', currentPath);
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 