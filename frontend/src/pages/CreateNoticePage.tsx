import React, { useState } from 'react';

export const CreateNoticePage: React.FC = () => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Create Legal Notice</h1>
          <p className="text-gray-600">Build your legal notice using IPC sections and custom content</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Case No.</label>
            <input
              type="text"
              value={caseNo}
              onChange={(e) => setCaseNo(e.target.value)}
              placeholder="2023-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notice subject"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
            />
            <button className="px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655]">
              Get IPC
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Using:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          >
            <option value="">Select Template</option>
            <option value="general">General Template</option>
            <option value="employment">Employment Template</option>
            <option value="property">Property Template</option>
          </select>
        </div>

        <div className="bg-white border rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">IPC Sections</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sender: {sender}</span>
              <span className="text-sm text-gray-500 mr-2">Recipient: {recipient}</span>
              <span className="text-sm text-gray-500">Case No: {caseNo}</span>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <div className="flex gap-2 mb-4">
              <button className="p-2 border rounded hover:bg-gray-50">
                <strong>B</strong>
              </button>
              <button className="p-2 border rounded hover:bg-gray-50">
                <em>I</em>
              </button>
              <button className="p-2 border rounded hover:bg-gray-50">
                <u>U</u>
              </button>
              <select className="px-2 border rounded">
                <option>14px</option>
                <option>16px</option>
                <option>18px</option>
              </select>
              <button className="p-2 border rounded hover:bg-gray-50">≡</button>
              <button className="p-2 border rounded hover:bg-gray-50">=</button>
              <button className="p-2 border rounded hover:bg-gray-50">≡</button>
              <button className="p-2 border rounded hover:bg-gray-50">≣</button>
              <button className="p-2 border rounded hover:bg-gray-50">☰</button>
            </div>
            <div className="min-h-[400px] p-4 border rounded-lg">
              <p className="text-gray-400">Start drafting your legal notice or apply AI suggestions.</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
              <span>Upload</span>
              <span className="text-blue-500">+</span>
            </button>
            <button className="px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655]">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};