import React, { useState } from 'react';
import { TrendingUp, Info, ArrowUp, ArrowDown } from 'lucide-react';

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
        <TrendingUp className="h-6 w-6 text-violet-600" />
        <h2 className="text-xl font-semibold text-gray-900">Cash Flow Forecasting</h2>
      </div>

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