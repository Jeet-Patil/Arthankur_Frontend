import React, { useState } from 'react';
import { Wallet, Info, TrendingUp, TrendingDown } from 'lucide-react';

const WorkingCapitalAnalysis = () => {
  const [workingCapitalData, setWorkingCapitalData] = useState({
    currentAssets: '',
    currentLiabilities: '',
    inventory: '',
    accountsReceivable: '',
    accountsPayable: '',
    cashAndEquivalents: '',
    shortTermDebt: '',
  });

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e) => {
    setWorkingCapitalData({
      ...workingCapitalData,
      [e.target.name]: e.target.value
    });
  };

  const analyzeWorkingCapital = () => {
    setIsAnalyzing(true);

    // Simulate API call or complex calculation
    setTimeout(() => {
      const {
        currentAssets,
        currentLiabilities,
        inventory,
        accountsReceivable,
        accountsPayable,
        cashAndEquivalents,
        shortTermDebt,
      } = workingCapitalData;

      // Convert to numbers
      const ca = parseFloat(currentAssets);
      const cl = parseFloat(currentLiabilities);
      const inv = parseFloat(inventory);
      const ar = parseFloat(accountsReceivable);
      const ap = parseFloat(accountsPayable);
      const cash = parseFloat(cashAndEquivalents);
      const std = parseFloat(shortTermDebt);

      // Calculate metrics
      const workingCapital = ca - cl;
      const currentRatio = ca / cl;
      const quickRatio = (ca - inv) / cl;
      const cashRatio = cash / cl;
      const workingCapitalRatio = workingCapital / ca;
      const daysReceivable = (ar / (ca * 365)) * 365;
      const daysPayable = (ap / (cl * 365)) * 365;

      setAnalysis({
        workingCapital,
        currentRatio,
        quickRatio,
        cashRatio,
        workingCapitalRatio,
        daysReceivable,
        daysPayable,
        recommendations: [
          currentRatio < 2 ? "Consider improving current ratio to maintain better liquidity" : "Current ratio is healthy",
          quickRatio < 1 ? "Quick ratio indicates potential short-term liquidity issues" : "Quick ratio is satisfactory",
          daysReceivable > 45 ? "Consider improving accounts receivable collection" : "Receivable collection is efficient",
          daysPayable < 30 ? "Could negotiate better payment terms with suppliers" : "Payable management is good"
        ].filter(rec => rec.includes("Consider"))
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="h-6 w-6 text-violet-600" />
        <h2 className="text-xl font-semibold text-gray-900">Working Capital Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Assets (₹)
              </label>
              <input
                type="number"
                name="currentAssets"
                value={workingCapitalData.currentAssets}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Liabilities (₹)
              </label>
              <input
                type="number"
                name="currentLiabilities"
                value={workingCapitalData.currentLiabilities}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory (₹)
              </label>
              <input
                type="number"
                name="inventory"
                value={workingCapitalData.inventory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accounts Receivable (₹)
              </label>
              <input
                type="number"
                name="accountsReceivable"
                value={workingCapitalData.accountsReceivable}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accounts Payable (₹)
              </label>
              <input
                type="number"
                name="accountsPayable"
                value={workingCapitalData.accountsPayable}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash & Equivalents (₹)
              </label>
              <input
                type="number"
                name="cashAndEquivalents"
                value={workingCapitalData.cashAndEquivalents}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          <button
            onClick={analyzeWorkingCapital}
            disabled={isAnalyzing}
            className="w-full bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 disabled:bg-violet-300"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Working Capital'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Working Capital</p>
                  <p className="text-lg font-semibold">{formatCurrency(analysis.workingCapital)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Current Ratio</p>
                  <p className="text-lg font-semibold">{analysis.currentRatio.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Quick Ratio</p>
                  <p className="text-lg font-semibold">{analysis.quickRatio.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Cash Ratio</p>
                  <p className="text-lg font-semibold">{analysis.cashRatio.toFixed(2)}</p>
                </div>
              </div>

              {/* Cycle Metrics */}
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Working Capital Cycle</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Receivable</span>
                    <span>{Math.round(analysis.daysReceivable)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Payable</span>
                    <span>{Math.round(analysis.daysPayable)} days</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Enter your working capital data and analyze to get insights
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkingCapitalAnalysis; 