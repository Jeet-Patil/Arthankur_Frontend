import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Milestone } from 'lucide-react';

const CaseStudyCard = ({ study }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
              {study.domain}
            </span>
            <h3 className="mt-3 text-xl font-semibold text-gray-900">
              {study.title}
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>
        </div>
        <p className="mt-3 text-gray-600">
          {study.description}
        </p>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            {/* Challenge Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Challenge</h4>
              <p className="mt-1 text-gray-900">{study.challenge}</p>
            </div>

            {/* Solution Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Solution</h4>
              <p className="mt-1 text-gray-900">{study.solution}</p>
            </div>

            {/* Results Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Key Results</h4>
              <ul className="mt-1 list-disc list-inside text-gray-900">
                {study.results.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>

            {/* Roadmap Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Success Roadmap</h4>
              <div className="relative">
                {study.roadmap.map((milestone, index) => (
                  <div key={index} className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-semibold">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-gray-900">{milestone.phase}</h5>
                      <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      {milestone.duration && (
                        <span className="inline-block mt-1 text-xs text-gray-500">
                          Duration: {milestone.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {study.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyCard;
