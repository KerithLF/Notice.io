import React from 'react';

export interface IPCRecommendation {
  section: string;
  act: string;
  title: string;
  description: string;
  applicability: string;
}

interface IPCRecommendationsProps {
  recommendations: IPCRecommendation[];
  isLoading?: boolean;
}

export const IPCRecommendationsDisplay: React.FC<IPCRecommendationsProps> = ({ 
  recommendations, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">📖</span>
          Applicable Legal Sections
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">📖</span>
          Applicable Legal Sections
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">⚖️</div>
          <p className="text-gray-500">
            No specific legal sections found for this case type.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Please check your litigation type and incident descriptions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-between">
        <span className="flex items-center">
          <span className="mr-2">📖</span>
          Applicable Legal Sections
        </span>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {recommendations.length} found
        </span>
      </h3>
      
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition-colors">
            <div className="mb-3">
              <h4 className="font-bold text-blue-900 text-lg flex items-center">
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-2">
                  {rec.section}
                </span>
              </h4>
              <p className="text-sm text-blue-700 font-medium mt-1">
                📜 {rec.act}
              </p>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-800 font-medium text-sm">
                <span className="text-blue-600 font-semibold">Subject:</span> {rec.title}
              </p>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold text-blue-600">Why Applicable:</span> {rec.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {rec.applicability}
              </div>
              <div className="text-xs text-gray-500">
                Recommendation #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">💡 Note:</span> These recommendations are AI-generated based on your case details. 
          Please consult with your legal counsel for final verification.
        </p>
      </div>
    </div>
  );
};

export default IPCRecommendationsDisplay;
