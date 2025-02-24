import React, { useState } from 'react';
import Navbar from '../Navbar';
import LoanCalculator from './LoanCalculator';

const FinancialTools = () => {
  const [selectedTool, setSelectedTool] = useState('loan-calculator'); // Set default tool

  const tools = [
    {
      id: 'loan-calculator',
      icon: '💰',
      title: 'Loan Calculator',
      description: 'Calculate EMIs, interest rates, and loan terms'
    },
    {
      id: 'financial-health',
      icon: '📊',
      title: 'Financial Health Check',
      description: 'Get an AI-powered analysis of your business finances'
    },
    {
      id: 'cash-flow',
      icon: '📈',
      title: 'Cash Flow Forecasting',
      description: 'Predict future cash flows using historical data'
    },
    {
      id: 'working-capital',
      icon: '💳',
      title: 'Working Capital Analysis',
      description: 'Optimize your working capital management'
    }
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 'loan-calculator':
        return <LoanCalculator />;
      case 'financial-health':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Financial Health Check</h2>
            <p>Coming soon...</p>
          </div>
        );
      case 'cash-flow':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Cash Flow Forecasting</h2>
            <p>Coming soon...</p>
          </div>
        );
      case 'working-capital':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Working Capital Analysis</h2>
            <p>Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar userType="startup" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                selectedTool === tool.id ? 'ring-2 ring-violet-600' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">{tool.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default FinancialTools; 