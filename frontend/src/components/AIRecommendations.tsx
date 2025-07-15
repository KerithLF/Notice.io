import React, { useState, useEffect } from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'suggestion' | 'alert' | 'info';
  title: string;
  description: string;
  action?: string;
}

interface AIRecommendationsProps {
  formData: any;
  selectedTemplate: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  formData,
  selectedTemplate
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [formData, selectedTemplate]);

  const generateRecommendations = () => {
    const newRecommendations: Recommendation[] = [];

    // Template-based recommendations
    if (selectedTemplate === 'breach-of-contract') {
      newRecommendations.push({
        id: '1',
        type: 'suggestion',
        title: 'Add Contract Details',
        description: 'Include contract ID, date, and specific clauses that were breached.',
        action: 'Add contract reference number in the Contract ID field'
      });
    }

    // Form data-based recommendations
    if (formData.subject && formData.subject.toLowerCase().includes('payment')) {
      newRecommendations.push({
        id: '2',
        type: 'alert',
        title: 'Payment Terms',
        description: 'Specify exact payment amounts and due dates for clarity.',
        action: 'Include specific payment amounts and deadlines'
      });
    }

    if (formData.caseDescription && formData.caseDescription.length < 50) {
      newRecommendations.push({
        id: '3',
        type: 'info',
        title: 'Case Description',
        description: 'Consider adding more details to strengthen your legal position.',
        action: 'Expand case description with timeline and evidence'
      });
    }

    // IPC section recommendations
    if (formData.litigationType === 'criminal') {
      newRecommendations.push({
        id: '4',
        type: 'suggestion',
        title: 'IPC Section Recommendation',
        description: 'Consider adding relevant IPC sections like 420 (Cheating) or 406 (Criminal Breach of Trust).',
        action: 'Drag relevant IPC sections from the sidebar'
      });
    }

    setRecommendations(newRecommendations);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'suggestion':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'alert':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-[#D6A767]" />
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-lg border ${getRecommendationStyle(rec.type)} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getRecommendationIcon(rec.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                <p className="text-sm mb-2">{rec.description}</p>
                {rec.action && (
                  <div className="text-xs font-medium opacity-75">
                    💡 {rec.action}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#E6D0B1] rounded-lg">
        <p className="text-sm text-[#3C222F]">
          <strong>Pro Tip:</strong> These recommendations are generated based on your input and selected template. 
          Following them will help create a more comprehensive legal notice.
        </p>
      </div>
    </div>
  );
};