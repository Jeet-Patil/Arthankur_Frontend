import React, { useState, useEffect } from 'react';
import { Wallet, Info, Save, List } from 'lucide-react';
import { saveWorkingCapitalAnalysis, getWorkingCapitalAnalyses, getWorkingCapitalAnalysis, deleteWorkingCapitalAnalysis } from '../../services/api';
import { toast } from 'react-hot-toast';

const WorkingCapitalAnalysis = () => {
  const [workingCapitalData, setWorkingCapitalData] = useState({
    currentAssets: '',
    currentLiabilities: '',
    inventory: '',
    accountsReceivable: '',
    accountsPayable: '',
    cashAndEquivalents: '',
    shortTermDebt: '',
    annualSales: '',
    costOfGoodsSold: '',
    annualPurchases: ''
  });

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState([]);
  const [showSavedAnalyses, setShowSavedAnalyses] = useState(false);
  const [analysisName, setAnalysisName] = useState('');
  const [analysisDescription, setAnalysisDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved analyses on component mount
  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  const fetchSavedAnalyses = async () => {
    try {
      setIsLoading(true);
      const analyses = await getWorkingCapitalAnalyses();
      setSavedAnalyses(analyses);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch saved analyses:', error);
      toast.error('Failed to load saved analyses');
      setIsLoading(false);
    }
  };

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
        annualSales,
        costOfGoodsSold,
        annualPurchases
      } = workingCapitalData;

      // Convert to numbers
      const ca = parseFloat(currentAssets) || 0;
      const cl = parseFloat(currentLiabilities) || 0;
      const inv = parseFloat(inventory) || 0;
      const ar = parseFloat(accountsReceivable) || 0;
      const ap = parseFloat(accountsPayable) || 0;
      const cash = parseFloat(cashAndEquivalents) || 0;
      const shortTermDebtValue = parseFloat(shortTermDebt) || 0;
      const sales = parseFloat(annualSales) || 0;
      const cogs = parseFloat(costOfGoodsSold) || 0;
      const purchases = parseFloat(annualPurchases) || 0;

      // Calculate metrics
      const workingCapital = ca - cl;
      const currentRatio = cl !== 0 ? ca / cl : 0;
      const quickRatio = cl !== 0 ? (ca - inv) / cl : 0;
      const cashRatio = cl !== 0 ? cash / cl : 0;
      const workingCapitalRatio = ca !== 0 ? workingCapital / ca : 0;
      
      // Calculate inventory turnover and days
      const inventoryTurnover = inv !== 0 ? cogs / inv : 0;
      const daysInventoryOutstanding = inventoryTurnover !== 0 ? 365 / inventoryTurnover : 0;
      
      // Calculate days receivable and payable
      const daysReceivable = sales !== 0 ? (ar / sales) * 365 : 0;
      const daysPayable = purchases !== 0 ? (ap / purchases) * 365 : 0;
      
      // Calculate cash conversion cycle
      const cashConversionCycle = daysInventoryOutstanding + daysReceivable - daysPayable;

      setAnalysis({
        workingCapital,
        currentRatio,
        quickRatio,
        cashRatio,
        workingCapitalRatio,
        daysReceivable,
        daysPayable,
        inventoryTurnover,
        daysInventoryOutstanding,
        cashConversionCycle,
        recommendations: [
          currentRatio < 2 ? "Consider improving current ratio to maintain better liquidity" : "Current ratio is healthy",
          quickRatio < 1 ? "Quick ratio indicates potential short-term liquidity issues" : "Quick ratio is satisfactory",
          daysReceivable > 45 ? "Consider improving accounts receivable collection" : "Receivable collection is efficient",
          daysPayable < 30 ? "Could negotiate better payment terms with suppliers" : "Payable management is good",
          cashConversionCycle > 90 ? "Cash conversion cycle is too long, consider optimization" : "Cash conversion cycle is acceptable"
        ].filter(rec => rec.includes("Consider"))
      });

      setIsAnalyzing(false);
    }, 1500);
  };
  
  const handleSaveAnalysis = async () => {
    if (!analysisName.trim()) {
      toast.error('Please enter an analysis name');
      return;
    }

    if (!analysis) {
      toast.error('Please generate an analysis first');
      return;
    }

    try {
      setIsSaving(true);

      // Ensure all numbers are properly parsed
      const financialData = {};
      Object.keys(workingCapitalData).forEach(key => {
        financialData[key] = parseFloat(workingCapitalData[key]) || 0;
      });

      // Create the payload for the API
      const analysisData = {
        financialData,
        analysis,
        name: analysisName,
        description: analysisDescription || 'Working capital analysis'
      };

      console.log('Saving analysis data (client):', JSON.stringify(analysisData));
      
      // Add this debugging for the request
      const token = localStorage.getItem('token');
      console.log('Using auth token:', token ? 'Token exists' : 'No token found');
      console.log('API URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/financial/working-capital/analysis`);
      
      const savedData = await saveWorkingCapitalAnalysis(analysisData);
      console.log('Save response:', savedData);
      
      toast.success('Analysis saved successfully');
      setShowSaveForm(false);
      setAnalysisName('');
      setAnalysisDescription('');
      fetchSavedAnalyses();
    } catch (error) {
      console.error('Error saving analysis (detailed):', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      toast.error('Failed to save analysis: ' + (error.message || error.error || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const loadAnalysis = async (id) => {
    try {
      setIsLoading(true);
      const loadedAnalysis = await getWorkingCapitalAnalysis(id);
      
      // Set financial data
      setWorkingCapitalData(loadedAnalysis.financialData);
      
      // Set analysis
      setAnalysis(loadedAnalysis.analysis);
      
      // Hide saved analyses panel
      setShowSavedAnalyses(false);
      
      toast.success('Analysis loaded successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading analysis:', error);
      toast.error('Failed to load analysis');
      setIsLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await deleteWorkingCapitalAnalysis(id);
      toast.success('Analysis deleted successfully');
      fetchSavedAnalyses();
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Failed to delete analysis');
    }
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-violet-600" />
          <h2 className="text-xl font-semibold text-gray-900">Working Capital Analysis</h2>
        </div>
        <div className="flex gap-2">
          {analysis && (
            <button 
              onClick={() => setShowSaveForm(true)} 
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              Save Analysis
            </button>
          )}
          <button 
            onClick={() => setShowSavedAnalyses(!showSavedAnalyses)} 
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
          >
            <List className="h-4 w-4" />
            {showSavedAnalyses ? 'Hide' : 'My Analyses'}
          </button>
        </div>
      </div>

      {/* Save Analysis Modal */}
      {showSaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Analysis</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analysis Name*
              </label>
              <input
                type="text"
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                placeholder="Q1 2025 Working Capital"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={analysisDescription}
                onChange={(e) => setAnalysisDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                placeholder="Notes about this analysis..."
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-violet-300"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Analyses Panel */}
      {showSavedAnalyses && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">My Saved Analyses</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : savedAnalyses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved analyses yet</p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedAnalyses.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => loadAnalysis(item._id)}
                          className="text-violet-600 hover:text-violet-900"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteAnalysis(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
                Cash (₹)
              </label>
              <input
                type="number"
                name="cashAndEquivalents"
                value={workingCapitalData.cashAndEquivalents}
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
                Annual Sales (₹)
              </label>
              <input
                type="number"
                name="annualSales"
                value={workingCapitalData.annualSales}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost of Goods Sold (₹)
              </label>
              <input
                type="number"
                name="costOfGoodsSold"
                value={workingCapitalData.costOfGoodsSold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Purchases (₹)
              </label>
              <input
                type="number"
                name="annualPurchases"
                value={workingCapitalData.annualPurchases}
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
                    <span className="text-gray-500">Days Inventory</span>
                    <span>{Math.round(analysis.daysInventoryOutstanding)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Receivable</span>
                    <span>{Math.round(analysis.daysReceivable)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Payable</span>
                    <span>{Math.round(analysis.daysPayable)} days</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span className="text-gray-800">Cash Conversion Cycle</span>
                    <span>{Math.round(analysis.cashConversionCycle)} days</span>
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