<<<<<<< HEAD
import React, { useState } from 'react';
import { DynamicForm } from './DynamicForm';
import { NoticeData } from '../types/notice';

interface NoticeFormProps {
  onSubmit: (data: NoticeData) => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NoticeData>({
    subject: '',
    litigation_type: '',
    tone: 'formal',
    issue_date: '',
    sender_name: '',
    senderFather_name: '',
    sender_address: '',
    sender_mail: '',
    sender_phone: '',
    council_name: '',
    council_address: '',
    council_mail: '',
    council_phone: '',
    contributor_name: '',
    contributor_address: '',
    contributor_mail: '',
    contributor_phone: '',
    custom_fields: {},
    recipients: [],
    incidents: [],
    conclusion: ''
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
        {/* <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Case Description
          </label>
          <textarea
            name="case_description"
            value={formData.case_description || ""}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div> */}

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

        {/* <div>
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
        </div> */}

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
            {/* <input
              type="text"
              name="sender_title"
              placeholder="Sender Title (optional)"
              value={formData.sender_title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
            {/* <input
              type="text"
              name="sender_company"
              placeholder="Sender Company (optional)"
              value={formData.sender_company}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
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
            {/* <input
              type="text"
              name="recipient_name"
              placeholder="Recipient Name"
              value={formData.recipient_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            /> */}
            {/* <input
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
            /> */}
          </div>
        </div>

        {/* Council Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Council Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="council_name"
              placeholder="Council Name"
              value={formData.council_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="council_address"
              placeholder="Council Address"
              value={formData.council_address}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            {/* <input
              type="text"
              name="sender_title"
              placeholder="Sender Title (optional)"
              value={formData.sender_title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
            {/* <input
              type="text"
              name="sender_company"
              placeholder="Sender Company (optional)"
              value={formData.sender_company}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
            <input
              type="email"
              name="council_mail"
              placeholder="Council Email"
              value={formData.council_mail}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="tel"
              name="council_phone"
              placeholder="Council Phone"
              value={formData.council_phone}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        {/* Contributor Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Contributor Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="contributor_name"
              placeholder="Contributor Name"
              value={formData.contributor_name}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="text"
              name="contributor_address"
              placeholder="Contributor Address"
              value={formData.contributor_address}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            {/* <input
              type="text"
              name="sender_title"
              placeholder="Sender Title (optional)"
              value={formData.sender_title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
            {/* <input
              type="text"
              name="sender_company"
              placeholder="Sender Company (optional)"
              value={formData.sender_company}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            /> */}
            <input
              type="email"
              name="contributor_mail"
              placeholder="Contributor Email"
              value={formData.contributor_mail}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <input
              type="tel"
              name="contributor_phone"
              placeholder="Contributor Phone"
              value={formData.contributor_phone}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>


        {/* Additional Fields */}
        {/* <div>
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
        </div> */}

        {/* <div>
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
        </div> */}

        {/* <div>
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
      </div> */}

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
      </div>
=======
import React, { useEffect, useState } from "react";
import { generateNotice, getTemplates, getLitigationFields } from "../api/notice";

// Fetch IPC recommendations based on subject
async function getIpcRecommendations(subject: string) {
  const res = await fetch(`http://localhost:8000/ipc-recommendations?subject=${encodeURIComponent(subject)}`);
  return res.json();
}

const NoticeForm: React.FC = () => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [fields, setFields] = useState<{ name: string; label: string }[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [notice, setNotice] = useState<string>("");
  const [ipc, setIpc] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [ipcRecommendations, setIpcRecommendations] = useState<string[]>([]);
  const [subjectLoading, setSubjectLoading] = useState(false);

  useEffect(() => {
    getTemplates().then((data) => setTemplates(data.templates));
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      getLitigationFields(selectedTemplate).then((data) => setFields(data.fields));
    } else {
      setFields([]);
    }
    setFormData({});
    setNotice("");
    setIpc("");
  }, [selectedTemplate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  // Only fetch IPC recommendations when user clicks Enter button
  const handleSubjectRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setSubjectLoading(true);
    const data = await getIpcRecommendations(subject);
    setIpcRecommendations(data.recommendations || []);
    setSubjectLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("selected_type", selectedTemplate);
    fields.forEach((field) => fd.append(field.name, formData[field.name] || ""));
    fd.append("tone", formData.tone || "formal");
    fd.append("case_description", formData.case_description || "");  // Add case description
    fd.append("issue_date", formData.issue_date || new Date().toISOString().split('T')[0]);
    fd.append("problem_date", formData.problem_date || "");
    fd.append("notice_period", formData.notice_period || "7 days");
    fd.append("total_amount", formData.total_amount || "");
    fd.append("sender_name", formData.sender_name || "");
    fd.append("sender_address", formData.sender_address || "");
    fd.append("sender_title", formData.sender_title || "");
    fd.append("sender_company", formData.sender_company || "");
    fd.append("recipient_name", formData.recipient_name || "");
    fd.append("recipient_address", formData.recipient_address || "");
    fd.append("recipient_title", formData.recipient_title || "");
    fd.append("recipient_company", formData.recipient_company || "");
    fd.append("signature", formData.signature || "");
    // Add file if needed: fd.append("file", fileInput.files[0])
    const result = await generateNotice(fd);
    setNotice(result.notice);
    setIpc(result.ipc);
    setLoading(false);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
    setIpcRecommendations([]); // Clear recommendations on subject change
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <label className="block">
        Select Template:
        <select value={selectedTemplate} onChange={handleTemplateChange} className="ml-2 border rounded">
          <option value="">-- Select --</option>
          {templates.map((tpl) => (
            <option key={tpl} value={tpl}>{tpl}</option>
          ))}
        </select>
      </label>
      {/* Subject field with Enter button */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block">Subject:</label>
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={handleSubjectChange}
            className="border rounded w-full p-1"
          />
        </div>
        <button
          type="button"
          onClick={handleSubjectRecommend}
          className="bg-green-600 text-white px-3 py-2 rounded mt-6"
          disabled={subjectLoading}
        >
          {subjectLoading ? "Loading..." : "Enter"}
        </button>
      </div>
      {/* Show IPC recommendations */}
      {ipcRecommendations.length > 0 && (
        <div className="mb-2">
          <h3 className="font-semibold">Recommended IPC Sections (from subject)</h3>
          <div className="flex flex-wrap gap-2">
            {ipcRecommendations.map((ipc, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer">
                {ipc}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Add case description field */}
      <div>
        <label className="block">Case Description:</label>
        <textarea
          name="case_description"
          value={formData.case_description || ""}
          onChange={handleInputChange}
          className="border rounded w-full p-1 h-32"
          placeholder="Enter the details of your case..."
        />
      </div>
      {/* Dynamic fields based on template */}
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block">{field.label}:</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="border rounded w-full p-1"
          />
        </div>
      ))}
      <label className="block">Tone:
        <select name="tone" value={formData.tone || "formal"} onChange={handleInputChange} className="ml-2 border rounded">
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Generating..." : "Generate Notice"}
      </button>
      {notice && (
        <div className="mt-4">
          <h2 className="font-bold">Generated Notice</h2>
          <textarea className="w-full h-40 border rounded" value={notice} readOnly />
        </div>
      )}
      {ipc && (
        <div className="mt-2">
          <h3 className="font-semibold">Recommended IPC Sections</h3>
          <div className="bg-gray-100 p-2 rounded">{ipc}</div>
        </div>
      )}
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
    </form>
  );
};

export default NoticeForm;