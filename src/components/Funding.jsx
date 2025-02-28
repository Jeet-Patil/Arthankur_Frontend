import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, DollarSign, Users, Calendar, PieChart } from 'lucide-react';
import Navbar from './Navbar';
import { acceptFundingInterest, deleteFundingRequest } from '../services/api';

const Funding = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'equity', // default value
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    description: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    attachments: []
  });
  const [fundingRequests, setFundingRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalFunding: "₹0",
    activeRequests: 0,
    investorInterest: 0,
    scheduledMeetings: 0,
    statusOverview: {
      inProgress: 0,
      approved: 0,
      rejected: 0,
      pending: 0
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [currentFundingId, setCurrentFundingId] = useState(null);

  // Get userType from localStorage
  const userType = localStorage.getItem('userType');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      const token = localStorage.getItem('token');
      
      console.log('Form data being sent:', formData); // Debug log

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'attachments') {
          formData.attachments.forEach(file => {
            formDataToSend.append('attachments', file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Making request to backend...'); // Debug log

      const response = await fetch(editMode ? `http://localhost:5000/api/funding/${currentFundingId}` : 'http://localhost:5000/api/funding', {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Response from server:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit funding request');
      }

      toast.success(editMode ? 'Funding request updated successfully!' : 'Funding request submitted successfully!');
      setShowForm(false);
      // Reset form
      setFormData({
        title: '',
        type: 'equity',
        minAmount: '',
        maxAmount: '',
        startDate: '',
        endDate: '',
        description: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        attachments: []
      });
      setEditMode(false);
      setCurrentFundingId(null);

      // Refresh the data
      fetchFundingRequests();
      fetchDashboardStats();
    } catch (error) {
      console.error('Funding submission error:', error);
      toast.error(error.message || 'Failed to submit funding request');
    }
  };

  // Add function to calculate dashboard statistics from funding requests
  const calculateDashboardStats = (fundingRequests) => {
    // Initialize stat counters
    let totalFundingAmount = 0;
    let activeRequestsCount = 0;
    let totalInterestsCount = 0;
    let statusCounts = {
      pending: 0,
      in_progress: 0,
      approved: 0,
      rejected: 0
    };

    // Loop through funding requests to calculate stats
    fundingRequests.forEach(request => {
      // Add to total funding amount
      totalFundingAmount += request.maxAmount;
      
      // Count active requests (pending or in_progress)
      if (request.status === 'pending' || request.status === 'in_progress') {
        activeRequestsCount++;
      }
      
      // Count total interests
      if (request.interests && Array.isArray(request.interests)) {
        totalInterestsCount += request.interests.length;
      }
      
      // Count by status
      if (statusCounts.hasOwnProperty(request.status)) {
        statusCounts[request.status]++;
      }
    });

    // Return formatted stats
    return {
      totalFunding: `₹${totalFundingAmount.toLocaleString()}`,
      activeRequests: activeRequestsCount,
      investorInterest: totalInterestsCount,
      scheduledMeetings: 0, // This would need a different data source
      statusOverview: {
        inProgress: statusCounts.in_progress,
        approved: statusCounts.approved,
        rejected: statusCounts.rejected,
        pending: statusCounts.pending
      }
    };
  };

  // Add this function to fetch funding requests
  const fetchFundingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/funding', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch funding requests');
      }

      const data = await response.json();
      setFundingRequests(data);
      console.log("Funding requests with interests:", data);
      
      // Calculate and update dashboard stats based on actual funding requests
      const stats = calculateDashboardStats(data);
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error fetching funding requests:', error);
      toast.error('Failed to load funding requests');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/funding/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setDashboardStats({
        totalFunding: `₹${data.totalFundingRequested.toLocaleString()}`,
        activeRequests: data.totalRequests,
        investorInterest: data.totalInterests || 0, // Updated to show total interests
        scheduledMeetings: 0, // You'll need to implement this
        statusOverview: {
          inProgress: data.inProgress,
          approved: data.approved,
          rejected: data.rejected,
          pending: data.pending
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  // Add a function to handle accepting investor interest
  const handleAcceptInterest = async (fundingId, interestId) => {
    try {
      await acceptFundingInterest(fundingId, interestId);
      toast.success('Investor interest accepted successfully!');
      
      // Refresh the data
      fetchFundingRequests();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error accepting interest:', error);
      toast.error('Failed to accept investor interest');
    }
  };

  // Add this function to handle editing a funding request
  const handleEditFunding = (funding) => {
    setFormData({
      title: funding.title,
      type: funding.type,
      minAmount: funding.minAmount,
      maxAmount: funding.maxAmount,
      startDate: new Date(funding.startDate).toISOString().split('T')[0],
      endDate: new Date(funding.endDate).toISOString().split('T')[0],
      description: funding.description,
      bankName: funding.bankDetails.bankName,
      accountNumber: funding.bankDetails.accountNumber,
      ifscCode: funding.bankDetails.ifscCode,
      accountHolderName: funding.bankDetails.accountHolderName,
      attachments: []
    });
    setEditMode(true);
    setCurrentFundingId(funding._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // Update the handleDeleteFunding function
  const handleDeleteFunding = async (fundingId) => {
    if (!window.confirm('Are you sure you want to delete this funding request?')) {
      return;
    }

    try {
      await deleteFundingRequest(fundingId);
      toast.success('Funding request deleted successfully');
      // Refresh the list
      fetchFundingRequests();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting funding request:', error);
      toast.error(error.error || 'Failed to delete funding request');
    }
  };

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    fetchFundingRequests();
    fetchDashboardStats();
  }, []);

  return (
    <>
      <Navbar userType={userType} />
      <div className="max-w-7xl mx-auto p-6 mt-16"> {/* Added mt-16 for navbar spacing */}
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Funding Dashboard</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Funding Request
          </button>
        </div>

        {!showForm ? (
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Funding Raised</p>
                    <h3 className="text-xl font-bold text-gray-900">{dashboardStats.totalFunding}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <PieChart className="h-10 w-10 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Requests</p>
                    <h3 className="text-xl font-bold text-gray-900">{dashboardStats.activeRequests}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Users className="h-10 w-10 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Investor Interest</p>
                    <h3 className="text-xl font-bold text-gray-900">{dashboardStats.investorInterest}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Calendar className="h-10 w-10 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Scheduled Meetings</p>
                    <h3 className="text-xl font-bold text-gray-900">{dashboardStats.scheduledMeetings}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Funding Status Overview</h2>
              <div className="grid grid-cols-1 gap-6">
                {/* Status cards with progress bars */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-yellow-700">In Progress</span>
                    <span className="font-medium text-yellow-700">
                      {dashboardStats.statusOverview.inProgress} / {fundingRequests.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${fundingRequests.length ? (dashboardStats.statusOverview.inProgress / fundingRequests.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-green-700">Approved</span>
                    <span className="font-medium text-green-700">
                      {dashboardStats.statusOverview.approved} / {fundingRequests.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${fundingRequests.length ? (dashboardStats.statusOverview.approved / fundingRequests.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-red-700">Rejected</span>
                    <span className="font-medium text-red-700">
                      {dashboardStats.statusOverview.rejected} / {fundingRequests.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${fundingRequests.length ? (dashboardStats.statusOverview.rejected / fundingRequests.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-blue-700">Pending</span>
                    <span className="font-medium text-blue-700">
                      {dashboardStats.statusOverview.pending} / {fundingRequests.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${fundingRequests.length ? (dashboardStats.statusOverview.pending / fundingRequests.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Original status cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-700">In Progress</span>
                    <span className="text-2xl font-bold text-yellow-700">
                      {dashboardStats.statusOverview.inProgress}
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Approved</span>
                    <span className="text-2xl font-bold text-green-700">
                      {dashboardStats.statusOverview.approved}
                    </span>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">Rejected</span>
                    <span className="text-2xl font-bold text-red-700">
                      {dashboardStats.statusOverview.rejected}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Pending</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {dashboardStats.statusOverview.pending}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Funding Requests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Recent Funding Requests</h2>
              <div className="mt-8 grid grid-cols-1 gap-6">
                {fundingRequests.map((request) => (
                  <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{request.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Pending' :
                             request.status === 'in_progress' ? 'In Progress' :
                             request.status === 'approved' ? 'Approved' :
                             'Rejected'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Min Amount</p>
                            <p className="font-semibold">₹{request.minAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Max Amount</p>
                            <p className="font-semibold">₹{request.maxAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-semibold">{new Date(request.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-semibold">{new Date(request.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{request.description}</p>
                      </div>
                    </div>
                    
                    {/* Investor Interest Section */}
                    {request.interests && request.interests.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-lg font-semibold mb-3">Investor Interests ({request.interests.length})</h4>
                        <div className="space-y-4">
                          {request.interests.map((interest, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">{interest.name}</span>
                                <span className="text-sm text-gray-500">{new Date(interest.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-700">{interest.email}</p>
                              {interest.message && (
                                <p className="mt-2 text-gray-600 italic">"{interest.message}"</p>
                              )}
                              <div className="mt-3 flex space-x-3">
                                <button 
                                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                                  onClick={() => window.location.href = `mailto:${interest.email}`}
                                >
                                  Contact Investor
                                </button>
                                
                                {interest.status === 'pending' && (
                                  <button 
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                                    onClick={() => handleAcceptInterest(request._id, interest._id)}
                                  >
                                    Accept Interest
                                  </button>
                                )}
                                
                                {interest.status === 'accepted' && (
                                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm inline-flex items-center">
                                    Accepted
                                  </span>
                                )}
                                
                                {interest.status === 'rejected' && (
                                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded text-sm inline-flex items-center">
                                    Rejected
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-4">
                      <button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
                        onClick={() => handleEditFunding(request)}
                      >
                        Edit
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                        onClick={() => handleDeleteFunding(request._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">{editMode ? 'Edit Funding Request' : 'Create Funding Request'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Funding Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Funding Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="equity">Equity Funding</option>
                    <option value="debt">Debt Funding</option>
                    <option value="grant">Grant</option>
                    <option value="crowdfunding">Crowdfunding</option>
                  </select>
                </div>
              </div>

              {/* Amount Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Banking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Banking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload any relevant documents (business plan, financial projections, etc.)
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editMode ? 'Update Request' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Funding;