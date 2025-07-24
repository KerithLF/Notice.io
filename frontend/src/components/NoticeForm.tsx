import React, { useState } from 'react';
import { DynamicForm } from './DynamicForm';
import { NoticeData } from '../types/notice';

interface NoticeFormProps {
  onSubmit: (data: NoticeData) => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NoticeData>({
    litigation_type: '',
    tone: 'formal',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDynamicFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notice Type
          </label>
          <select
            name="litigation_type"
            value={formData.litigation_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a notice type</option>
            <option value="eviction">Eviction</option>
            <option value="payment">Payment Recovery</option>
            <option value="employment">Employment Termination</option>
            <option value="contract">Contract Breach</option>
            <option value="loan">Loan Default</option>
            <option value="cheque">Cheque Bounce</option>
            <option value="consumer">Consumer Complaint</option>
            <option value="defamation">Defamation</option>
            <option value="lease">Lease Termination</option>
            <option value="ip">IP Infringement</option>
            <option value="construction">Construction Delay</option>
            <option value="property">Property Damage</option>
            <option value="harassment">Workplace Harassment</option>
            <option value="environmental">Environmental Violation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="firm">Firm</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>

        {/* Standard Fields */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Case Description
          </label>
          <textarea
            name="case_description"
            value={formData.case_description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Issue Date
          </label>
          <input
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Problem Date
          </label>
          <input
            type="date"
            name="problem_date"
            value={formData.problem_date}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Sender Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Sender Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="sender_name"
              placeholder="Sender Name"
              value={formData.sender_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="sender_address"
              placeholder="Sender Address"
              value={formData.sender_address}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="sender_title"
              placeholder="Sender Title (optional)"
              value={formData.sender_title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              name="sender_company"
              placeholder="Sender Company (optional)"
              value={formData.sender_company}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="email"
              name="sender_mail"
              placeholder="Sender Email"
              value={formData.sender_mail}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="tel"
              name="sender_phone"
              placeholder="Sender Phone"
              value={formData.sender_phone}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Recipient Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Recipient Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="recipient_name"
              placeholder="Recipient Name"
              value={formData.recipient_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="recipient_address"
              placeholder="Recipient Address"
              value={formData.recipient_address}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="recipient_title"
              placeholder="Recipient Title (optional)"
              value={formData.recipient_title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              name="recipient_company"
              placeholder="Recipient Company (optional)"
              value={formData.recipient_company}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="email"
              name="recipient_mail"
              placeholder="Recipient Email"
              value={formData.recipient_mail}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="tel"
              name="recipient_phone"
              placeholder="Recipient Phone"
              value={formData.recipient_phone}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Additional Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notice Period
          </label>
          <input
            type="text"
            name="notice_period"
            value={formData.notice_period}
            onChange={handleInputChange}
            placeholder="e.g., 30 days"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Amount (if applicable)
          </label>
          <input
            type="text"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleInputChange}
            placeholder="e.g., ₹50,000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Signature
          </label>
          <input
            type="text"
            name="signature"
            value={formData.signature}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      {/* Dynamic Fields based on Notice Type */}
      {formData.litigation_type && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
          <DynamicForm
            litigation_type={formData.litigation_type}
            onFieldChange={handleDynamicFieldChange}
          />
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Notice
        </button>
      </div>
    </form>
  );
};

export default NoticeForm;