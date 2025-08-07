<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { NoticeData, Field } from "../types/notice";
import { TemplateSelector } from "./TemplateSelector";
import { AIRecommendations } from "./AIRecommendations";
import { IncidentsSection } from "./IncidentsSection";
import { getLitigationFields } from '../api/notice';

interface DynamicFormProps {
  onFieldChange: (fieldName: string, value: string) => void;
  litigation_type: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ onFieldChange, litigation_type }) => {
  const [dynamicFields, setDynamicFields] = useState<Field[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        if (litigation_type) {
          const data = await getLitigationFields(litigation_type);
          setDynamicFields(data);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };

      fetchFields();
  }, [litigation_type]);

  return (
    <div className="space-y-4">
      {dynamicFields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type="text"
            id={field.name}
            name={field.name}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
};
=======
import React, { useState } from 'react';
import { NoticeData } from '../types/notice';
import { TemplateSelector } from './TemplateSelector';
import { AIRecommendations } from './AIRecommendations';

interface DynamicFormProps {
  onSubmit: (data: NoticeData) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NoticeData>({
    litigationType: '',
    tone: 'formal',
    subject: '',
    issueDate: '',
    caseDescription: '',
    customFields: {},
    selectedTemplate: ''
  });

  const litigationTypes = [
    { value: 'civil', label: 'Civil Litigation' },
    { value: 'criminal', label: 'Criminal Litigation' },
    { value: 'family', label: 'Family Law' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'property', label: 'Property Dispute' },
    { value: 'employment', label: 'Employment Law' }
  ];

  const tones = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'stern', label: 'Stern' },
    { value: 'diplomatic', label: 'Diplomatic' }
  ];

  const getDynamicFields = () => {
    switch (formData.litigationType) {
      case 'civil':
        return [
          { key: 'plaintiff', label: 'Plaintiff Name', type: 'text' },
          { key: 'defendant', label: 'Defendant Name', type: 'text' },
          { key: 'claimAmount', label: 'Claim Amount', type: 'number' }
        ];
      case 'criminal':
        return [
          { key: 'accused', label: 'Accused Name', type: 'text' },
          { key: 'crimeType', label: 'Type of Crime', type: 'text' },
          { key: 'policeStation', label: 'Police Station', type: 'text' }
        ];
      case 'family':
        return [
          { key: 'petitioner', label: 'Petitioner Name', type: 'text' },
          { key: 'respondent', label: 'Respondent Name', type: 'text' },
          { key: 'marriageDate', label: 'Marriage Date', type: 'date' }
        ];
      case 'corporate':
        return [
          { key: 'companyName', label: 'Company Name', type: 'text' },
          { key: 'breachType', label: 'Breach Type', type: 'text' },
          { key: 'contractDate', label: 'Contract Date', type: 'date' }
        ];
      case 'property':
        return [
          { key: 'propertyAddress', label: 'Property Address', type: 'text' },
          { key: 'propertyType', label: 'Property Type', type: 'text' },
          { key: 'disputeNature', label: 'Nature of Dispute', type: 'text' }
        ];
      case 'employment':
        return [
          { key: 'employer', label: 'Employer Name', type: 'text' },
          { key: 'employee', label: 'Employee Name', type: 'text' },
          { key: 'terminationDate', label: 'Termination Date', type: 'date' }
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [key]: value
      }
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({ ...prev, selectedTemplate: templateId }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Notice Details</h2>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Litigation Type
            </label>
            <select
              value={formData.litigationType}
              onChange={(e) => setFormData(prev => ({ ...prev, litigationType: e.target.value }))}
              className="input-style focus-gold"
              required
            >
              <option value="">Select litigation type</option>
              {litigationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
              className="input-style focus-gold"
            >
              {tones.map(tone => (
                <option key={tone.value} value={tone.value}>
                  {tone.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="input-style focus-gold"
              placeholder="Enter the subject of your legal notice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              className="input-style focus-gold"
              placeholder="dd-mm-yyyy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Description
            </label>
            <textarea
              value={formData.caseDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, caseDescription: e.target.value }))}
              rows={4}
              className="input-style focus-gold"
              placeholder="Describe the case details, parties involved, and specific circumstances..."
              required
            />
          </div>

          {/* Dynamic Fields */}
          {getDynamicFields().map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData.customFields[field.key] || ''}
                onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                className="input-style focus-gold"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Generate Notice
          </button>
        </form>
      </div>

      <TemplateSelector
        selectedTemplate={formData.selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
        litigationType={formData.litigationType}
      />

      <AIRecommendations
        formData={formData}
        selectedTemplate={formData.selectedTemplate}
      />
    </div>
  );
};
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
