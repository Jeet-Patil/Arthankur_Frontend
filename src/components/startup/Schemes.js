import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../Navbar';
import EligibilityCheck from './EligibilityCheck';
import EligibilityResults from './EligibilityResults';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getUserData } from '../../utils/auth';

const Schemes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState(''); // Change default to empty string to show all schemes
    const [schemes, setSchemes] = useState([]);
    const [allSchemes, setAllSchemes] = useState([]);
    const [showEligibilityForm, setShowEligibilityForm] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [eligibilityResults, setEligibilityResults] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eligibleIds, setEligibleIds] = useState([]);

    // Fetch all schemes
    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                console.log('Fetching government schemes from API');
                const response = await axios.get('http://localhost:5000/api/government-schemes');
                console.log('Schemes received:', response.data);
                
                // Transform backend data to match frontend format
                const transformedSchemes = response.data.map(scheme => ({
                    id: scheme._id,
                    title: scheme.name,
                    ministry: scheme.ministry,
                    description: scheme.description,
                    colorClass: getRandomColorClass(),
                    details: [
                        { label: 'Funding Amount', value: scheme.fundingAmount },
                        { label: 'Target Audience', value: scheme.targetAudience }
                    ],
                    website: scheme.applicationLink,
                    applicationUrl: scheme.applicationLink,
                    eligibilityCriteria: {
                        startupStage: scheme.eligibility.startupStages || [],
                        industryType: scheme.eligibility.industryTypes || [],
                        annualRevenue: scheme.eligibility.annualRevenue || [],
                        employees: scheme.eligibility.employeeRanges ? 
                            scheme.eligibility.employeeRanges.map(range => `${range} employees`) : [],
                        registeredLocation: scheme.eligibility.locations || [],
                        existingSupport: scheme.eligibility.existingSupport === null ? 
                            ['none', 'incubation', 'funding', 'tax', 'multiple'] : 
                            scheme.eligibility.existingSupport ? ['multiple'] : ['none']
                    }
                }));
                
                setAllSchemes(transformedSchemes);
                // Don't set schemes yet - we'll set it after filtering for eligibility
            } catch (error) {
                console.error('Error fetching schemes:', error);
                toast.error('Failed to fetch government schemes.');
                setLoading(false);
            }
        };
        
        fetchSchemes();
    }, []);

    // Helper function to get a random color class for scheme cards
    const getRandomColorClass = () => {
        const colors = [
            'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 
            'bg-orange-50', 'bg-pink-50', 'bg-indigo-50', 'bg-red-50'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Fetch user profile data and check eligibility
    useEffect(() => {
        const fetchUserProfileAndCheckEligibility = async () => {
            setLoading(true);
            const userData = getUserData();
            
            console.log('Auth data retrieved:', userData);
            
            if (!userData.token || !userData.userId) {
                console.error('No authentication details found');
                setLoading(false);
                return;
            }
            
            try {
                console.log('Fetching user profile for eligibility check');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': userData.token
                    }
                };
                
                const response = await axios.get(`http://localhost:5000/api/users/me`, config);
                console.log('User profile received:', response.data);
                
                // Log all fields that might be used for eligibility
                console.log('Profile fields for eligibility check:', {
                    userType: response.data.userType,
                    startupStage: response.data.startupStage,
                    industry: response.data.industry,
                    industryType: response.data.industryType,
                    annualRevenue: response.data.annualRevenue,
                    numberOfEmployees: response.data.numberOfEmployees,
                    location: response.data.location,
                    registeredLocation: response.data.registeredLocation,
                    existingGovernmentSupport: response.data.existingGovernmentSupport,
                    hasExistingSupport: response.data.hasExistingSupport
                });
                
                setUserProfile(response.data);
                
                // Fetch eligibility from the API
                try {
                    console.log(`Calling eligibility endpoint: /api/government-schemes/eligibility/${response.data._id}`);
                    const eligibilityResponse = await axios.get(
                        `http://localhost:5000/api/government-schemes/eligibility/${response.data._id}`,
                        config
                    );
                    console.log('Eligibility results from API:', eligibilityResponse.data);
                    
                    // Filter eligible schemes
                    const eligibleSchemes = eligibilityResponse.data.filter(result => result.eligible);
                    console.log('Filtered eligible schemes count:', eligibleSchemes.length);
                    console.log('Eligible schemes:', eligibleSchemes.map(s => s.schemeName));
                    
                    setEligibilityResults(eligibleSchemes);
                    const eligibleIds = eligibleSchemes.map(scheme => scheme.schemeId);
                    setEligibleIds(eligibleIds);
                    
                    // Show all schemes but highlight eligible ones
                    setSchemes(allSchemes);
                    
                    // Display a success toast if eligible schemes were found
                    if (eligibleSchemes.length > 0) {
                        toast.success(`You're eligible for ${eligibleSchemes.length} government schemes!`);
                    } else {
                        toast.info('We couldn\'t find any eligible schemes. Try updating your profile information.');
                    }
                } catch (eligibilityError) {
                    console.error('Error fetching eligibility:', eligibilityError);
                    console.log('Falling back to client-side eligibility check');
                    toast.error('Error fetching eligibility. Using fallback method.');
                    
                    // Fall back to client-side eligibility check
                    if (allSchemes.length > 0) {
                        performClientSideEligibilityCheck(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        
        if (allSchemes.length > 0) {
            fetchUserProfileAndCheckEligibility();
        }
    }, [allSchemes]);
    
    // Client-side eligibility check (fallback method)
    const performClientSideEligibilityCheck = (profileData) => {
        if (!profileData || !allSchemes.length) return;
        
        console.log('Performing client-side eligibility check with profile:', profileData);
        
        const eligibleSchemes = [];
        const eligibleIds = [];
        
        allSchemes.forEach(scheme => {
            console.log(`Checking eligibility for scheme: ${scheme.title}`);
            
            // Map the frontend scheme criteria to match the backend model format
            const criteria = {
                startupStages: scheme.eligibilityCriteria.startupStage,
                industryTypes: scheme.eligibilityCriteria.industryType,
                annualRevenue: scheme.eligibilityCriteria.annualRevenue,
                employeeRanges: scheme.eligibilityCriteria.employees.map(e => e.replace(' employees', '')),
                locations: scheme.eligibilityCriteria.registeredLocation,
                existingSupport: scheme.eligibilityCriteria.existingSupport.includes('none') ? false : 
                                scheme.eligibilityCriteria.existingSupport.includes('multiple') ? true : null
            };
            
            // Map user profile to match eligible criteria format
            const userData = {
                userType: 'startup', // Assume this is a startup user
                startupStage: mapStartupStage(profileData.startupStage || ''),
                industry: profileData.industry || profileData.industryType || '',
                annualRevenue: profileData.annualRevenue || '',
                numberOfEmployees: profileData.numberOfEmployees || '',
                location: profileData.location || profileData.registeredLocation || '',
                existingGovernmentSupport: profileData.existingGovernmentSupport || 'No'
            };
            
            // Check eligibility using local function
            let matchCount = 0;
            let requiredMatches = 3; // Only need 3 out of 6 criteria to match
            
            // Perform the eligibility checks
            let matches = [];
            let mismatches = [];
            
            // Check startup stage
            if (criteria.startupStages && criteria.startupStages.includes(userData.startupStage)) {
                matchCount++;
                matches.push(`Startup stage: ${userData.startupStage}`);
            } else {
                mismatches.push(`Startup stage: User has ${userData.startupStage}, needs one of [${criteria.startupStages?.join(', ')}]`);
            }
            
            // Check industry
            if (criteria.industryTypes && criteria.industryTypes.includes(userData.industry)) {
                matchCount++;
                matches.push(`Industry: ${userData.industry}`);
            } else {
                mismatches.push(`Industry: User has ${userData.industry}, needs one of [${criteria.industryTypes?.join(', ')}]`);
            }
            
            // Check revenue
            if (criteria.annualRevenue && criteria.annualRevenue.includes(userData.annualRevenue)) {
                matchCount++;
                matches.push(`Revenue: ${userData.annualRevenue}`);
            } else {
                mismatches.push(`Revenue: User has ${userData.annualRevenue}, needs one of [${criteria.annualRevenue?.join(', ')}]`);
            }
            
            // Check employees
            const mappedEmployeeCount = mapEmployeeCount(userData.numberOfEmployees);
            if (criteria.employeeRanges && criteria.employeeRanges.includes(mappedEmployeeCount)) {
                matchCount++;
                matches.push(`Employees: ${mappedEmployeeCount}`);
            } else {
                mismatches.push(`Employees: User has ${mappedEmployeeCount}, needs one of [${criteria.employeeRanges?.join(', ')}]`);
            }
            
            // Check location
            if (criteria.locations && criteria.locations.includes(userData.location)) {
                matchCount++;
                matches.push(`Location: ${userData.location}`);
            } else {
                mismatches.push(`Location: User has ${userData.location}, needs one of [${criteria.locations?.join(', ')}]`);
            }
            
            // Check support
            const userHasSupport = userData.existingGovernmentSupport === 'Yes';
            if (criteria.existingSupport === null || criteria.existingSupport === userHasSupport) {
                matchCount++;
                matches.push(`Government support: ${userHasSupport}`);
            } else {
                mismatches.push(`Government support: User has ${userHasSupport}, needs ${criteria.existingSupport}`);
            }
            
            console.log(`Scheme: ${scheme.title}`);
            console.log(`Matches (${matches.length}): ${matches.join(', ')}`);
            console.log(`Mismatches (${mismatches.length}): ${mismatches.join(', ')}`);
            console.log(`Total match count: ${matchCount}/${requiredMatches} required`);
            
            if (matchCount >= requiredMatches) {
                console.log(`ELIGIBLE for scheme: ${scheme.title}`);
                eligibleSchemes.push(scheme);
                eligibleIds.push(scheme.id);
            } else {
                console.log(`NOT ELIGIBLE for scheme: ${scheme.title}`);
            }
        });
        
        console.log('Total eligible schemes found client-side:', eligibleSchemes.length);
        setEligibilityResults(eligibleSchemes);
        setEligibleIds(eligibleIds);
        
        // Show all schemes but highlight eligible ones
        setSchemes(allSchemes);
        
        // Display a toast notification with the results
        if (eligibleSchemes.length > 0) {
            toast.success(`You're eligible for ${eligibleSchemes.length} government schemes!`);
        } else {
            toast.info('We couldn\'t find any eligible schemes. Try updating your profile information.');
        }
    };
    
    // Filter schemes based on eligibility IDs
    const filterSchemesByEligibility = (eligibleIds) => {
        if (!allSchemes.length) return;
        
        // Show all schemes but mark eligible ones
        setSchemes(allSchemes);
    };
    
    // Helper function to map startup stage values
    const mapStartupStage = (stage) => {
        if (!stage) return 'Idea'; // Default to 'Idea' instead of empty string
        
        // Map from registration form values to criteria values
        const stageMap = {
            'Idea': 'Ideation',
            'Prototype': 'Validation',
            'Early Stage': 'Early Traction',
            'Growth': 'Scaling',
            'Mature': 'Established'
        };
        
        return stageMap[stage] || stage;
    };

    // Helper function to map raw employee count to range format
    const mapEmployeeCount = (count) => {
        if (!count) return '';
        const num = parseInt(count);
        if (isNaN(num)) return count; // If it's already a string like "1-5 employees", use it as is
        if (num <= 5) return '1-5';
        if (num <= 20) return '6-20';
        if (num <= 50) return '21-50';
        if (num <= 100) return '51-100';
        return 'More than 100';
    };

    const filterSchemes = useCallback(() => {
        let filteredSchemes = [...allSchemes];

        if (searchTerm) {
            filteredSchemes = filteredSchemes.filter(scheme => 
                scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category) {
            filteredSchemes = filteredSchemes.filter(scheme => {
                if (category === 'financial') return scheme.description.toLowerCase().includes('financial') || scheme.description.toLowerCase().includes('fund');
                if (category === 'tax') return scheme.description.toLowerCase().includes('tax');
                if (category === 'incubation') return scheme.description.toLowerCase().includes('incubat');
                if (category === 'research') return scheme.description.toLowerCase().includes('research') || scheme.description.toLowerCase().includes('r&d');
                if (category === 'msme') return scheme.ministry.toLowerCase().includes('msme');
                if (category === 'eligible') return eligibleIds.includes(scheme.id);
                if (category === 'not-eligible') return !eligibleIds.includes(scheme.id);
                return true;
            });
        }

        setSchemes(filteredSchemes);
    }, [searchTerm, category, eligibleIds, allSchemes]);

    useEffect(() => {
        filterSchemes();
    }, [filterSchemes, category, searchTerm]);

    const handleEligibilityCheck = (formData) => {
        if (allSchemes.length === 0) {
            toast.error('No schemes available to check eligibility against');
            return;
        }

        const matchingSchemes = allSchemes.filter(scheme => {
            const criteria = scheme.eligibilityCriteria;
            
            // Check if the startup's data matches the scheme's eligibility criteria
            const stageMatch = criteria.startupStage.includes(formData.startupStage);
            const industryMatch = criteria.industryType.includes(formData.industryType);
            const revenueMatch = criteria.annualRevenue.includes(formData.annualRevenue);
            const employeesMatch = criteria.employees.includes(formData.employees);
            const locationMatch = criteria.registeredLocation.includes(formData.registeredLocation);
            const supportMatch = criteria.existingSupport.includes(formData.existingSupport);
            
            // A scheme is eligible if it matches at least 5 out of 6 criteria
            const matchCount = [stageMatch, industryMatch, revenueMatch, employeesMatch, locationMatch, supportMatch]
                .filter(match => match).length;
            
            return matchCount >= 5;
        });

        setEligibilityResults(matchingSchemes);
        setShowEligibilityForm(false);
        setShowResults(true);
    };

    const openEligibilityForm = () => {
        setShowEligibilityForm(true);
    };

    const closeEligibilityForm = () => {
        setShowEligibilityForm(false);
    };

    const closeResults = () => {
        setShowResults(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center h-[70vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500 mb-4"></div>
                        <p className="text-gray-600">Loading schemes and checking your eligibility...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Government Schemes</h1>
                    <p className="text-gray-600 mb-8">
                        Access a comprehensive list of government schemes and programs designed to support startups in India.
                    </p>
                    
                    {eligibleIds.length > 0 ? (
                        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-start mb-4">
                                <div className="flex-shrink-0">
                                    <svg className="h-7 w-7 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-green-800">
                                        Your Startup is Eligible for {eligibleIds.length} Government Schemes!
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>We've automatically checked your eligibility based on the information you provided during registration.</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-green-800 font-medium">Below we've highlighted the schemes you're eligible for. Apply directly through the provided links.</p>
                        </div>
                    ) : (
                        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-7 w-7 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-yellow-800">
                                        No Eligible Schemes Found
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>Based on your startup profile, we couldn't find any matching government schemes.</p>
                                        <p className="mt-1">You can update your profile information or try the manual eligibility check with different criteria.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <input 
                                type="text" 
                                placeholder="Search schemes by name, category, or eligibility"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <select 
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Schemes ({allSchemes.length})</option>
                                <option value="eligible">Eligible Schemes ({eligibleIds.length})</option>
                                <option value="not-eligible">Not Eligible ({allSchemes.length - eligibleIds.length})</option>
                                <option value="financial">Financial Support</option>
                                <option value="tax">Tax Benefits</option>
                                <option value="incubation">Incubation</option>
                                <option value="research">Research & Development</option>
                                <option value="msme">MSME Specific</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Manual Eligibility Check Button - smaller and less prominent */}
                    <div className="mb-8 text-right">
                        <button 
                            onClick={openEligibilityForm}
                            className="text-violet-600 border border-violet-300 px-4 py-2 rounded-md hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Try Manual Eligibility Check
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {schemes.length > 0 ? (
                            schemes.map((scheme) => (
                                <div 
                                    key={scheme.id} 
                                    className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                                        eligibleIds.includes(scheme.id) 
                                            ? 'border-l-4 border-l-green-500 shadow-md' 
                                            : 'border-l-4 border-l-gray-300'
                                    }`}
                                >
                                    <div className={`${scheme.colorClass} p-4 border-b flex justify-between items-center`}>
                                        <div>
                                            <h3 className="text-lg font-semibold">{scheme.title}</h3>
                                            <p className="text-sm text-gray-600">{scheme.ministry}</p>
                                        </div>
                                        {eligibleIds.includes(scheme.id) ? (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Eligible
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                                Not Eligible
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600 mb-4">
                                            {scheme.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {scheme.details.slice(0, 2).map((detail, index) => (
                                                <div key={index}>
                                                    <p className="text-xs text-gray-500">{detail.label}</p>
                                                    <p className="font-medium">{detail.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {scheme.website && (
                                            <a 
                                                href={scheme.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm block text-center"
                                            >
                                                View Official Website
                                            </a>
                                        )}
                                        {eligibleIds.includes(scheme.id) && scheme.applicationUrl && (
                                            <a 
                                                href={scheme.applicationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm block text-center mt-2"
                                            >
                                                Apply Now
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 text-center py-10 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No matching schemes</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showEligibilityForm && (
                <EligibilityCheck onClose={closeEligibilityForm} onSubmit={handleEligibilityCheck} />
            )}

            {showResults && (
                <EligibilityResults results={eligibilityResults} onClose={closeResults} />
            )}
        </div>
    );
};

export default Schemes;
