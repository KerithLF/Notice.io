import React, { useState } from 'react';
import DynamicForm from './DynamicForm';

interface NoticeFormProps {
  onSubmit: (data: any) => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    selected_type: '',
    issue_date: '',
    problem_date: '',
    case_description: '',
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
    tone: 'formal',
  });

  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDynamicFieldChange = (fieldName: string, value: string) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...dynamicFields
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notice Type
          </label>
          <select
            name="selected_type"
            value={formData.selected_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a notice type</option>
            <option value="Eviction">Eviction</option>
            <option value="Payment Recovery">Payment Recovery</option>
            <option value="Employment Termination">Employment Termination</option>
            <option value="Contract Breach">Contract Breach</option>
            <option value="Loan Default">Loan Default</option>
            <option value="Cheque Bounce">Cheque Bounce</option>
            <option value="Consumer Complaint">Consumer Complaint</option>
            <option value="Defamation">Defamation</option>
            <option value="Lease Termination">Lease Termination</option>
            <option value="Intellectual Property Infringement">IP Infringement</option>
            <option value="Construction Delay">Construction Delay</option>
            <option value="Property Damage">Property Damage</option>
            <option value="Workplace Harassment">Workplace Harassment</option>
            <option value="Environmental Violation">Environmental Violation</option>
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
      {formData.selected_type && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
          <DynamicForm
            litigationType={formData.selected_type}
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