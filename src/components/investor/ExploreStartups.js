import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../Navbar';
import { getAllFundingRequests, getFundingRequestById, expressFundingInterest } from '../../services/api';
import { Search, DollarSign, Briefcase, Tag, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ExploreStartups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedFundingStage, setSelectedFundingStage] = useState('');
    const [filteredStartups, setFilteredStartups] = useState([]);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [interestedLoading, setInterestedLoading] = useState(false);
    const [interestMessage, setInterestMessage] = useState('');

    const filterStartups = useCallback(() => {
        let filtered = [...startups];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(startup => 
                startup.title.toLowerCase().includes(query) || 
                startup.description.toLowerCase().includes(query)
            );
        }

        // Apply industry filter
        if (selectedIndustry) {
            filtered = filtered.filter(startup => 
                startup.type === selectedIndustry
            );
        }

        // Apply funding stage filter
        if (selectedFundingStage) {
            filtered = filtered.filter(startup => 
                startup.type === selectedFundingStage
            );
        }

        setFilteredStartups(filtered);
    }, [startups, searchQuery, selectedIndustry, selectedFundingStage]);

    useEffect(() => {
        fetchStartups();
    }, []);

    useEffect(() => {
        // Apply filters whenever search query or filters change
        filterStartups();
    }, [filterStartups]);

    const fetchStartups = async () => {
        try {
            setLoading(true);
            const data = await getAllFundingRequests();
            console.log("Fetched startup funding data:", data);
            setStartups(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching startups:", error);
            toast.error("Failed to load startup data");
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = async (startupId) => {
        try {
            const startupDetails = await getFundingRequestById(startupId);
            setSelectedStartup(startupDetails);
            setShowDetailsModal(true);
        } catch (error) {
            console.error("Error fetching startup details:", error);
            toast.error("Failed to load startup details");
        }
    };

    const handleInterest = async () => {
        if (!selectedStartup) return;
        
        try {
            setInterestedLoading(true);
            await expressFundingInterest(selectedStartup._id, interestMessage);
            toast.success("Interest expressed successfully!");
            setShowDetailsModal(false);
            setSelectedStartup(null);
            setInterestMessage('');
            // Refresh data to update UI
            fetchStartups();
        } catch (error) {
            console.error("Error expressing interest:", error);
            toast.error(error.error || "Failed to express interest");
        } finally {
            setInterestedLoading(false);
        }
    };

    const checkIfAlreadyInterested = (startup) => {
        const userId = localStorage.getItem('userId');
        if (!userId || !startup?.interests) return false;
        return startup.interests.some(interest => interest.investorId === userId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Explore Startups</h1>
                    <p className="text-gray-600 mb-8">
                        Discover promising startups looking for investment. Use the filters to find startups that match your investment criteria.
                    </p>
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search startups by name, description, location etc."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="">All Investment Types</option>
                                <option value="equity">Equity</option>
                                <option value="debt">Debt</option>
                                <option value="grant">Grant</option>
                                <option value="crowdfunding">Crowdfunding</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={selectedFundingStage}
                                onChange={(e) => setSelectedFundingStage(e.target.value)}
                            >
                                <option value="">Funding Type</option>
                                <option value="equity">Equity</option>
                                <option value="debt">Debt</option>
                                <option value="grant">Grant</option>
                                <option value="crowdfunding">Crowdfunding</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Stats for available funding opportunities */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-violet-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-violet-100 p-3 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Investment Opportunities</p>
                                    <p className="text-2xl font-semibold text-gray-800">{filteredStartups.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-violet-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-violet-100 p-3 rounded-lg">
                                    <Briefcase className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average Funding Request</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {filteredStartups.length > 0 
                                            ? formatCurrency(filteredStartups.reduce((sum, startup) => 
                                                sum + (startup.maxAmount + startup.minAmount) / 2, 0) / filteredStartups.length) 
                                            : "₹0"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-violet-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-violet-100 p-3 rounded-lg">
                                    <Tag className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Most Common Type</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {filteredStartups.length > 0 
                                            ? (Object.entries(filteredStartups.reduce((types, startup) => {
                                                types[startup.type] = (types[startup.type] || 0) + 1;
                                                return types;
                                              }, {})).sort((a, b) => b[1] - a[1])[0][0].charAt(0).toUpperCase() + 
                                              Object.entries(filteredStartups.reduce((types, startup) => {
                                                types[startup.type] = (types[startup.type] || 0) + 1;
                                                return types;
                                              }, {})).sort((a, b) => b[1] - a[1])[0][0].slice(1))
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center my-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                        </div>
                    ) : filteredStartups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStartups.map((startup) => (
                                <div key={startup._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="bg-violet-600 h-3"></div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{startup.title}</h3>
                                        
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 mr-2">
                                                {startup.type.charAt(0).toUpperCase() + startup.type.slice(1)}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {startup.status === 'in_progress' ? 'Active' : 
                                                 startup.status === 'approved' ? 'Funded' : 
                                                 startup.status === 'rejected' ? 'Closed' : 'Pending'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {startup.description}
                                        </p>
                                        
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Funding Range</p>
                                                <p className="text-sm font-medium">
                                                    {formatCurrency(startup.minAmount)} - {formatCurrency(startup.maxAmount)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Timeline</p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(startup.startDate)} - {formatDate(startup.endDate)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                                            <button 
                                                className="text-violet-600 font-medium hover:text-violet-800"
                                                onClick={() => handleViewDetails(startup._id)}
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                className={`px-4 py-1 rounded text-white ${
                                                  checkIfAlreadyInterested(startup) 
                                                    ? 'bg-green-600 hover:bg-green-700' 
                                                    : 'bg-violet-600 hover:bg-violet-700'
                                                }`}
                                                onClick={() => {
                                                  if (checkIfAlreadyInterested(startup)) {
                                                    toast.success("You've already expressed interest in this startup");
                                                  } else {
                                                    handleViewDetails(startup._id);
                                                  }
                                                }}
                                            >
                                                {checkIfAlreadyInterested(startup) ? 'Interested' : "I'm Interested"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No startups found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Startup Details Modal */}
            {showDetailsModal && selectedStartup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-semibold text-gray-900">{selectedStartup.title}</h2>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Funding Details</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Type:</span> {selectedStartup.type.charAt(0).toUpperCase() + selectedStartup.type.slice(1)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Range:</span> {formatCurrency(selectedStartup.minAmount)} - {formatCurrency(selectedStartup.maxAmount)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Timeline:</span> {formatDate(selectedStartup.startDate)} - {formatDate(selectedStartup.endDate)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Status:</span> {selectedStartup.status === 'in_progress' ? 'Active' : 
                                                 selectedStartup.status === 'approved' ? 'Funded' : 
                                                 selectedStartup.status === 'rejected' ? 'Closed' : 'Pending'}
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Investor Interest</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Total Interests:</span> {selectedStartup.interests?.length || 0}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 whitespace-pre-line">{selectedStartup.description}</p>
                            </div>
                            
                            {!checkIfAlreadyInterested(selectedStartup) && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Express Interest</h3>
                                    <textarea
                                        placeholder="Why are you interested in this startup? (Optional)"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[100px]"
                                        value={interestMessage}
                                        onChange={(e) => setInterestMessage(e.target.value)}
                                    ></textarea>
                                    
                                    <button
                                        className="mt-4 w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={handleInterest}
                                        disabled={interestedLoading}
                                    >
                                        {interestedLoading ? 'Processing...' : "I'm Interested"}
                                    </button>
                                </div>
                            )}
                            
                            {checkIfAlreadyInterested(selectedStartup) && (
                                <div className="bg-green-50 p-4 rounded-lg mb-6">
                                    <p className="text-green-800 font-medium">You have already expressed interest in this startup.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExploreStartups;
