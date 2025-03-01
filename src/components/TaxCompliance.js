import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Calendar, FileText, BarChart2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Configure axios defaults
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const TaxCompliance = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [taxReports, setTaxReports] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showAddDeadline, setShowAddDeadline] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDeadline, setSelectedDeadline] = useState(null);
    const [deadlines, setDeadlines] = useState([]);
    const [newDeadline, setNewDeadline] = useState({
        type: '',
        description: '',
        deadline: '',
        status: 'upcoming'
    });
    const [gstDetails, setGstDetails] = useState({
        gstNumber: '',
        turnover: '',
        taxPeriod: '',
        taxableAmount: '',
        documents: []
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to access this feature');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                await Promise.all([
                    fetchDeadlines(),
                    fetchGSTDetails(),
                    fetchTaxReports()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const fetchDeadlines = async () => {
        try {
            const response = await axiosInstance.get('/tax-compliance/deadlines');
            setDeadlines(response.data);
        } catch (error) {
            console.error('Error fetching deadlines:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to fetch deadlines');
            }
        }
    };

    const fetchGSTDetails = async () => {
        try {
            const response = await axiosInstance.get('/tax-compliance/gst');
            if (response.data.length > 0) {
                setGstDetails(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching GST details:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to fetch GST details');
            }
        }
    };

    const fetchTaxReports = async () => {
        try {
            const response = await axiosInstance.get('/tax-compliance/reports');
            setTaxReports(response.data);
        } catch (error) {
            console.error('Error fetching tax reports:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to fetch tax reports');
            }
        }
    };

    const upcomingDeadlines = [
        {
            id: 1,
            type: 'GST Filing',
            description: 'Monthly GSTR-3B return filing',
            deadline: new Date(2025, 2, 20), // March 20, 2025
            icon: 'document',
            status: 'pending'
        },
        {
            id: 2,
            type: 'TDS Return',
            description: 'Quarterly TDS return filing',
            deadline: new Date(2025, 2, 31), // March 31, 2025
            icon: 'check',
            status: 'completed'
        },
        {
            id: 3,
            type: 'Income Tax Advance Payment',
            description: 'Fourth installment of advance tax',
            deadline: new Date(2025, 3, 15), // April 15, 2025
            icon: 'clock',
            status: 'upcoming'
        }
    ];

    const quickActions = [
        {
            id: 1,
            title: 'File GST Return',
            icon: FileText,
            action: () => setActiveTab('gst-filing')
        },
        {
            id: 2,
            title: 'Generate Tax Report',
            icon: BarChart2,
            action: () => setActiveTab('reports')
        },
        {
            id: 3,
            title: 'View Compliance Calendar',
            icon: Calendar,
            action: () => setShowCalendar(true)
        }
    ];

    const handleGSTInputChange = (e) => {
        const { name, value } = e.target;
        setGstDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGSTDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        setGstDetails(prev => ({
            ...prev,
            documents: [...prev.documents, ...files]
        }));
    };

    const handleGSTSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('gstNumber', gstDetails.gstNumber);
            formData.append('turnover', gstDetails.turnover);
            formData.append('taxPeriod', gstDetails.taxPeriod);
            formData.append('taxableAmount', gstDetails.taxableAmount);
            
            gstDetails.documents.forEach(doc => {
                formData.append('documents', doc);
            });

            await axiosInstance.post('/tax-compliance/gst', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('GST return filed successfully!');
            setGstDetails({
                gstNumber: '',
                turnover: '',
                taxPeriod: '',
                taxableAmount: '',
                documents: []
            });
            fetchGSTDetails();
        } catch (error) {
            console.error('Error submitting GST details:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to file GST return');
            }
        }
    };

    const generateTaxReport = async () => {
        try {
            const response = await axiosInstance.post('/tax-compliance/reports', {
                type: 'Monthly Tax Report',
                reportPeriod: new Date().toISOString().slice(0, 7)
            });
            
            setTaxReports(prev => [...prev, response.data]);
            toast.success('Tax report generated successfully!');
        } catch (error) {
            console.error('Error generating tax report:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to generate tax report');
            }
        }
    };

    const handleAddDeadline = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/tax-compliance/deadlines', {
                type: newDeadline.type,
                description: newDeadline.description,
                deadline: new Date(newDeadline.deadline),
                status: newDeadline.status
            });
            
            setDeadlines(prev => [...prev, response.data]);
            setNewDeadline({
                type: '',
                description: '',
                deadline: '',
                status: 'upcoming'
            });
            setShowAddDeadline(false);
            toast.success('New deadline added successfully!');
        } catch (error) {
            console.error('Error adding deadline:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to add deadline');
            }
        }
    };

    const handleDeadlineChange = (e) => {
        const { name, value } = e.target;
        setNewDeadline(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeadlineStatusUpdate = async (deadlineId, newStatus) => {
        try {
            const response = await axiosInstance.patch(`/tax-compliance/deadlines/${deadlineId}`, {
                status: newStatus
            });
            
            setDeadlines(prev => prev.map(d => 
                d._id === deadlineId ? response.data : d
            ));
            toast.success('Deadline status updated successfully!');
        } catch (error) {
            console.error('Error updating deadline status:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to update deadline status');
            }
        }
    };

    const handleDeadlineDelete = async (deadlineId) => {
        try {
            await axiosInstance.delete(`/tax-compliance/deadlines/${deadlineId}`);
            setDeadlines(prev => prev.filter(d => d._id !== deadlineId));
            toast.success('Deadline deleted successfully!');
        } catch (error) {
            console.error('Error deleting deadline:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
            } else {
                toast.error('Failed to delete deadline');
            }
        }
    };

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = 
                today.getDate() === i && 
                today.getMonth() === currentDate.getMonth() && 
                today.getFullYear() === currentDate.getFullYear();
            
            days.push({
                day: i,
                isToday
            });
        }

        return days;
    };

    const getDeadlinesForDay = (day) => {
        if (!day) return [];
        
        // Create a date object for the current calendar day
        const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        return deadlines.filter(deadline => {
            try {
                const deadlineDate = new Date(deadline.deadline);
                return (
                    deadlineDate.getDate() === calendarDate.getDate() &&
                    deadlineDate.getMonth() === calendarDate.getMonth() &&
                    deadlineDate.getFullYear() === calendarDate.getFullYear()
                );
            } catch (error) {
                console.error('Error comparing dates:', error);
                return false;
            }
        });
    };

    const changeMonth = (increment) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    };

    // Update the deadline display in the Upcoming Deadlines section
    const formatDeadlineDate = (date) => {
        try {
            // If date is a string, convert it to Date object
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            
            // Check if the date is valid
            if (!(dateObj instanceof Date) || isNaN(dateObj)) {
                return 'Invalid Date';
            }

            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const filterDeadlines = (deadlines) => {
        if (selectedFilter === 'all') return deadlines;
        return deadlines.filter(deadline => deadline.status === selectedFilter);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-200',
                    hover: 'hover:bg-green-50'
                };
            case 'pending':
                return {
                    bg: 'bg-orange-100',
                    text: 'text-orange-800',
                    border: 'border-orange-200',
                    hover: 'hover:bg-orange-50'
                };
            default:
                return {
                    bg: 'bg-violet-100',
                    text: 'text-violet-800',
                    border: 'border-violet-200',
                    hover: 'hover:bg-violet-50'
                };
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'gst-filing':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">File GST Return</h2>
                        <form onSubmit={handleGSTSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    GST Number
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={gstDetails.gstNumber}
                                    onChange={handleGSTInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Turnover
                                </label>
                                <input
                                    type="number"
                                    name="turnover"
                                    value={gstDetails.turnover}
                                    onChange={handleGSTInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tax Period
                                </label>
                                <input
                                    type="month"
                                    name="taxPeriod"
                                    value={gstDetails.taxPeriod}
                                    onChange={handleGSTInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Taxable Amount
                                </label>
                                <input
                                    type="number"
                                    name="taxableAmount"
                                    value={gstDetails.taxableAmount}
                                    onChange={handleGSTInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Supporting Documents
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleGSTDocumentUpload}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
                            >
                                Submit GST Return
                            </button>
                        </form>
                    </div>
                );

            case 'reports':
                return (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Tax Reports</h2>
                            <button
                                onClick={generateTaxReport}
                                className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
                            >
                                Generate New Report
                            </button>
                        </div>
                        <div className="space-y-4">
                            {taxReports.map(report => (
                                <div key={report._id || report.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {report.type}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Generated on: {formatDeadlineDate(report.generatedDate)}
                                            </p>
                                        </div>
                                        <button className="text-violet-600 hover:text-violet-800">
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Upcoming Deadlines Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
                                        <button
                                            onClick={() => setShowAddDeadline(true)}
                                            className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition-colors"
                                        >
                                            Add New Deadline
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {deadlines.map((deadline) => (
                                            <div key={deadline._id} className="border-b pb-4 last:border-b-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {deadline.type}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {deadline.description}
                                                        </p>
                                                        <p className={`font-medium mt-1 ${
                                                            deadline.status === 'completed' ? 'text-green-600' :
                                                            deadline.status === 'pending' ? 'text-orange-600' :
                                                            'text-violet-600'
                                                        }`}>
                                                            Due: {formatDeadlineDate(deadline.deadline)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-sm ${
                                                            deadline.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            deadline.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-violet-100 text-violet-800'
                                                        }`}>
                                                            {deadline.status}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeadlineDelete(deadline._id)}
                                                            className="text-red-600 hover:text-red-800 ml-2"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Section */}
                            <div>
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                                    <div className="space-y-3">
                                        {quickActions.map((action) => (
                                            <button
                                                key={action.id}
                                                onClick={action.action}
                                                className="w-full flex items-center bg-violet-50 hover:bg-violet-100 text-violet-700 py-3 px-4 rounded-lg transition-colors duration-200"
                                            >
                                                <action.icon className="w-5 h-5 mr-2" />
                                                {action.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Deadline Statistics */}
                                <div className="bg-white rounded-lg shadow p-6 mt-8">
                                    <h2 className="text-xl font-semibold mb-6">Statistics</h2>
                                    <div className="space-y-4">
                                        <div className="bg-violet-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-violet-800">Upcoming</h3>
                                                <span className="text-lg font-bold text-violet-600">
                                                    {deadlines.filter(d => d.status === 'upcoming').length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-orange-800">Pending</h3>
                                                <span className="text-lg font-bold text-orange-600">
                                                    {deadlines.filter(d => d.status === 'pending').length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-medium text-green-800">Completed</h3>
                                                <span className="text-lg font-bold text-green-600">
                                                    {deadlines.filter(d => d.status === 'completed').length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-gray-800">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar userType="startup" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Tax & Compliance
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'overview' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('gst-filing')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'gst-filing' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            GST Filing
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-2 rounded-md ${
                                activeTab === 'reports' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            Reports
                        </button>
                    </div>
                </div>

                {renderContent()}

                {/* Enhanced Calendar Modal */}
                {showCalendar && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-5xl my-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-xl font-semibold">Compliance Calendar</h2>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                                    >
                                        <option value="all">All Deadlines</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="upcoming">Upcoming</option>
                                    </select>
                                    <button
                                        onClick={() => setShowCalendar(false)}
                                        className="text-gray-500 hover:text-gray-700 sm:ml-4"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                                    {/* Month Navigation */}
                                    <div className="flex justify-between items-center bg-violet-50 p-2 sm:p-3 rounded-lg">
                                        <button
                                            onClick={() => changeMonth(-1)}
                                            className="p-1 sm:p-2 hover:bg-violet-100 rounded-full transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <h3 className="text-base sm:text-lg font-medium">
                                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <button
                                            onClick={() => changeMonth(1)}
                                            className="p-1 sm:p-2 hover:bg-violet-100 rounded-full transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                        {/* Calendar header */}
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center font-medium text-gray-600 py-1 sm:py-2 text-xs sm:text-sm">
                                                {window.innerWidth < 640 ? day.charAt(0) : day}
                                            </div>
                                        ))}
                                        {/* Calendar days */}
                                        {generateCalendarDays().map((dayInfo, index) => {
                                            const dayDeadlines = dayInfo?.day ? getDeadlinesForDay(dayInfo.day) : [];
                                            const hasDeadlines = dayDeadlines.length > 0;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg transition-all duration-200 ${
                                                        !dayInfo?.day ? 'bg-gray-50' :
                                                        dayInfo.isToday ? 'border-violet-500 border-2 shadow-sm' :
                                                        hasDeadlines ? 'border-violet-200 hover:shadow-md' :
                                                        'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {dayInfo?.day && (
                                                        <>
                                                            <div className={`font-medium text-xs sm:text-sm ${dayInfo.isToday ? 'text-violet-600' : ''}`}>
                                                                {dayInfo.day}
                                                            </div>
                                                            <div className="space-y-1 mt-1">
                                                                {dayDeadlines.map(deadline => {
                                                                    const colors = getStatusColor(deadline.status);
                                                                    return (
                                                                        <div
                                                                            key={deadline._id}
                                                                            onClick={() => setSelectedDeadline(deadline)}
                                                                            className={`text-[10px] sm:text-xs p-1 sm:p-2 rounded-md cursor-pointer ${colors.bg} ${colors.text} ${colors.hover} transition-colors duration-200`}
                                                                            title={deadline.description}
                                                                        >
                                                                            <div className="font-medium truncate">{deadline.type}</div>
                                                                            <div className="text-[8px] sm:text-xs opacity-75 hidden sm:block">{deadline.status}</div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Selected Deadline Details */}
                                {selectedDeadline && (
                                    <div className="bg-white border rounded-lg p-3 sm:p-4">
                                        <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Deadline Details</h4>
                                        <div className="space-y-2">
                                            <p className="font-medium text-sm sm:text-base">{selectedDeadline.type}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{selectedDeadline.description}</p>
                                            <p className="text-xs sm:text-sm">
                                                Due: {formatDeadlineDate(selectedDeadline.deadline)}
                                            </p>
                                            <div className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDeadline.status).bg} ${getStatusColor(selectedDeadline.status).text}`}>
                                                {selectedDeadline.status}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Deadline Modal */}
                {showAddDeadline && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Add New Deadline</h2>
                                <button
                                    onClick={() => setShowAddDeadline(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleAddDeadline} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deadline Type
                                    </label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={newDeadline.type}
                                        onChange={handleDeadlineChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                        required
                                        placeholder="e.g., GST Filing"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newDeadline.description}
                                        onChange={handleDeadlineChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                        required
                                        rows="3"
                                        placeholder="Enter deadline description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="deadline"
                                        value={newDeadline.deadline}
                                        onChange={handleDeadlineChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={newDeadline.status}
                                        onChange={handleDeadlineChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                                        required
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddDeadline(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                                    >
                                        Add Deadline
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaxCompliance;