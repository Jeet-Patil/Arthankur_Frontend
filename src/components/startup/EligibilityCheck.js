import React, { useState } from 'react';

const EligibilityCheck = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    startupStage: '',
    industryType: '',
    annualRevenue: '',
    employees: '',
    registeredLocation: '',
    existingSupport: '',
  });

  const stages = [
    'Ideation',
    'Validation',
    'Early Traction',
    'Scaling',
    'Established'
  ];

  const industries = [
    'Agriculture',
    'EdTech',
    'FinTech',
    'Healthcare',
    'IT/Software',
    'Manufacturing',
    'Retail',
    'Clean Energy',
    'Transportation',
    'Others'
  ];

  const revenueRanges = [
    'Pre-revenue',
    'Less than ₹10 Lakhs',
    '₹10 Lakhs - ₹50 Lakhs',
    '₹50 Lakhs - ₹2 Crore',
    '₹2 Crore - ₹5 Crore',
    'More than ₹5 Crore'
  ];

  const employeeRanges = [
    '1-5 employees',
    '6-20 employees',
    '21-50 employees',
    '51-100 employees',
    'More than 100 employees'
  ];

  const locations = [
    'Metro City',
    'Tier 2 City',
    'Tier 3 City',
    'Rural Area',
    'Special Economic Zone',
    'Industrial Cluster'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Check Scheme Eligibility for Startups/MSMEs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startup/MSME Stage</label>
              <select
                name="startupStage"
                value={formData.startupStage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Startup/MSME Stage</option>
                {stages.map((stage, index) => (
                  <option key={index} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
              <select
                name="industryType"
                value={formData.industryType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
              <select
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Revenue Range</option>
                {revenueRanges.map((range, index) => (
                  <option key={index} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
              <select
                name="employees"
                value={formData.employees}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Employee Range</option>
                {employeeRanges.map((range, index) => (
                  <option key={index} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Location</label>
              <select
                name="registeredLocation"
                value={formData.registeredLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Existing Government Support</label>
              <select
                name="existingSupport"
                value={formData.existingSupport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
              >
                <option value="">Select Option</option>
                <option value="none">None</option>
                <option value="incubation">Incubation Support</option>
                <option value="funding">Government Funding</option>
                <option value="tax">Tax Benefits</option>
                <option value="multiple">Multiple Support Programs</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Check Eligibility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EligibilityCheck;
