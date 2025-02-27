import React from 'react';

const EligibilityResults = ({ results, onClose }) => {
  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Eligibility Results</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Matching Schemes Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Based on your provided information, we couldn't find any government schemes that match your eligibility criteria. 
              Consider adjusting your parameters or exploring other funding options.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Based on the information you provided, you may be eligible for the following government schemes:
            </p>
            <div className="grid grid-cols-1 gap-6">
              {results.map((scheme, index) => (
                <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`${scheme.colorClass} p-4 border-b`}>
                    <h3 className="text-lg font-semibold">{scheme.title}</h3>
                    <p className="text-sm text-gray-600">{scheme.ministry}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {scheme.details.map((detail, idx) => (
                        <div key={idx}>
                          <p className="text-xs text-gray-500">{detail.label}</p>
                          <p className="font-medium">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleRedirect(scheme.website)}
                        className="flex-1 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-sm flex items-center justify-center"
                      >
                        <span>Visit Official Website</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                      {scheme.applicationUrl && (
                        <button 
                          onClick={() => handleRedirect(scheme.applicationUrl)}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center justify-center"
                        >
                          <span>Apply Now</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Schemes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EligibilityResults;
