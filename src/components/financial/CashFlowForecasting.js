import React, { useState, useEffect } from 'react';
import { TrendingUp, Info, ArrowUp, ArrowDown, Save, List, Plus } from 'lucide-react';
import { saveCashFlowForecast, getCashFlowForecasts, getCashFlowForecast, deleteCashFlowForecast } from '../../services/api';
import { toast } from 'react-hot-toast';

const CashFlowForecasting = () => {
  const [historicalData, setHistoricalData] = useState({
    revenue: '',
    expenses: '',
    accountsReceivable: '',
    accountsPayable: '',
    inventory: '',
    operatingExpenses: '',
    capitalExpenditures: '',
  });

  const [forecastPeriod, setForecastPeriod] = useState('3');
  const [forecast, setForecast] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedForecasts, setSavedForecasts] = useState([]);
  const [showSavedForecasts, setShowSavedForecasts] = useState(false);
  const [forecastName, setForecastName] = useState('');
  const [forecastDescription, setForecastDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved forecasts on component mount
  useEffect(() => {
    fetchSavedForecasts();
  }, []);

  const fetchSavedForecasts = async () => {
    try {
      setIsLoading(true);
      const forecasts = await getCashFlowForecasts();
      setSavedForecasts(forecasts);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch saved forecasts:', error);
      toast.error('Failed to load saved forecasts');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setHistoricalData({
      ...historicalData,
      [e.target.name]: e.target.value
    });
  };

  const calculateForecast = () => {
    setIsCalculating(true);

    // Simulate API call or complex calculation
    setTimeout(() => {
      const {
        revenue,
        expenses,
        accountsReceivable,
        accountsPayable,
        inventory,
        operatingExpenses,
        capitalExpenditures
      } = historicalData;

      // Simple forecasting logic (can be made more complex)
      const monthlyRevenue = parseFloat(revenue) / 12;
      const monthlyExpenses = parseFloat(expenses) / 12;
      const monthlyOperatingExpenses = parseFloat(operatingExpenses) / 12;
      const monthlyCapEx = parseFloat(capitalExpenditures) / 12;

      const periods = parseInt(forecastPeriod);
      const forecasts = [];

      for (let i = 1; i <= periods; i++) {
        // Assume 5% growth each month
        const projectedRevenue = monthlyRevenue * Math.pow(1.05, i);
        const projectedExpenses = monthlyExpenses * Math.pow(1.03, i);
        const projectedOperatingExpenses = monthlyOperatingExpenses * Math.pow(1.02, i);
        const projectedCapEx = monthlyCapEx;

        const netCashFlow = projectedRevenue - projectedExpenses - projectedOperatingExpenses - projectedCapEx;

        forecasts.push({
          month: i,
          revenue: projectedRevenue,
          expenses: projectedExpenses,
          operatingExpenses: projectedOperatingExpenses,
          capitalExpenditures: projectedCapEx,
          netCashFlow: netCashFlow
        });
      }

      setForecast(forecasts);
      setIsCalculating(false);
    }, 1500);
  };

  const handleSaveForecast = async () => {
    if (!forecastName.trim()) {
      toast.error('Please enter a forecast name');
      return;
    }

    if (!forecast) {
      toast.error('Please generate a forecast first');
      return;
    }

    try {
      setIsSaving(true);

      const forecastData = {
        historicalData,
        forecastPeriod: parseInt(forecastPeriod),
        forecasts: forecast,
        name: forecastName,
        description: forecastDescription || 'Cash flow forecast'
      };

      await saveCashFlowForecast(forecastData);
      toast.success('Forecast saved successfully');
      setShowSaveForm(false);
      setForecastName('');
      setForecastDescription('');
      fetchSavedForecasts();
    } catch (error) {
      console.error('Error saving forecast:', error);
      toast.error('Failed to save forecast');
    } finally {
      setIsSaving(false);
    }
  };

  const loadForecast = async (id) => {
    try {
      setIsLoading(true);
      const loadedForecast = await getCashFlowForecast(id);
      
      // Set historical data
      setHistoricalData(loadedForecast.historicalData);
      
      // Set forecast period
      setForecastPeriod(loadedForecast.forecastPeriod.toString());
      
      // Set forecasts
      setForecast(loadedForecast.forecasts);
      
      // Hide saved forecasts panel
      setShowSavedForecasts(false);
      
      toast.success('Forecast loaded successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading forecast:', error);
      toast.error('Failed to load forecast');
      setIsLoading(false);
    }
  };

  const handleDeleteForecast = async (id) => {
    if (!window.confirm('Are you sure you want to delete this forecast?')) {
      return;
    }

    try {
      await deleteCashFlowForecast(id);
      toast.success('Forecast deleted successfully');
      fetchSavedForecasts();
    } catch (error) {
      console.error('Error deleting forecast:', error);
      toast.error('Failed to delete forecast');
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
          <TrendingUp className="h-6 w-6 text-violet-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cash Flow Forecasting</h2>
        </div>
        <div className="flex gap-2">
          {forecast && (
            <button 
              onClick={() => setShowSaveForm(true)} 
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              Save Forecast
            </button>
          )}
          <button 
            onClick={() => setShowSavedForecasts(!showSavedForecasts)} 
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
          >
            <List className="h-4 w-4" />
            {showSavedForecasts ? 'Hide' : 'My Forecasts'}
          </button>
        </div>
      </div>

      {/* Save Forecast Modal */}
      {showSaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Forecast</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forecast Name*
              </label>
              <input
                type="text"
                value={forecastName}
                onChange={(e) => setForecastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                placeholder="Q1 2025 Forecast"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={forecastDescription}
                onChange={(e) => setForecastDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                placeholder="Notes about this forecast..."
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
                onClick={handleSaveForecast}
                disabled={isSaving}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:bg-violet-300"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Forecasts Panel */}
      {showSavedForecasts && (
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">My Saved Forecasts</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : savedForecasts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No saved forecasts yet</p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedForecasts.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.forecastPeriod} months
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm space-x-2">
                        <button
                          onClick={() => loadForecast(item._id)}
                          className="text-violet-600 hover:text-violet-900"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteForecast(item._id)}
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
                Monthly Revenue (₹)
              </label>
              <input
                type="number"
                name="revenue"
                value={historicalData.revenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Expenses (₹)
              </label>
              <input
                type="number"
                name="expenses"
                value={historicalData.expenses}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Expenses (₹)
              </label>
              <input
                type="number"
                name="operatingExpenses"
                value={historicalData.operatingExpenses}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capital Expenditures (₹)
              </label>
              <input
                type="number"
                name="capitalExpenditures"
                value={historicalData.capitalExpenditures}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forecast Period (Months)
            </label>
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>

          <button
            onClick={calculateForecast}
            disabled={isCalculating}
            className="w-full bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 disabled:bg-violet-300"
          >
            {isCalculating ? 'Calculating...' : 'Generate Forecast'}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          {isCalculating ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : forecast ? (
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Forecast Results</h3>
              <div className="space-y-4">
                {forecast.map((month) => (
                  <div key={month.month} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Month {month.month}</span>
                      <span className={`flex items-center gap-1 ${
                        month.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {month.netCashFlow >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {formatCurrency(Math.abs(month.netCashFlow))}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Revenue</span>
                        <span>{formatCurrency(month.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expenses</span>
                        <span>{formatCurrency(month.expenses)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Enter your financial data and generate a forecast to see projections
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashFlowForecasting;