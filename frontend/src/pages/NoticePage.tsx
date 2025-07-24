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
<<<<<<< HEAD
    subject: '',
    issueDate: '',
    problemDate: '',
    noticePeriod: '',
    totalAmount: '',
    senderName: '',
    senderAddress: '',
    senderTitle: '',
    senderCompany: '',
    recipientName: '',
    recipientAddress: '',
    recipientTitle: '',
    recipientCompany: '',
    signature: '',
    caseDescription: '',
    customFields: {},
    selectedTemplate: ''
=======
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
>>>>>>> 144cbd2748a49538cdc10526ac4f76f1cbcaa92e
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
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="w-full flex flex-col items-center py-12 mb-8 bg-transparent">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Generate Legal Notice</h1>
        <p className="text-lg text-gray-600 text-center mb-4">Fill in the details to generate a professional legal notice</p>
        <div className="w-24 h-1 bg-blue-200 rounded-full" />
      </header>

<<<<<<< HEAD
      {/* Main Content */}
      <main className="w-full px-0">
        <div className="grid grid-cols-1 w-full">
          {/* Form Section (increased width) */}
          <section className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center w-[70%]  mx-auto">
            <DynamicForm onSubmit={handleFormSubmit} />
          </section>
=======
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <DynamicForm
            litigationType={formData.selected_type}
            onFieldChange={handleFieldChange}
          />
>>>>>>> 144cbd2748a49538cdc10526ac4f76f1cbcaa92e
        </div>
      </main>
    </div>
  );
};