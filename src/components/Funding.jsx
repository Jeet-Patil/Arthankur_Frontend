import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, DollarSign, Users, Calendar, PieChart } from 'lucide-react';
import Navbar from './Navbar';

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
      rejected: 0
    }
  });

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

      const response = await fetch('http://localhost:5000/api/funding', {
        method: 'POST',
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

      toast.success('Funding request submitted successfully!');
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

      // Refresh the data
      fetchFundingRequests();
      fetchDashboardStats();
    } catch (error) {
      console.error('Funding submission error:', error);
      toast.error(error.message || 'Failed to submit funding request');
    }
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
        investorInterest: 0, // You'll need to implement this
        scheduledMeetings: 0, // You'll need to implement this
        statusOverview: {
          inProgress: data.inProgress,
          approved: data.approved,
          rejected: data.rejected
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* Recent Funding Requests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Recent Funding Requests</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fundingRequests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">₹{request.maxAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{request.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create Funding Request</h2>
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
                  Submit Request
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