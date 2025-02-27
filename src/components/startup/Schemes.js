import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../Navbar';
import EligibilityCheck from './EligibilityCheck';
import EligibilityResults from './EligibilityResults';
import governmentSchemes from '../../data/governmentSchemes';

const Schemes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [schemes, setSchemes] = useState(governmentSchemes);
    const [showEligibilityForm, setShowEligibilityForm] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [eligibilityResults, setEligibilityResults] = useState([]);

    const filterSchemes = useCallback(() => {
        let filteredSchemes = governmentSchemes;

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
                return true;
            });
        }

        setSchemes(filteredSchemes);
    }, [searchTerm, category]);

    useEffect(() => {
        filterSchemes();
    }, [filterSchemes]);

    const handleEligibilityCheck = (formData) => {
        const matchingSchemes = governmentSchemes.filter(scheme => {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Government Schemes</h1>
                    <p className="text-gray-600 mb-8">
                        Access a comprehensive list of government schemes and programs designed to support startups in India.
                    </p>
                    
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
                                <option value="">All Categories</option>
                                <option value="financial">Financial Support</option>
                                <option value="tax">Tax Benefits</option>
                                <option value="incubation">Incubation</option>
                                <option value="research">Research & Development</option>
                                <option value="msme">MSME Specific</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-8 text-center">
                        <button 
                            onClick={openEligibilityForm}
                            className="bg-violet-600 text-white px-6 py-3 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Check Your Eligibility
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            Find government schemes that match your startup profile
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {schemes.map((scheme) => (
                            <div key={scheme.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className={`${scheme.colorClass} p-4 border-b`}>
                                    <h3 className="text-lg font-semibold">{scheme.title}</h3>
                                    <p className="text-sm text-gray-600">{scheme.ministry}</p>
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
                                    <button 
                                        onClick={openEligibilityForm}
                                        className="w-full bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm"
                                    >
                                        Check Eligibility & Apply
                                    </button>
                                </div>
                            </div>
                        ))}
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
