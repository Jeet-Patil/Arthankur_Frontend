import React from 'react';

const BankEligibility = ({ loanDetails, onBankSelect, onBack }) => {
  const eligibleBanks = [
    {
      id: 1,
      name: "HDFC Bank",
      interestRate: "10.5%",
      maxAmount: "₹50,00,000",
      processingFee: "1%",
      tenure: "Up to 5 years",
      requirements: [
        "Minimum business age: 3 years",
        "Minimum turnover: ₹20 lakhs",
        "Credit score: 700+"
      ]
    },
    {
      id: 2,
      name: "ICICI Bank",
      interestRate: "11%",
      maxAmount: "₹75,00,000",
      processingFee: "1.5%",
      tenure: "Up to 7 years",
      requirements: [
        "Minimum business age: 2 years",
        "Minimum turnover: ₹15 lakhs",
        "Credit score: 650+"
      ]
    },
    {
      id: 3,
      name: "State Bank of India",
      interestRate: "9.8%",
      maxAmount: "₹1,00,00,000",
      processingFee: "0.5%",
      tenure: "Up to 10 years",
      requirements: [
        "Minimum business age: 5 years",
        "Minimum turnover: ₹25 lakhs",
        "Credit score: 750+"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Eligible Banks</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eligibleBanks.map((bank) => (
          <div
            key={bank.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-violet-500 transition-all"
          >
            <h3 className="text-xl font-semibold mb-4">{bank.name}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="font-medium">{bank.interestRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Maximum Amount</p>
                <p className="font-medium">{bank.maxAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing Fee</p>
                <p className="font-medium">{bank.processingFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tenure</p>
                <p className="font-medium">{bank.tenure}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Requirements</p>
                <ul className="list-disc list-inside text-sm">
                  {bank.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onBankSelect(bank)}
                className="w-full mt-4 bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition-colors"
              >
                Apply with {bank.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankEligibility; 