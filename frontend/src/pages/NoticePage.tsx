<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NoticeData } from '../types/notice';
import { IncidentsSection } from '../components/IncidentsSection';
import { MapPinnedIcon } from 'lucide-react';
import {
  User,
  Phone,
  Mail,
} from "lucide-react";
// import { useLocation } from 'react-router-dom';



interface Recipient {
  recipient_name: string;
  recipientFather_name: string;
  recipient_address: string;
  recipient_mail: string;
  recipient_phone: string;
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
    council_name: '',
    council_address: '',
    council_mail: '',
    council_phone: '',
    contributor_name: '',
    contributor_address: '',
    contributor_mail: '',
    contributor_phone: '',
    recipients: [
      {
        recipient_name: '',
        recipientFather_name: '',
        recipient_address: '',
        recipient_mail: '',
        recipient_phone: '',
      },
    ],
    incidents: [
      { date: '', description: '', month: '', year: '', fullDate: '' },
      { date: '', description: '', month: '', year: '', fullDate: '' },
      { date: '', description: '', month: '', year: '', fullDate: '' }
    ],
    conclusion: '',
    custom_fields: {}
  });

  const editFormData = location.state?.formData as NoticeData;

  useEffect(() => {
    if (editFormData) setFormData(editFormData)
  }, [editFormData])

  console.log(formData)

  const [subLitigationTypes, setSubLitigationTypes] = useState<string[]>([]);

  // Issue date state
  const [issueDateMode, setIssueDateMode] = useState<'full' | 'month-year'>('full');
  const [issueMonth, setIssueMonth] = useState('');
  const [issueYear, setIssueYear] = useState('');

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

  // Remove handleAddRecipient (old version)
  // Add new handlers for recipients:
  const handleRecipientChange = (index: number, field: keyof Recipient, value: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) =>
        i === index ? { ...recipient, [field]: value } : recipient
      ),
    }));
  };

  const handleAddRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [
        ...prev.recipients,
        {
          recipient_name: '',
          recipientFather_name: '',
          recipient_address: '',
          recipient_mail: '',
          recipient_phone: '',
        },
      ],
    }));
  };

  const handleRemoveRecipient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the notice preview page with form data
    navigate('/notice-preview', { state: { formData } });
  };

  console.log(formData)

  return (
    <div className="min-h-screen bg-[#FAF6F3] p-6">
      <div className="max-w-[80%] mx-auto">
        <h1 className="text-3xl text-center font-bold text-[#1A1A1A] mb-2">Generate Legal Notice </h1>
        <p className="text-gray-600 mb-8 text-center">Fill in the details to generate a professional legal notice</p>

        <div className="bg-white rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4 py-2">
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

              {
                  formData.sub_litigation_type === "Cheque Bounce" && (
                    <>
                      <div className='flex flex-row justify-between w-xl'>
                        <div className='flex flex-col gap-1'>
                          <label>Check_issue_date</label>
                          <input
                            type="date"
                            name="Check_issue_date"
                            value={formData.check_issue_date}
                            onChange={handleInputChange}
                            className="w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                            required
                          />
                        </div>

                        <div className='flex flex-col gap-1'>
                          <label>Check_issue_date</label>
                          <input
                            type="date"
                            name="Check_withdraw_date"
                            value={formData.check_withdraw_date}
                            onChange={handleInputChange}
                            className="w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )
                }

            </div>

            {/* Issue Date & Subject */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <div className='flex flex-row justify-between'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setIssueDateMode(mode => (mode === 'full' ? 'month-year' : 'full'))}
                    className="px-3 h-8 w-13 py-1 text-sm bg-[#D6A767] mb-2 text-white rounded hover:bg-[#c49655] transition-colors"
                  >
                    {issueDateMode === 'full' ? 'Month & Year' : 'Full Date'}
                  </button>
                </div>
                {/* 5. In the Issue Date field, replace the input with the toggle UI */}
                <div className="flex items-center gap-2">
                  {issueDateMode === 'full' ? (
                    <input
                      type="date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleInputChange}
                      className="w-[550px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                      required
                    />
                  ) : (
                    <>
                      <select
                        value={issueMonth}
                        onChange={e => setIssueMonth(e.target.value)}
                        className="px-2 py-2 border rounded w-[250px]"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={issueYear}
                        onChange={e => setIssueYear(e.target.value)}
                        placeholder="Year"
                        className="px-2 py-2 border rounded w-24 w-[250px]"
                        min={1900}
                        max={2100}
                      />
                    </>
                  )}

                </div>
              </div>
              <div>
                <label className="block text-sm mb-5 font-medium text-gray-700 mb-1">
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
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="w-full sm:w-72">
                  <div className='flex flex-row gap-1 text-center'>
                    <User className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-full sm:w-72">
                  <div className='flex flex-row gap-1 text-center'>
                    <User className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="senderFather_name"
                    value={formData.senderFather_name}
                    onChange={handleInputChange}
                    placeholder="Father Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-full sm:w-72">
                  <div className='flex flex-row gap-1 text-center'>
                    <MapPinnedIcon className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                  </div>
                  <input
                    type="text"
                    name="sender_address"
                    value={formData.sender_address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-full sm:w-72">
                  <div className='flex flex-row gap-1 text-center'>
                    <Mail className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mail
                    </label>
                  </div>
                  <input
                    type="email"
                    name="sender_mail"
                    value={formData.sender_mail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-full sm:w-72">
                  <div className='flex flex-row gap-1 text-center'>
                    <Phone className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile No
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="sender_phone"
                    value={formData.sender_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div>
              <div className='flex flex-row  justify-between'>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recipient Details</h3>
                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="px-3 h-8 w-13 mb-3 py-1 text-sm bg-[#D6A767] text-white rounded hover:bg-[#c49655] transition-colors"
                >
                  + Add Recipient
                </button>
              </div>
              {formData.recipients.map((recipient, idx) => (
                <div key={idx} className="flex flex-row gap-4 mb-2 relative flex-nowrap py-8">
                  <div className="w-72 sm:w-72">
                    <div className='flex flex-row gap-1 text-center'>
                      <User className='text-[#000000] h-5' />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                    </div>
                    <input
                      type="text"
                      name="recipient_name"
                      value={recipient.recipient_name}
                      onChange={e => handleRecipientChange(idx, 'recipient_name', e.target.value)}
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="w-72 sm:w-72">
                    <div className='flex flex-row gap-1 text-center'>
                      <User className='text-[#000000] h-5' />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Father Name
                      </label>
                    </div>
                    <input
                      type='text'
                      name='recipientFather_name'
                      value={recipient.recipientFather_name}
                      onChange={e => handleRecipientChange(idx, 'recipientFather_name', e.target.value)}
                      placeholder='Father Name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent'
                      required
                    />
                  </div>
                  <div className="w-72 sm:w-72">
                    <div className='flex flex-row gap-1 text-center'>
                      <MapPinnedIcon className='text-[#000000] h-5' />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                    </div>
                    <input
                      type="text"
                      name="recipient_address"
                      value={recipient.recipient_address}
                      onChange={e => handleRecipientChange(idx, 'recipient_address', e.target.value)}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="w-72 sm:w-72">
                    <div className='flex flex-row gap-1 text-center'>
                      <Mail className='text-[#000000] h-5' />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mail
                      </label>
                    </div>
                    <input
                      type="email"
                      name="recipient_mail"
                      value={recipient.recipient_mail}
                      onChange={e => handleRecipientChange(idx, 'recipient_mail', e.target.value)}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="w-72 sm:w-72">
                    <div className='flex flex-row gap-1 text-center'>
                      <Phone className='text-[#000000] h-5' />
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile No
                      </label>
                    </div>
                    <input
                      type="tel"
                      name="recipient_phone"
                      value={recipient.recipient_phone}
                      onChange={e => handleRecipientChange(idx, 'recipient_phone', e.target.value)}
                      placeholder="Phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                      required
                    />
                  </div>
                  {formData.recipients.length > 1 && (

                    <button
                      type="button"
                      className="absolute top-0 right-4 mb-4 flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 border border-red-200 bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleRemoveRecipient(idx)}
                      aria-label="Remove incident"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>


                  )}
                </div>
              ))}
            </div>
            {/* Council Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Council Details</h3>
              <div className="flex flex-row gap-4 flex-wrap py-4">
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <User className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="council_name"
                    value={formData.council_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-[351px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <MapPinnedIcon className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                  </div>
                  <input
                    type="text"
                    name="council_address"
                    value={formData.council_address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <Mail className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mail
                    </label>
                  </div>
                  <input
                    type="email"
                    name="council_mail"
                    value={formData.council_mail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <Phone className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile No
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="council_phone"
                    value={formData.council_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Contributor Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contributor Details</h3>
              <div className="flex flex-row gap-4 flex-wrap py-4">
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <User className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="contributor_name"
                    value={formData.contributor_name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  />
                </div>
                <div className="w-[351px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <MapPinnedIcon className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                  </div>
                  <input
                    type="text"
                    name="contributor_address"
                    value={formData.contributor_address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  />
                </div>
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <Mail className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mail
                    </label>
                  </div>
                  <input
                    type="email"
                    name="contributor_mail"
                    value={formData.contributor_mail}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  />
                </div>
                <div className="w-[348px]">
                  <div className='flex flex-row gap-1 text-center'>
                    <Phone className='text-[#000000] h-5' />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile No
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="contributor_phone"
                    value={formData.contributor_phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  />
                </div>
              </div>
            </div>


            {/* Incidents */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">Incidents</h3>
              </div>
              <IncidentsSection
                incidents={formData.incidents}
                onChange={(updatedIncidents) => setFormData(prev => ({ ...prev, incidents: updatedIncidents }))}
              />
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
=======
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
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
        </div>
      </div>
    </div>
  );
};