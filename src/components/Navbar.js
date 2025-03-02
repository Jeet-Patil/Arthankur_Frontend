import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserData, clearUserData } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userType, setUserType] = useState(null);
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        // Get user data from auth utilities instead of decoding JWT
        const userData = getUserData();
        if (userData.token) {
            setUserType(userData.userType);
            
            // Use name from auth utilities
            if (userData.userName) {
                setUserName(userData.userName);
            }
            
            // No need to fetch from API since we're using the utility functions
        }
    }, []);

    const handleLogout = () => {
        // Use auth utility to clear user data
        clearUserData();
        navigate('/login');
    };

    // Function to check if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    // Function to get link class names
    const getLinkClassName = (path) => {
        return `px-3 py-2 ${
            isActiveLink(path)
            ? 'text-violet-600 font-semibold border-b-2 border-violet-600'
            : 'text-gray-600 hover:text-violet-600'
        }`;
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const startupNavLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/funding', label: 'Funding' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/loans', label: 'Loans' },
        { path: '/financial-tools', label: 'Financial Tools' },
        { path: '/tax-compliance', label: 'Tax & Compliance' },
        { path: '/schemes', label: 'Schemes' },
        { path: '/community', label: 'Community' },
        { path: '/case-studies', label: 'Case Studies' },
        { path: '/payments', label: 'Payments' },
    ];

    const investorNavLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/meetings', label: 'Meetings' },
        { path: '/community', label: 'Community' },
        { path: '/explore-startups', label: 'Explore Startups & MSMEs' },
        { path: '/case-studies', label: 'Success Stories' },
        { path: '/payment', label: 'Payment' }
    ];

    const navLinks = userType === 'startup' ? startupNavLinks : investorNavLinks;

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-8xl mx-auto px-7">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <span className="text-2xl font-bold text-violet-600">₹ Arthankur</span>
                            {/* <span className="ml-2 text-xs italic text-violet-500 hidden md:inline">Give wings to your startup</span> */}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-violet-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (        
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userType && navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={getLinkClassName(link.path)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    onClick={toggleProfileMenu}
                                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                >
                                    <div className="h-8 w-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-600 font-semibold">
                                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </button>
                            </div>
                            {isProfileMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsProfileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white pb-4 px-4">
                    <div className="flex flex-col space-y-2">
                        {userType && navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block py-2 px-4 rounded ${isActiveLink(link.path) ? 'bg-violet-100 text-violet-600' : 'text-gray-600'}`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/profile"
                            className="block py-2 px-4 rounded text-gray-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Your Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 mt-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;