import React, { useEffect, useState } from 'react';
import { NoticeData } from '../types/notice';

interface AIRecommendationsProps {
  formData: NoticeData;
  selectedTemplate: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  formData,
  selectedTemplate
}) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Example recommendations based on form data
    const newRecommendations = [];

    // Check template-specific recommendations
    if (selectedTemplate === 'breach-of-contract') {
      newRecommendations.push('Consider including specific contract clauses that were breached');
      newRecommendations.push('Add dates of contract signing and breach occurrence');
    }

    // Check general form completeness
    if (!formData.sender_name || !formData.recipient_name) {
      newRecommendations.push('Ensure all party names are filled out completely');
    }

    if (!formData.issue_date) {
      newRecommendations.push('Adding an issue date helps establish the timeline of the notice');
    }

    // Check case description length
    if (formData.case_description && formData.case_description.length < 50) {
      newRecommendations.push('Consider providing more details in your case description');
    }

    // Litigation type specific recommendations
    if (formData.litigation_type === 'criminal') {
      newRecommendations.push('Include any relevant FIR numbers or police reports');
      newRecommendations.push('Specify the sections of IPC being invoked');
    }

    setRecommendations(newRecommendations);
  }, [formData, selectedTemplate]);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Recommendations</h3>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-blue-800 flex items-start">
            <span className="mr-2">•</span>
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
};