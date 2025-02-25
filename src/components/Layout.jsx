import React from 'react';
import Navbar from './Navbar';  // Your existing Navbar component

const Layout = ({ children }) => {
  // Get userType from localStorage
  const userType = localStorage.getItem('userType');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType={userType} />
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        {children}
      </main>
    </div>
  );
};

export default Layout; 