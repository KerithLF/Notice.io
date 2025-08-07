import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NoticeData } from '../types/notice';
import { IncidentsSection } from '../components/IncidentsSection';
import { MapPinnedIcon, AlertTriangle, Loader } from 'lucide-react';
import {
  User,
  Phone,
  Mail,
} from "lucide-react";
import { generateNotice } from '../api/notice';

// Add missing interfaces
interface WarningAlert {
  type: 'encashing_delay' | 'dishonor_delay' | 'early_notice' | 'duplicate_case' | 'standing_issue';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface IPCRecommendation {
  section: string;
  act: string;
  title: string;
  description: string;
  applicability: string;
}

interface NoticeResponse {
  notice_text: string;
  ipc_recommendations: IPCRecommendation[];
  warnings?: WarningAlert[];
}

interface Recipient {
  recipient_name: string;
  recipientFather_name: string;
  recipient_address: string;
  recipient_mail: string;
  recipient_phone: string;
}

// Warning Modal Component
const WarningModal: React.FC<{
  warnings: WarningAlert[];
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  isLoading?: boolean;
}> = ({ warnings, isOpen, onClose, onProceed, isLoading = false }) => {
  if (!isOpen || !warnings.length) return null;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'medium':
        return 'border-orange-500 bg-orange-50 text-orange-800';
      default:
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '⚡';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-xl font-semibold text-red-600">
              Legal Notice Warnings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="Close"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {warnings.map((warning: WarningAlert, index: number) => (
            <div
              key={`${warning.type}-${index}`}
              className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(warning.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-1">
                  {getSeverityIcon(warning.severity)}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-base">
                    {warning.title}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {warning.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Important:</strong> These warnings indicate potential legal issues.
            Please review your information carefully or consult with your lawyer before proceeding.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Review & Edit Details
            </button>
            <button
              onClick={onProceed}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
              <span>{isLoading ? 'Processing...' : 'Proceed Despite Warnings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoticePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Add warning-related state
  const [warnings, setWarnings] = useState<WarningAlert[]>([]);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<NoticeResponse | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  // API call function
  const generateNoticeWithWarnings = async (data: NoticeData): Promise<NoticeResponse> => {
    // Prepare the final issue date
    let finalIssueDate = data.issue_date;
    if (issueDateMode === 'month-year' && issueMonth && issueYear) {
      finalIssueDate = `${issueYear}-${issueMonth}-01`;
    }

    const requestData = {
      ...data,
      issue_date: finalIssueDate,
      litigation_type: data.litigation_type,
      sub_litigation_type: data.sub_litigation_type || '',
    };

    console.log('🔍 Sending request data:', requestData);

    const response = await generateNotice(requestData);

    console.log('🔍 Response:', response);


    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    // }

    return response as NoticeResponse;
  };

  // Navigate to preview with result
  const navigateToPreview = (result: NoticeResponse) => {
    setIsGenerating(false);
    navigate('/notice-preview', {
      state: {
        formData,
        noticeText: result.notice_text,
        ipcRecommendations: result.ipc_recommendations,
        warnings: result.warnings || []
      }
    });
  };

  // Updated form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      console.log('🚀 Starting notice generation...');

      // Call API to generate notice and check for warnings
      const result = await generateNoticeWithWarnings(formData);

      console.log('📄 API Response:', result);
      console.log('⚠️ Warnings received:', result.warnings);

      // Check for warnings
      if (result.warnings && result.warnings.length > 0) {
        console.log('🚨 Showing warning modal');
        setWarnings(result.warnings);
        setShowWarningModal(true);
        setPendingNavigation(result);
        setIsGenerating(false);
        return;
      }

      // No warnings, navigate directly to preview
      console.log('✅ No warnings, proceeding to preview');
      navigateToPreview(result);

    } catch (error) {
      console.error('❌ Error generating notice:', error);
      setIsGenerating(false);
      // Show user-friendly error message
      alert(`Error generating notice: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  // Warning modal handlers
  const handleProceedWithWarnings = async () => {
    if (pendingNavigation) {
      console.log('✅ Proceeding despite warnings');
      navigateToPreview(pendingNavigation);
      setShowWarningModal(false);
      setPendingNavigation(null);
      setWarnings([]);
    }
  };

  const handleCloseWarningModal = () => {
    console.log('📝 User chose to review details');
    setShowWarningModal(false);
    setPendingNavigation(null);
    setWarnings([]);
    setIsGenerating(false);
  };

  // Test warning function (for debugging)
  const testWarnings = () => {
    const mockWarnings: WarningAlert[] = [
      {
        type: 'encashing_delay',
        title: 'Delay in Encashing Warning',
        message: 'Dear Test User, from the information provided, there is a delay in encashing the cheque. Legal action can only be initiated when the cheque is encashed within 3 months from issue date or validity period, whichever is lesser.',
        severity: 'high'
      },
      {
        type: 'dishonor_delay',
        title: 'Notice Timing Warning',
        message: 'Dear Test User, there is a delay in informing the drawer about cheque dishonor. Notice must be issued within 30 days.',
        severity: 'medium'
      }
    ];

    setWarnings(mockWarnings);
    setShowWarningModal(true);
  };

  console.log('🔄 Current form data:', formData);

  return (
    <div className="min-h-screen bg-[#FAF6F3] p-6">
      <div className="max-w-[80%] mx-auto">
        <h1 className="text-3xl text-center font-bold text-[#1A1A1A] mb-2">Generate Legal Notice</h1>
        <p className="text-gray-600 mb-8 text-center">Fill in the details to generate a professional legal notice</p>

        <div className="bg-white rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Debug Test Button - Remove in production */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800 mb-2">
                🧪 <strong>Debug Tools:</strong>
              </p>
              <button
                type="button"
                onClick={testWarnings}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Test Warning Model
              </button>
            </div>

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
                // disabled={isGenerating}
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
                      value={formData.sub_litigation_type || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                      required
                    // disabled={isGenerating}
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
                // disabled={isGenerating}
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="Assertive">Assertive</option>
                  <option value="Empathetic">Empathetic</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Negotiatory">Negotiatory</option>
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
                  // disabled={isGenerating}
                  >
                    {issueDateMode === 'full' ? 'Month & Year' : 'Full Date'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {issueDateMode === 'full' ? (
                    <input
                      type="date"
                      name="issue_date"
                      value={formData.issue_date}
                      onChange={handleInputChange}
                      className="w-[550px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D6A767] focus:border-transparent"
                      required
                    // disabled={isGenerating}
                    />
                  ) : (
                    <>
                      <select
                        value={issueMonth}
                        onChange={e => setIssueMonth(e.target.value)}
                        className="px-2 py-2 border rounded w-[250px]"
                        // disabled={isGenerating}
                        required
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
                        className="px-2 py-2 border rounded w-[250px]"
                        min={1900}
                        max={2100}
                        // disabled={isGenerating}
                        required
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
                // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div>
              <div className='flex flex-row justify-between'>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recipient Details</h3>
                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="px-3 h-8 w-13 mb-3 py-1 text-sm bg-[#D6A767] text-white rounded hover:bg-[#c49655] transition-colors disabled:opacity-50"
                // disabled={isGenerating}
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
                    // disabled={isGenerating}
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
                    // disabled={isGenerating}
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
                    // disabled={isGenerating}
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
                    // disabled={isGenerating}
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
                    // disabled={isGenerating}
                    />
                  </div>
                  {formData.recipients.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-0 right-4 mb-4 flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-500 border border-red-200 bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                      onClick={() => handleRemoveRecipient(idx)}
                      aria-label="Remove recipient"
                    // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
                  // disabled={isGenerating}
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
              // disabled={isGenerating}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={isGenerating}
              className="w-full bg-[#D6A767] text-white py-3 rounded-md hover:bg-[#c49655] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Generating Notice...</span>
                </>
              ) : (
                <span>Generate Notice</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        warnings={warnings}
        isOpen={showWarningModal}
        onClose={handleCloseWarningModal}
        onProceed={handleProceedWithWarnings}
        isLoading={isGenerating}
      />

      {/* Debug Info - Remove in production */}
      {/* <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <div>🔄 Generating: {isGenerating ? 'YES' : 'NO'}</div>
        <div>⚠️ Warnings: {warnings.length}</div>
        <div>🔔 Modal: {showWarningModal ? 'OPEN' : 'CLOSED'}</div>
        <div>📋 Litigation: {formData.litigation_type || 'None'}</div>
        <div>📋 Sub-type: {formData.sub_litigation_type || 'None'}</div>
      </div> */}
    </div>
  );
};
