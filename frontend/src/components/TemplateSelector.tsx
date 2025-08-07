import React from 'react';
<<<<<<< HEAD
=======
import { FileText, AlertTriangle, Users } from 'lucide-react';
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27

interface Template {
  id: string;
  title: string;
  description: string;
<<<<<<< HEAD
  litigation_type: string;
  preview: string;
}

interface TemplateSelectorProps {
  selected_template: string;
  onTemplateSelect: (templateId: string) => void;
  litigation_type: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selected_template,
  onTemplateSelect,
  litigation_type
}) => {
  const getTemplatesForLitigationType = (type: string): Template[] => {
    // Example templates - in a real app, these would come from an API
    const allTemplates: Template[] = [
          {
            id: 'breach-of-contract',
            title: 'Breach of Contract',
        description: 'Standard template for contract breach notices',
        litigation_type: 'civil',
        preview: 'Dear [Recipient],\n\nThis is regarding the breach of contract...'
      },
          {
            id: 'property-dispute',
            title: 'Property Dispute',
        description: 'Template for property-related legal notices',
        litigation_type: 'property',
        preview: 'Dear [Recipient],\n\nThis is regarding the property dispute...'
          },
          {
        id: 'employment',
        title: 'Employment Dispute',
        description: 'Template for employment-related notices',
        litigation_type: 'employment',
        preview: 'Dear [Recipient],\n\nThis is regarding your employment...'
      },
          {
        id: 'criminal',
        title: 'Criminal Complaint',
        description: 'Template for criminal complaint notices',
        litigation_type: 'criminal',
        preview: 'Dear [Recipient],\n\nThis is to inform you about the criminal complaint...'
          }
        ];

    return allTemplates.filter(template => template.litigation_type === type);
  };

  const templates = getTemplatesForLitigationType(litigation_type);

  if (!litigation_type) {
    return (
      <div className="text-center text-gray-500 p-4">
        Please select a litigation type to view available templates
=======
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
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
<<<<<<< HEAD
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template.id)}
            className={`p-4 rounded-lg text-left transition-colors ${
              selected_template === template.id ? 'bg-[#D6A767] text-white' : 'bg-gray-100 text-gray-600'
            } hover:bg-[#E6D0B1] hover:text-gray-900`}
          >
            <h4 className="font-semibold mb-1">{template.title}</h4>
            <p className="text-sm opacity-90">{template.description}</p>
          </button>
=======
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
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
        ))}
      </div>
    </div>
  );
};