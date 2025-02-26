import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, DollarSign, Percent, Clock, FileText } from 'lucide-react';
import Navbar from './Navbar';
import BankEligibility from './loans/BankEligibility';

const Loans = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loanTitle: '',
    loanType: 'business', // default value
    amount: '',
    purpose: '',
    tenure: '',
    businessDetails: {
      businessName: '',
      businessType: '',
      yearEstablished: '',
      annualRevenue: ''
    },
    documents: []
  });

  const [loanStats, setLoanStats] = useState({
    totalLoans: "₹0",
    activeApplications: 0,
    approvedLoans: 0,
    averageInterestRate: "0%"
  });

  const [loanApplications, setLoanApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userType = localStorage.getItem('userType');
  const [step, setStep] = useState('initial'); // 'initial', 'eligibility', 'application'
  const [selectedBank, setSelectedBank] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('business')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessDetails: {
          ...prev.businessDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: files
    }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setStep('eligibility');
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep('application');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData();
        const token = localStorage.getItem('token');
        
        console.log('Selected Bank:', selectedBank); // Debug log
        console.log('Form data being sent:', formData); // Debug log

        // Append basic loan details
        formDataToSend.append('loanTitle', formData.loanTitle);
        formDataToSend.append('loanType', formData.loanType);
        formDataToSend.append('amount', formData.amount);
        formDataToSend.append('purpose', formData.purpose);
        formDataToSend.append('tenure', formData.tenure);

        // Fix bank details appending
        formDataToSend.append('bankName', selectedBank.name);
        formDataToSend.append('bankInterestRate', selectedBank.interestRate);
        formDataToSend.append('bankProcessingFee', selectedBank.processingFee);

        // Append business details
        formDataToSend.append('businessName', formData.businessDetails.businessName);
        formDataToSend.append('businessType', formData.businessDetails.businessType);
        formDataToSend.append('yearEstablished', formData.businessDetails.yearEstablished);
        formDataToSend.append('annualRevenue', formData.businessDetails.annualRevenue);

        // Append documents
        formData.documents.forEach(file => {
            formDataToSend.append('documents', file);
        });

        console.log('Making request to backend...'); // Debug log

        const response = await fetch('http://localhost:5000/api/loans', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
        });

        const data = await response.json();
        console.log('Response from server:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit loan application');
        }

        toast.success('Loan application submitted successfully!');
        setShowForm(false);
        // Reset form and state
        setFormData({
            loanTitle: '',
            loanType: 'business',
            amount: '',
            purpose: '',
            tenure: '',
            businessDetails: {
                businessName: '',
                businessType: '',
                yearEstablished: '',
                annualRevenue: ''
            },
            documents: []
        });
        setSelectedBank(null);
        setStep('initial');

        // Refresh the data immediately after successful submission
        await Promise.all([
            fetchLoanApplications(),
            fetchLoanStats()
        ]);
    } catch (error) {
        console.error('Loan submission error:', error);
        toast.error(error.message || 'Failed to submit loan application');
    }
  };

  const fetchLoanApplications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/loans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch loan applications');
      }

      const data = await response.json();
      console.log('Fetched loan applications:', data); // Debug log
      setLoanApplications(data);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      toast.error('Failed to load loan applications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLoanStats = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/loans/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch loan statistics');
        }

        const data = await response.json();
        setLoanStats({
            totalLoans: `₹${data.totalLoans.toLocaleString()}`,
            activeApplications: data.activeApplications,
            approvedLoans: data.approvedLoans,
            averageInterestRate: `${data.averageInterestRate.toFixed(2)}%`
        });
    } catch (error) {
        console.error('Error fetching loan statistics:', error);
    }
  };

  // Add useEffect to fetch data when component mounts
  useEffect(() => {
    fetchLoanApplications();
    fetchLoanStats();
  }, []);

  const renderContent = () => {
    switch (step) {
      case 'initial':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Loan Details</h2>
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Title
                  </label>
                  <input
                    type="text"
                    name="loanTitle"
                    value={formData.loanTitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Type
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                  >
                    <option value="business">Business Loan</option>
                    <option value="equipment">Equipment Loan</option>
                    <option value="working_capital">Working Capital Loan</option>
                    <option value="term_loan">Term Loan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Tenure (months)
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loan Purpose
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  required
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="business.businessName"
                      value={formData.businessDetails.businessName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <input
                      type="text"
                      name="business.businessType"
                      value={formData.businessDetails.businessType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="business.yearEstablished"
                      value={formData.businessDetails.yearEstablished}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Annual Revenue
                    </label>
                    <input
                      type="number"
                      name="business.annualRevenue"
                      value={formData.businessDetails.annualRevenue}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload business documents, financial statements, and other relevant documents
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                >
                  Check Eligibility
                </button>
              </div>
            </form>
          </div>
        );

      case 'eligibility':
        return (
          <BankEligibility
            loanDetails={formData}
            onBankSelect={handleBankSelect}
            onBack={() => setStep('initial')}
          />
        );

      case 'application':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Loan Application - {selectedBank.name}</h2>
              <button
                onClick={() => setStep('eligibility')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Banks
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Title
                  </label>
                  <input
                    type="text"
                    name="loanTitle"
                    value={formData.loanTitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Type
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                  >
                    <option value="business">Business Loan</option>
                    <option value="equipment">Equipment Loan</option>
                    <option value="working_capital">Working Capital Loan</option>
                    <option value="term_loan">Term Loan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Tenure (months)
                  </label>
                  <input
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loan Purpose
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  required
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="business.businessName"
                      value={formData.businessDetails.businessName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <input
                      type="text"
                      name="business.businessType"
                      value={formData.businessDetails.businessType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="business.yearEstablished"
                      value={formData.businessDetails.yearEstablished}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Annual Revenue
                    </label>
                    <input
                      type="number"
                      name="business.annualRevenue"
                      value={formData.businessDetails.annualRevenue}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload business documents, financial statements, and other relevant documents
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="max-w-7xl mx-auto p-6 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Loan Dashboard</h1>
          {step === 'initial' && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Apply for Loan
            </button>
          )}
        </div>

        {!showForm ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-violet-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Loan Amount</p>
                    <h3 className="text-xl font-bold text-gray-900">{loanStats.totalLoans}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-violet-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Applications</p>
                    <h3 className="text-xl font-bold text-gray-900">{loanStats.activeApplications}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Clock className="h-10 w-10 text-violet-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Approved Loans</p>
                    <h3 className="text-xl font-bold text-gray-900">{loanStats.approvedLoans}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Percent className="h-10 w-10 text-violet-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg. Interest Rate</p>
                    <h3 className="text-xl font-bold text-gray-900">{loanStats.averageInterestRate}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Recent Loan Applications</h2>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading applications...</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bank
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
                      {loanApplications.length > 0 ? (
                        loanApplications.map((loan) => (
                          <tr key={loan._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{loan.loanTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                {loan.bank ? (
                                  <>
                                    <div className="text-sm font-medium text-gray-900">{loan.bank.name}</div>
                                    <div className="text-xs text-gray-500">
                                      Interest: {loan.bank.interestRate}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">Not specified</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">₹{loan.amount.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1).replace('_', ' ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(loan.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No loan applications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </>
  );
};

export default Loans; 