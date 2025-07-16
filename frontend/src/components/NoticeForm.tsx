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
    </form>
  );
};

export default NoticeForm;