import React, { useState, useEffect } from 'react';
import { PieChart, Info, CheckCircle, CreditCard } from 'lucide-react';
import axios from 'axios';

const FinancialHealthCheck = () => {
  const [financialData, setFinancialData] = useState({
    currentAssets: '',
    currentLiabilities: '',
    inventory: '',
    totalDebt: '',
    totalEquity: '',
    revenue: '',
    netIncome: '',
    operatingCashFlow: '',
    annualSales: '',
  });

  const [healthScore, setHealthScore] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cibilScore, setCibilScore] = useState({
    score: '',
    category: '',
    lastUpdated: null,
    isLoading: false,
    error: null
  });

  // Fetch CIBIL Score data on component mount
  useEffect(() => {
    fetchCibilScore();
  }, []);

  const fetchCibilScore = async () => {
    setCibilScore(prev => ({ ...prev, isLoading: true, error: null }));
    
    const options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-timeseries',
      params: {
        symbol: 'IBM',  // Using IBM as a placeholder for demo
        region: 'US'
      },
      headers: {
        'x-rapidapi-key': 'f3fde0540dmshf85455af3999dfbp17abdejsn17b69b81c847',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
      }
    };

    try {
      console.log('Attempting to fetch CIBIL score data...');
      const response = await axios.request(options);
      console.log('Yahoo Finance API response:', response);
      
      // For demonstration purposes, we're using the stock close price as a "mock" CIBIL score
      // In a real application, you would call an actual CIBIL score API
      const latestTimestamp = response.data.timestamp[response.data.timestamp.length - 1];
      const mockScore = Math.floor(Math.random() * (850 - 600) + 600); // Random score between 600-850
      
      setCibilScore({
        score: mockScore,
        category: getCibilCategory(mockScore),
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching CIBIL score:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Fallback to using mock data if API fails
      const mockScore = Math.floor(Math.random() * (850 - 600) + 600);
      setCibilScore({
        score: mockScore,
        category: getCibilCategory(mockScore),
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null
      });
    }
  };

  const getCibilCategory = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Bad';
  };

  const getCibilCategoryColor = (category) => {
    switch (category) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-orange-600';
      case 'Bad': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleInputChange = (e) => {
    setFinancialData({
      ...financialData,
      [e.target.name]: e.target.value
    });
  };

  const getScoreColor = (category) => {
    switch (category) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-yellow-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateMetrics = () => {
    const {
      currentAssets,
      currentLiabilities,
      inventory,
      totalDebt,
      totalEquity,
      revenue,
      netIncome,
      operatingCashFlow,
      annualSales,
    } = financialData;

    // Convert string inputs to numbers
    const ca = parseFloat(currentAssets) || 0;
    const cl = parseFloat(currentLiabilities) || 0;
    const inv = parseFloat(inventory) || 0;
    const debt = parseFloat(totalDebt) || 0;
    const equity = parseFloat(totalEquity) || 0;
    const rev = parseFloat(revenue) || 0;
    const income = parseFloat(netIncome) || 0;
    const cashFlow = parseFloat(operatingCashFlow) || 0;
    const sales = parseFloat(annualSales) || 0;

    return {
      currentRatio: ca / cl,
      quickRatio: (ca - inv) / cl,
      debtToEquity: debt / equity,
      profitMargin: (income / rev) * 100,
      workingCapital: ca - cl,
      cashFlow: cashFlow,
      returnOnEquity: (income / equity) * 100,
      inventoryTurnover: sales / inv
    };
  };

  const calculateCibilScore = (metrics) => {
    // Base score - starts at 600 (minimum CIBIL score)
    let baseScore = 600;
    let maxAdditionalPoints = 300; // Maximum additional points to reach 900
    let totalPoints = 0;
    
    // Current Ratio impact (better ratio = better credit)
    // Weight: 15% of max additional points
    if (metrics.currentRatio >= 2) totalPoints += (0.15 * maxAdditionalPoints);
    else if (metrics.currentRatio >= 1.5) totalPoints += (0.12 * maxAdditionalPoints);
    else if (metrics.currentRatio >= 1) totalPoints += (0.08 * maxAdditionalPoints);
    else totalPoints += (0.04 * maxAdditionalPoints);
    
    // Debt to Equity impact (lower ratio = better credit)
    // Weight: 20% of max additional points
    if (metrics.debtToEquity <= 0.5) totalPoints += (0.20 * maxAdditionalPoints);
    else if (metrics.debtToEquity <= 1) totalPoints += (0.15 * maxAdditionalPoints);
    else if (metrics.debtToEquity <= 1.5) totalPoints += (0.10 * maxAdditionalPoints);
    else totalPoints += (0.05 * maxAdditionalPoints);
    
    // Profit Margin impact (higher profit = better credit)
    // Weight: 25% of max additional points
    if (metrics.profitMargin >= 20) totalPoints += (0.25 * maxAdditionalPoints);
    else if (metrics.profitMargin >= 15) totalPoints += (0.20 * maxAdditionalPoints);
    else if (metrics.profitMargin >= 10) totalPoints += (0.15 * maxAdditionalPoints);
    else if (metrics.profitMargin >= 5) totalPoints += (0.10 * maxAdditionalPoints);
    else totalPoints += (0.05 * maxAdditionalPoints);
    
    // Return on Equity impact (higher ROE = better credit)
    // Weight: 15% of max additional points
    if (metrics.returnOnEquity >= 20) totalPoints += (0.15 * maxAdditionalPoints);
    else if (metrics.returnOnEquity >= 15) totalPoints += (0.12 * maxAdditionalPoints);
    else if (metrics.returnOnEquity >= 10) totalPoints += (0.09 * maxAdditionalPoints);
    else if (metrics.returnOnEquity >= 5) totalPoints += (0.06 * maxAdditionalPoints);
    else totalPoints += (0.03 * maxAdditionalPoints);
    
    // Cash Flow impact (positive cash flow = better credit)
    // Weight: 25% of max additional points
    if (metrics.cashFlow >= 2000000) totalPoints += (0.25 * maxAdditionalPoints);
    else if (metrics.cashFlow >= 1000000) totalPoints += (0.20 * maxAdditionalPoints);
    else if (metrics.cashFlow >= 500000) totalPoints += (0.15 * maxAdditionalPoints);
    else if (metrics.cashFlow >= 100000) totalPoints += (0.10 * maxAdditionalPoints);
    else if (metrics.cashFlow > 0) totalPoints += (0.05 * maxAdditionalPoints);
    else totalPoints += 0;
    
    // Calculate final score (rounded to nearest integer)
    const finalScore = Math.round(baseScore + totalPoints);
    
    // Ensure score is within valid CIBIL range (300-900)
    return Math.min(Math.max(finalScore, 300), 900);
  };

  const analyzeHealth = () => {
    setIsAnalyzing(true);
    
    // Calculate metrics
    const metrics = calculateMetrics();
    setMetrics(metrics);

    // Calculate health score (out of 100)
    let score = 0;
    let recommendations = [];

    // Current Ratio Analysis (20 points)
    if (metrics.currentRatio >= 2) score += 20;
    else if (metrics.currentRatio >= 1.5) score += 15;
    else if (metrics.currentRatio >= 1) score += 10;
    else {
      score += 5;
      recommendations.push("Improve current ratio to strengthen short-term liquidity");
    }

    // Quick Ratio Analysis (15 points)
    if (metrics.quickRatio >= 1) score += 15;
    else if (metrics.quickRatio >= 0.8) score += 10;
    else {
      score += 5;
      recommendations.push("Consider improving quick ratio for better immediate liquidity");
    }

    // Debt to Equity Analysis (15 points)
    if (metrics.debtToEquity <= 1) score += 15;
    else if (metrics.debtToEquity <= 1.5) score += 10;
    else {
      score += 5;
      recommendations.push("Review debt levels to optimize capital structure");
    }

    // Profit Margin Analysis (20 points)
    if (metrics.profitMargin >= 20) score += 20;
    else if (metrics.profitMargin >= 10) score += 15;
    else if (metrics.profitMargin >= 5) score += 10;
    else {
      score += 5;
      recommendations.push("Focus on improving profit margins through cost optimization");
    }

    // ROE Analysis (15 points)
    if (metrics.returnOnEquity >= 15) score += 15;
    else if (metrics.returnOnEquity >= 10) score += 10;
    else {
      score += 5;
      recommendations.push("Work on improving return on equity");
    }

    // Working Capital Analysis (15 points)
    if (metrics.workingCapital > 0) {
      if (metrics.currentRatio >= 2) score += 15;
      else if (metrics.currentRatio >= 1.5) score += 10;
      else score += 5;
    } else {
      recommendations.push("Improve working capital management");
    }

    // Determine category
    let category;
    if (score >= 85) category = 'Excellent';
    else if (score >= 70) category = 'Good';
    else if (score >= 50) category = 'Fair';
    else category = 'Poor';

    // Calculate CIBIL score based on the same metrics
    const cibilScoreValue = calculateCibilScore(metrics);
    
    setTimeout(() => {
      setHealthScore({ score, category, recommendations });
      
      // Update CIBIL score based on financial data
      setCibilScore({
        score: cibilScoreValue,
        category: getCibilCategory(cibilScoreValue),
        lastUpdated: new Date().toISOString(),
        isLoading: false,
        error: null
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-6 w-6 text-violet-600" />
        <h2 className="text-xl font-semibold text-gray-900">Financial Health Check</h2>
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
                value={financialData.currentAssets}
                onChange={handleInputChange}
                placeholder="e.g., 1000000"
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
                value={financialData.currentLiabilities}
                onChange={handleInputChange}
                placeholder="e.g., 500000"
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
                value={financialData.inventory}
                onChange={handleInputChange}
                placeholder="e.g., 300000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Debt (₹)
              </label>
              <input
                type="number"
                name="totalDebt"
                value={financialData.totalDebt}
                onChange={handleInputChange}
                placeholder="e.g., 2000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Equity (₹)
              </label>
              <input
                type="number"
                name="totalEquity"
                value={financialData.totalEquity}
                onChange={handleInputChange}
                placeholder="e.g., 3000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Revenue (₹)
              </label>
              <input
                type="number"
                name="revenue"
                value={financialData.revenue}
                onChange={handleInputChange}
                placeholder="e.g., 5000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Income (₹)
              </label>
              <input
                type="number"
                name="netIncome"
                value={financialData.netIncome}
                onChange={handleInputChange}
                placeholder="e.g., 800000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Cash Flow (₹)
              </label>
              <input
                type="number"
                name="operatingCashFlow"
                value={financialData.operatingCashFlow}
                onChange={handleInputChange}
                placeholder="e.g., 1200000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          <button
            onClick={analyzeHealth}
            disabled={isAnalyzing}
            className="w-full bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 disabled:bg-violet-300"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Financial Health'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : healthScore ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Overall Health Score</h3>
                  <Info className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-violet-600">{healthScore.score}/100</div>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(healthScore.category)}`}>
                    {healthScore.category}
                  </span>
                </div>
              </div>

              {/* CIBIL Score Section */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">CIBIL Score</h3>
                  <CreditCard className="h-5 w-5 text-violet-600" />
                </div>
                
                {cibilScore.isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                ) : cibilScore.error ? (
                  <div className="text-center py-3">
                    <p className="text-red-500 text-sm">{cibilScore.error}</p>
                    <button 
                      onClick={fetchCibilScore}
                      className="mt-2 text-xs bg-violet-100 text-violet-700 px-3 py-1 rounded-full"
                    >
                      Try Again
                    </button>
                  </div>
                ) : cibilScore.score ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold text-violet-600">{cibilScore.score}</div>
                        <span className={`text-sm font-medium ${getCibilCategoryColor(cibilScore.category)}`}>
                          {cibilScore.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Last Updated</span>
                        <p className="text-sm text-gray-700">
                          {new Date(cibilScore.lastUpdated).toLocaleDateString('en-IN', {
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 text-sm text-gray-600 border-t">
                      <p>Your CIBIL score is an important indicator of your creditworthiness. Lenders use this score to evaluate loan applications and determine interest rates.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button 
                      onClick={fetchCibilScore}
                      className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700"
                    >
                      Check CIBIL Score
                    </button>
                  </div>
                )}
              </div>

              {/* Key Metrics */}
              {metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Current Ratio</p>
                    <p className="text-lg font-semibold">{metrics.currentRatio.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Quick Ratio</p>
                    <p className="text-lg font-semibold">{metrics.quickRatio.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Debt to Equity</p>
                    <p className="text-lg font-semibold">{metrics.debtToEquity.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Profit Margin</p>
                    <p className="text-lg font-semibold">{metrics.profitMargin.toFixed(1)}%</p>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {healthScore.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {healthScore.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Enter your financial data and click analyze to get insights
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthCheck;