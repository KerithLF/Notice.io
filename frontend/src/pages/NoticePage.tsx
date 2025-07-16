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
    caseDescription: '',
    customFields: {},
    selectedTemplate: '' // ✅ Fix: added missing property
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