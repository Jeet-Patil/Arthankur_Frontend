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
                        <Link to="/dashboard" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                            Dashboard
                        </Link>
                        {userType === 'startup' ? (
                            <>
                                <Link to="/loans" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Loans
                                </Link>
                                <Link to="/schemes" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Schemes
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/investments" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Investments
                                </Link>
                                <Link to="/portfolio" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                    Portfolio
                                </Link>
                            </>
                        )}
                        <Link to="/meetings" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                            Meetings
                        </Link>
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