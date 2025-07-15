import React from 'react';
import { FileText, AlertTriangle, Users } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  litigationType: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  litigationType
}) => {
  const getTemplatesForLitigationType = (type: string): Template[] => {
    switch (type) {
      case 'contract':
        return [
          {
            id: 'breach-of-contract',
            title: 'Breach of Contract',
            description: 'Notice for failure to fulfill contractual obligations.',
            icon: <FileText className="h-6 w-6" />,
            category: 'Contract Law'
          },
          {
            id: 'contract-termination',
            title: 'Contract Termination',
            description: 'Formal notice to end a contract as per its terms.',
            icon: <AlertTriangle className="h-6 w-6" />,
            category: 'Contract Law'
          },
          {
            id: 'non-disclosure-agreement',
            title: 'Non-Disclosure Agreement (NDA)',
            description: 'Notice regarding violation of confidentiality agreement.',
            icon: <Users className="h-6 w-6" />,
            category: 'Contract Law'
          }
        ];
      case 'civil':
        return [
          {
            id: 'property-dispute',
            title: 'Property Dispute',
            description: 'Notice for property-related legal matters.',
            icon: <FileText className="h-6 w-6" />,
            category: 'Civil Law'
          },
          {
            id: 'debt-recovery',
            title: 'Debt Recovery',
            description: 'Notice for recovery of outstanding debts.',
            icon: <AlertTriangle className="h-6 w-6" />,
            category: 'Civil Law'
          }
        ];
      case 'criminal':
        return [
          {
            id: 'defamation',
            title: 'Defamation',
            description: 'Notice for defamatory statements or actions.',
            icon: <FileText className="h-6 w-6" />,
            category: 'Criminal Law'
          },
          {
            id: 'harassment',
            title: 'Harassment',
            description: 'Notice for harassment or threatening behavior.',
            icon: <AlertTriangle className="h-6 w-6" />,
            category: 'Criminal Law'
          }
        ];
      default:
        return [
          {
            id: 'general-notice',
            title: 'General Legal Notice',
            description: 'Standard legal notice template.',
            icon: <FileText className="h-6 w-6" />,
            category: 'General'
          }
        ];
    }
  };

  const templates = getTemplatesForLitigationType(litigationType);

  if (!litigationType) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Template</h3>
        <p className="text-gray-500">Please select a litigation type first to see available templates.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Template</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`template-card p-4 border-2 rounded-lg cursor-pointer ${
              selectedTemplate === template.id
                ? 'selected border-[#D6A767] bg-[#E6D0B1]'
                : 'border-gray-200 hover:border-[#D6A767]'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${
                selectedTemplate === template.id ? 'bg-[#D6A767] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {template.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{template.title}</h4>
                <span className="text-xs text-[#D6A767] font-medium">{template.category}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};