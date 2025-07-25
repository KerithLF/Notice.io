import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoticeData } from '../types/notice';

interface Incident {
  date: string;
  description: string;
}

export const NoticePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NoticeData>({
    litigation_type: '',
    tone: 'formal',
    issue_date: '',
    subject: '',
    sender_name: '',
    sender_address: '',
    sender_mail: '',
    sender_phone: '',
    recipient_name: '',
    recipient_address: '',
    recipient_mail: '',
    recipient_phone: '',
    council_name: '',
    council_address: '',
    council_mail: '',
    council_phone: '',
    incidents: [
      { date: '', description: '' },
      { date: '', description: '' },
      { date: '', description: '' }
    ],
    conclusion: '',
    custom_fields: {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIncidentChange = (index: number, field: keyof Incident, value: string) => {
    setFormData(prev => ({
      ...prev,
      incidents: prev.incidents.map((incident, i) =>
        i === index ? { ...incident, [field]: value } : incident
      )
    }));
  };

  const handleAddIncident = () => {
    setFormData(prev => ({
      ...prev,
      incidents: [...prev.incidents, { date: '', description: '' }]
    }));
  };

  const handleRemoveIncident = (index: number) => {
    setFormData(prev => ({
      ...prev,
      incidents: prev.incidents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the notice preview page with form data
    navigate('/notice-preview', { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F3] p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Generate Legal Notice</h1>
        <p className="text-gray-600 mb-8">Fill in the details to generate a professional legal notice</p>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Litigation Type
                </label>
                <select
                  name="litigation_type"
                  value={formData.litigation_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                >
                  <option value="">Select litigation type</option>
                  <option value="Employment Law">Employment Law</option>
                  <option value="Civil">Civil Litigation</option>
                  <option value="Criminal">Criminal Litigation</option>
                  <option value="Property">Property Dispute</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="stern">Stern</option>
                </select>
              </div>
            </div>

            {/* Issue Date & Subject */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="sender_mail"
                  value={formData.sender_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="recipient_mail"
                  value={formData.recipient_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Council Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Council Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="council_name"
                  value={formData.council_name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="council_address"
                  value={formData.council_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="council_mail"
                  value={formData.council_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="council_phone"
                  value={formData.council_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Incidents */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">Incidents</h3>
                <button
                  type="button"
                  onClick={handleAddIncident}
                  className="px-3 py-1 text-sm bg-[#D6A767] text-white rounded hover:bg-[#c49655] transition-colors"
                >
                  + Add Incident
                </button>
              </div>
              {formData.incidents.map((incident, index) => (
                <div key={index} className="mb-4 relative">
                  <div className="flex gap-4 mb-2">
                    <input
                      type="date"
                      value={incident.date}
                      onChange={(e) => handleIncidentChange(index, 'date', e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                      required
                    />
                    {formData.incidents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveIncident(index)}
                        className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <textarea
                    value={incident.description}
                    onChange={(e) => handleIncidentChange(index, 'description', e.target.value)}
                    placeholder={`Incident ${index + 1}`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                    required
                  />
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Conclusion</h3>
              <textarea
                name="conclusion"
                value={formData.conclusion}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D6A767] text-white py-3 rounded-md hover:bg-[#c49655] transition-colors"
            >
              Generate Notice
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};