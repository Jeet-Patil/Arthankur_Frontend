// Auth utility functions

/**
 * Stores user authentication data in localStorage
 * @param {Object} userData - User data from login or registration response
 */
export const storeUserData = (userData) => {
  if (!userData || !userData.token) {
    console.error('Invalid user data provided to storeUserData:', userData);
    return false;
  }
  
  try {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userType', userData.userType);
    
    if (userData.user) {
      localStorage.setItem('userId', userData.user.id);
      localStorage.setItem('userEmail', userData.user.email);
      localStorage.setItem('userName', userData.user.name);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

/**
 * Clears all authentication data from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('redirectPath');
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Gets the user's data from localStorage
 * @returns {Object} User data
 */
export const getUserData = () => {
  return {
    token: localStorage.getItem('token'),
    userType: localStorage.getItem('userType'),
    userId: localStorage.getItem('userId'),
    userEmail: localStorage.getItem('userEmail'),
    userName: localStorage.getItem('userName')
  };
};

/**
 * Gets the redirect path from localStorage
 * @returns {string} Redirect path
 */
export const getRedirectPath = () => {
  return localStorage.getItem('redirectPath') || '/dashboard';
}; 