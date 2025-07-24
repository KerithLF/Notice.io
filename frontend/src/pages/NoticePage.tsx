import React, { useState } from 'react';
import { DynamicForm } from '../components/DynamicForm';
import { NoticePreview } from '../components/NoticePreview';
import { NoticeEditor } from '../components/NoticeEditor';
import { NoticeData } from '../types/notice';
import { generateNotice } from '../api/notice'; // Make sure this import is present

export const NoticePage: React.FC = () => {
  const [formData, setFormData] = useState<NoticeData>({
    litigationType: '',
    tone: 'formal',
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
  });


  const [generatedNotice, setGeneratedNotice] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotice, setEditedNotice] = useState<string>('');

  const handleFormSubmit = async (data: NoticeData) => {
    setFormData(data);

    // Prepare FormData for the backend
    const fd = new FormData();
    fd.append("selected_type", data.litigationType || data.selectedTemplate || "");
    fd.append("issue_date", data.issueDate || "");
    fd.append("problem_date", data.problemDate || "");
    fd.append("case_description", data.caseDescription || "");
    fd.append("notice_period", data.noticePeriod || "");
    fd.append("total_amount", data.totalAmount || "");
    fd.append("sender_name", data.senderName || "");
    fd.append("sender_address", data.senderAddress || "");
    fd.append("sender_title", data.senderTitle || "");
    fd.append("sender_company", data.senderCompany || "");
    fd.append("recipient_name", data.recipientName || "");
    fd.append("recipient_address", data.recipientAddress || "");
    fd.append("recipient_title", data.recipientTitle || "");
    fd.append("recipient_company", data.recipientCompany || "");
    fd.append("signature", data.signature || "");
    fd.append("tone", data.tone || "formal");

    // Call backend API
    const result = await generateNotice(fd);
    setGeneratedNotice(result.notice);
    setEditedNotice(result.notice);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="w-full flex flex-col items-center py-12 mb-8 bg-transparent">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Generate Legal Notice</h1>
        <p className="text-lg text-gray-600 text-center mb-4">Fill in the details to generate a professional legal notice</p>
        <div className="w-24 h-1 bg-blue-200 rounded-full" />
      </header>

      {/* Main Content */}
      <main className="w-full px-0">
        <div className="grid grid-cols-1 w-full">
          {/* Form Section (increased width) */}
          <section className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-center w-[70%]  mx-auto">
            <DynamicForm onSubmit={handleFormSubmit} />
          </section>
        </div>
      </main>
    </div>
  );
};