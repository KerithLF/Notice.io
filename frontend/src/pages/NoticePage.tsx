import React, { useState } from 'react';
import { NoticeData } from '../types/notice';

export const NoticePage: React.FC = () => {
  const [formData, setFormData] = useState<NoticeData>({
    litigation_type: '',
    tone: 'formal',
    subject: '',
    case_description: '',
    issue_date: '',
    issue_month: '',
    issue_year: '',
    problem_date: '',
    notice_period: '',
    total_amount: '',
    sender_name: '',
    sender_address: '',
    sender_title: '',
    sender_company: '',
    sender_mail: '',
    sender_phone: '',
    recipient_name: '',
    recipient_address: '',
    recipient_title: '',
    recipient_company: '',
    recipient_mail: '',
    recipient_phone: '',
    signature: '',
    custom_fields: {},
    selected_template: ''
  });

  const [generatedNotice, setGeneratedNotice] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to generate notice
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Legal Notice</h1>
        <p className="text-gray-600 mb-6">Fill in the details to generate a professional legal notice</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Litigation Type
                  </label>
                  <select
                    name="litigation_type"
                    value={formData.litigation_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select litigation type</option>
                    <option value="Employment Law">Employment Law</option>
                    <option value="Civil">Civil Litigation</option>
                    <option value="Criminal">Criminal Litigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="stern">Stern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter the subject of your legal notice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Description
                </label>
                <textarea
                  name="case_description"
                  value={formData.case_description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Sender Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Sender Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="sender_address"
                    value={formData.sender_address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="email"
                    name="sender_mail"
                    value={formData.sender_mail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="tel"
                    name="sender_phone"
                    value={formData.sender_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Recipient Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recipient Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    name="recipient_address"
                    value={formData.recipient_address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="email"
                    name="recipient_mail"
                    value={formData.recipient_mail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="tel"
                    name="recipient_phone"
                    value={formData.recipient_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D6A767] text-white py-2 px-4 rounded-md hover:bg-[#c49655]"
              >
                Generate Notice
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">AI Generated Notice</h2>
              <span className="px-2 py-1 bg-[#D6A767] text-white text-sm rounded">New</span>
            </div>

            <div className="border rounded-lg p-4 min-h-[500px] mb-4 font-mono text-sm whitespace-pre-wrap">
              {generatedNotice || 'Your generated notice will appear here...'}
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Download
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Email
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};