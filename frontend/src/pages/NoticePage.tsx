import React, { useState } from 'react';
import { DynamicForm } from '../components/DynamicForm';
import { NoticePreview } from '../components/NoticePreview';
import { NoticeEditor } from '../components/NoticeEditor';
import { generateNotice } from '../api/notice';
import { NoticeData } from '../types/notice';

export const NoticePage: React.FC = () => {
  const [formData, setFormData] = useState<NoticeData>({
    selected_type: '',
    tone: 'formal',
    case_description: '',
    issue_date: '',
    problem_date: '',
    notice_period: '',
    total_amount: '',
    sender_name: '',
    sender_address: '',
    sender_title: '',
    sender_company: '',
    recipient_name: '',
    recipient_address: '',
    recipient_title: '',
    recipient_company: '',
    signature: '',
  });

  const [generatedNotice, setGeneratedNotice] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotice, setEditedNotice] = useState<string>('');

  const handleFormSubmit = async (data: NoticeData) => {
    try {
      const result = await generateNotice(data);
      setGeneratedNotice(result.notice);
      setEditedNotice(result.notice);
    } catch (error) {
      console.error('Error generating notice:', error);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Legal Notice</h1>
        <p className="text-gray-600">Fill in the details to generate a professional legal notice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DynamicForm
            litigationType={formData.selected_type}
            onFieldChange={handleFieldChange}
          />
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