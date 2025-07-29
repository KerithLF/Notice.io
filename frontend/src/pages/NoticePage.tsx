import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NoticeData } from '../types/notice';
// import { useLocation } from 'react-router-dom';

interface Incident {
  date: string;
  description: string;
}

export const NoticePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<NoticeData>({
    litigation_type: '',
    tone: 'formal',
    issue_date: '',
    subject: '',
    sender_name: '',
    sender_address: '',
    senderFather_name: '',
    sender_mail: '',
    sender_phone: '',
    recipient_name: '',
    recipientFather_name: '',
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

  const editFormData = location.state?.formData as NoticeData;

  useEffect(() => {
    if(editFormData) setFormData(editFormData)
  },[editFormData])

  console.log(formData)

  const [subLitigationTypes, setSubLitigationTypes] = useState<string[]>([]);

  const litigationTypeOptions: { [key: string]: string[] } = {
    'Civil': ['Contract Dispute', 'Property Dispute', 'Tort', 'Consumer Dispute', 'Cheque Bounce'],
    'Criminal': ['Theft', 'Assault', 'Fraud', 'Cyber Crime', 'Cheque Bounce'],
    'Employment Law': ['Wrongful Termination', 'Workplace Harassment', 'Wage Dispute'],
    'Property': ['Ownership', 'Boundary', 'Tenancy', 'Trespassing'],
    'Family': ['Divorce', 'Child Custody', 'Alimony'],
    'Administrative': ['Licensing', 'Regulatory Compliance'],
    'IP': ['Patent', 'Trademark', 'Copyright'],
    'Tax': ['Income Tax', 'GST', 'Corporate Tax'],
    'Insolvency and Bankruptcy': ['Personal Insolvency', 'Corporate Insolvency'],
    'Environmental': ['Pollution', 'Wildlife Protection'],
    'Public Interest': ['Constitutional', 'Social Justice'],
  };

  // Update sub-litigation types when main type changes
  const handleLitigationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, litigation_type: value, sub_litigation_type: '' }));
    setSubLitigationTypes(litigationTypeOptions[value] || []);
  };

  // const { state } = useLocation();
  // const [formData, setFormData] = useState({
  //   litigationType: state?.litigationType || "",
  //   tone: state?.tone || "",
  //   issueDate: state?.issueDate || "",
  //   problemDate: state?.problemDate || "",
  //   caseDescription: state?.caseDescription || "",
  //   noticePeriod: state?.noticePeriod || "",
  //   sender: state?.sender || {},
  //   recipient: state?.recipient || {},
  //   selectedTemplate: state?.selectedTemplate || "",
  // });

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
      <div className="max-w-[80%] mx-auto">
        <h1 className="text-3xl text-center font-bold text-[#1A1A1A] mb-2">Generate Legal Notice </h1>
        <p className="text-gray-600 mb-8 text-center">Fill in the details to generate a professional legal notice</p>

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
                  onChange={handleLitigationTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                >
                  <option value="">Select litigation type</option>
                  <option value="Employment Law">Employment Law</option>
                  <option value="Civil">Civil Litigation</option>
                  <option value="Criminal">Criminal Litigation</option>
                  <option value="Property">Property Dispute</option>
                  <option value="Family">Family Law</option>
                  <option value="Administrative">Administrative Litigation</option>
                  <option value="IP">IP Litigation</option>
                  <option value="Tax">Tax Litigation</option>
                  <option value="Insolvency and Bankruptcy">Insolvency & Bankruptcy</option>
                  <option value="Environmental">Environmental Law</option>
                  <option value="Public Interest">Public Interest Litigation</option>
                </select>
                {/* Sub-litigation type dropdown */}
                {subLitigationTypes.length > 0 && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub-Type
                    </label>
                    <select
                      name="sub_litigation_type"
                      value={formData.sub_litigation_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                      required
                    >
                      <option value="">Select sub-type</option>
                      {subLitigationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}
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
                  <option value="Assertive">Assertive</option>
                  <option value="Empathetic">Empathetic</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Negotiatory">Formal</option>
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
              <div className="flex flex-row gap-4">
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type='text'
                  name='senderFather_name'
                  value={formData.senderFather_name}
                  onChange={handleInputChange}
                  placeholder='Father Name'
                  className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent'
                  required
                />
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="sender_mail"
                  value={formData.sender_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Recipient Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recipient Details</h3>
              <div className="flex flex-row gap-4">
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type='text'
                  name='recipientFather_name'
                  value={formData.recipientFather_name}
                  onChange={handleInputChange}
                  placeholder='Father Name'
                  className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent'
                  required
                />
                <input
                  type="text"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="recipient_mail"
                  value={formData.recipient_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Council Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Council Details</h3>
              <div className="flex flex-row gap-4">
                <input
                  type="text"
                  name="council_name"
                  value={formData.council_name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="council_address"
                  value={formData.council_address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="council_mail"
                  value={formData.council_mail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="council_phone"
                  value={formData.council_phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
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
              <h3 className="text-lg font-medium text-gray-900 mb-3">Prayer</h3>
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