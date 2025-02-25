import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ userType }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
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
                                <Link to="/funding" className={getLinkClassName('/funding')}>
                                    Funding
                                </Link>
                                <Link to="/meetings" className={getLinkClassName('/meetings')}>
                                    Meetings
                                </Link>
                                <Link to="/loans" className={getLinkClassName('/loans')}>
                                    Loans
                                </Link>
                                <Link to="/financial-tools" className={getLinkClassName('/financial-tools')}>
                                    Financial Tools
                                </Link>
                                <Link to="/tax-compliance" className={getLinkClassName('/tax-compliance')}>
                                    Tax & Compliance
                                </Link>
                                <Link to="/schemes" className={getLinkClassName('/schemes')}>
                                    Schemes
                                </Link>
                                <Link to="/community" className={getLinkClassName('/community')}>
                                    Community
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/funding" className={getLinkClassName('/funding')}>
                                    Funding
                                </Link>
                                <Link to="/meetings" className={getLinkClassName('/meetings')}>
                                    Meetings
                                </Link>
                                <Link to="/virtual-pitch" className={getLinkClassName('/virtual-pitch')}>
                                    Virtual Pitch
                                </Link>
                                <Link to="/community" className={getLinkClassName('/community')}>
                                    Community
                                </Link>
                                <Link to="/explore-startups" className={getLinkClassName('/explore-startups')}>
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