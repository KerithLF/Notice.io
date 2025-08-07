// frontend/src/components/IPCRecommendations.tsx
import React from 'react';
import { IPCRecommendation, IPCRecommendationsProps } from '../types/ipc';

export const IPCRecommendations: React.FC<IPCRecommendationsProps> = ({ 
    recommendations, 
    isLoading = false 
}) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="mr-2">📖</span>
                    Loading Applicable Legal Sections...
                </h3>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded w-1/3"></div>
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
                    <p className="text-gray-500 mb-2">
                        No specific legal sections found for this case type.
                    </p>
                    <p className="text-sm text-gray-400">
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
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-normal">
                    {recommendations.length} found
                </span>
            </h3>
            
            <div className="space-y-6">
                {recommendations.map((rec, index) => (
                    <div key={`section-${index}`} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition-colors">
                        <div className="mb-3">
                            <h4 className="font-bold text-blue-900 text-lg flex items-center">
                                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-2">
                                    Section {rec.section}
                                </span>
                                {rec.title}
                            </h4>
                        </div>
                        
                        <div className="mb-3">
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {rec.description}
                            </p>
                        </div>
                        
                        <div className="mt-4 bg-blue-100 p-3 rounded-md">
                            <h5 className="text-sm font-semibold text-blue-700 mb-1">
                                Why this section applies:
                            </h5>
                            <p className="text-sm text-gray-700">{rec.applicability}</p>
                        </div>

                        <div className="mt-2 text-xs text-gray-500 text-right">
                            Recommendation #{index + 1}
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

export default IPCRecommendations;