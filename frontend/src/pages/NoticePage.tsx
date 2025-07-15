import React, { useState } from 'react';
import { DynamicForm } from '../components/DynamicForm';
import { NoticePreview } from '../components/NoticePreview';
import { NoticeEditor } from '../components/NoticeEditor';
import { NoticeData } from '../types/notice';

export const NoticePage: React.FC = () => {
  const [formData, setFormData] = useState<NoticeData>({
    litigationType: '',
    tone: 'formal',
    subject: '',
    issueDate: '',
    caseDescription: '',
    customFields: {}
  });
  
  const [generatedNotice, setGeneratedNotice] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotice, setEditedNotice] = useState<string>('');

  const handleFormSubmit = (data: NoticeData) => {
    setFormData(data);
    // Mock LLM generation
    const mockNotice = generateMockNotice(data);
    setGeneratedNotice(mockNotice);
    setEditedNotice(mockNotice);
  };

  const generateMockNotice = (data: NoticeData): string => {
    const tonePrefix = data.tone === 'formal' ? 'FORMAL LEGAL NOTICE' : 'NOTICE';
    
    return `${tonePrefix}

Subject: ${data.subject}

Date: ${data.issueDate}

TO WHOM IT MAY CONCERN,

This is to inform you that ${data.caseDescription}

The matter pertains to ${data.litigationType} proceedings and requires immediate attention.

You are hereby notified to take necessary action within the prescribed time limit failing which appropriate legal action will be initiated against you.

This notice is issued under the relevant provisions of law.

Yours faithfully,
[Legal Representative]`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Legal Notice</h1>
        <p className="text-gray-600">Fill in the details to generate a professional legal notice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DynamicForm onSubmit={handleFormSubmit} />
        </div>

        <div className="space-y-6">
          {generatedNotice && !isEditing && (
            <NoticePreview 
              notice={generatedNotice} 
              onEdit={() => setIsEditing(true)}
              formData={formData}
            />
          )}
          
          {isEditing && (
            <NoticeEditor
              notice={editedNotice}
              onChange={setEditedNotice}
              onSave={() => {
                setGeneratedNotice(editedNotice);
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};