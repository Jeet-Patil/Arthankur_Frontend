import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userType }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <span className="text-2xl font-bold text-violet-600">₹ Arthankur</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {userType === 'startup' ? (
                            <>
                                <Link to="/funding" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Funding
                                </Link>
                                <Link to="/meetings" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Meetings
                                </Link>
                                <Link to="/loans" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Loans
                                </Link>
                                <Link to="/financial-tools" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Financial Tools
                                </Link>
                                <Link to="/tax-compliance" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Tax & Compliance
                                </Link>
                                <Link to="/schemes" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Schemes
                                </Link>
                                <Link to="/community" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Community
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/funding" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Funding
                                </Link>
                                <Link to="/meetings" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Meetings
                                </Link>
                                <Link to="/virtual-pitch" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Virtual Pitch
                                </Link>
                                <Link to="/community" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Community
                                </Link>
                                <Link to="/explore-startups" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Explore Startups
                                </Link>
                            </>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 