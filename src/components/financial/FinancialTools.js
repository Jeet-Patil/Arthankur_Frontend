import React, { useState } from 'react';
import { PieChart, TrendingUp, Calculator, Wallet } from 'lucide-react';
import LoanCalculator from './LoanCalculator';
import FinancialHealthCheck from './FinancialHealthCheck';
import CashFlowForecasting from './CashFlowForecasting';
import Navbar from '../Navbar';

const FinancialTools = () => {
  const [selectedTool, setSelectedTool] = useState('loan-calculator');

  const tools = [
    {
      id: 'loan-calculator',
      icon: <Calculator className="h-6 w-6" />,
      title: 'Loan Calculator',
      description: 'Calculate EMIs, interest rates, and loan terms'
    },
    {
      id: 'financial-health',
      icon: <PieChart className="h-6 w-6" />,
      title: 'Financial Health Check',
      description: 'Get an AI-powered analysis of your business finances'
    },
    {
      id: 'cash-flow',
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Cash Flow Forecasting',
      description: 'Predict future cash flows using historical data'
    },
    {
      id: 'working-capital',
      icon: <Wallet className="h-6 w-6" />,
      title: 'Working Capital Analysis',
      description: 'Optimize your working capital management'
    }
  ];

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
                <div className="text-violet-600">{tool.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {selectedTool === 'loan-calculator' && <LoanCalculator />}
          {selectedTool === 'financial-health' && <FinancialHealthCheck />}
          {selectedTool === 'cash-flow' && <CashFlowForecasting />}
          {selectedTool === 'working-capital' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Working Capital Analysis</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialTools; 