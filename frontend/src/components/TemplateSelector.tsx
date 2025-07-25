import React from 'react';

interface Template {
  id: string;
  title: string;
  description: string;
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
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
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
        ))}
      </div>
    </div>
  );
};