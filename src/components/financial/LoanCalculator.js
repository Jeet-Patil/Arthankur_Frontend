import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('1000000');
  const [interestRate, setInterestRate] = useState('12');
  const [tenure, setTenure] = useState('36');
  const [loanDetails, setLoanDetails] = useState(null);

  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const R = parseFloat(interestRate) / 12 / 100;
    const N = parseFloat(tenure);

    const EMI = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    const totalPayment = EMI * N;
    const totalInterest = totalPayment - P;

    setLoanDetails({
      loanAmount: P,
      interestRate: parseFloat(interestRate),
      tenure: N,
      emi: EMI,
      totalInterest,
      totalPayment
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, tenure]);

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
        <span className="text-2xl">🧮</span>
        <h2 className="text-xl font-semibold text-gray-900">Business Loan Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              min="100000"
              max="10000000"
            />
            <input
              type="range"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full mt-2"
              min="100000"
              max="10000000"
              step="100000"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>₹1L</span>
              <span>₹1Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              min="1"
              max="30"
              step="0.1"
            />
            <input
              type="range"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full mt-2"
              min="1"
              max="30"
              step="0.1"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenure (months)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
              min="3"
              max="360"
            />
            <input
              type="range"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full mt-2"
              min="3"
              max="360"
              step="1"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>3 months</span>
              <span>30 years</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
          
          {loanDetails && (
            <div className="space-y-6">
              {/* EMI */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly EMI</p>
                    <p className="text-2xl font-bold text-violet-600">
                      {formatCurrency(loanDetails.emi)}
                    </p>
                  </div>
                  <div className="text-violet-600">
                    <span className="text-xl">ℹ️</span>
                  </div>
                </div>
              </div>

              {/* Other Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Principal Amount</span>
                  <span className="font-medium">{formatCurrency(loanDetails.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Interest</span>
                  <span className="font-medium">{formatCurrency(loanDetails.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Payment</span>
                  <span className="font-medium">{formatCurrency(loanDetails.totalPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interest Rate</span>
                  <span className="font-medium">{loanDetails.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenure</span>
                  <span className="font-medium">{loanDetails.tenure} months</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="bg-violet-50 rounded-lg p-4 mt-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-600"></div>
                    <span className="text-sm">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-300"></div>
                    <span className="text-sm">Interest</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator; 