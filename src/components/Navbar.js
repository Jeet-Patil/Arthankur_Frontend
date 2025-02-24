import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                        <Link to="/meetings" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                            Meetings
                        </Link>
                        <Link to="/loans" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                            Loans
                        </Link>
                        <Link to="/schemes" className="text-gray-600 hover:text-violet-600 px-3 py-2">
                            Schemes
                        </Link>
                        <div className="relative group">
                            <button className="text-gray-600 hover:text-violet-600 px-3 py-2">
                                Tools
                            </button>
                            <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                                <Link to="/financial-tools" className="block px-4 py-2 text-gray-800 hover:bg-violet-50">
                                    Financial Calculator
                                </Link>
                                <Link to="/tax-filing" className="block px-4 py-2 text-gray-800 hover:bg-violet-50">
                                    Tax Filing
                                </Link>
                                <Link to="/compliance" className="block px-4 py-2 text-gray-800 hover:bg-violet-50">
                                    Compliance
                                </Link>
                            </div>
                        </div>
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