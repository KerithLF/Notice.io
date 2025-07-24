import React, { useState } from 'react';
import NoticeForm from '../components/NoticeForm';

export const CreateNoticePage: React.FC = () => {
  const [noticeText, setNoticeText] = useState('');
  const [ipcSections, setIpcSections] = useState('');

  const handleNoticeSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:8000/generate-notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate notice');
      }

      const result = await response.json();
      setNoticeText(result.notice);
      setIpcSections(result.ipc);
    } catch (error) {
      console.error('Error generating notice:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Legal Notice</h1>
        <p className="mt-2 text-gray-600">Fill in the details below to generate your legal notice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <NoticeForm onSubmit={handleNoticeSubmit} />
        </div>

        {(noticeText || ipcSections) && (
          <div className="space-y-6">
            {ipcSections && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recommended IPC Sections</h2>
                <div className="prose max-w-none">
                  {ipcSections}
                </div>
              </div>
            )}

            {noticeText && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Generated Notice</h2>
                <div className="prose max-w-none whitespace-pre-wrap">
                  {noticeText}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};