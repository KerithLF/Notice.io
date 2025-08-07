import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NoticeData } from '../types/notice';
import { generateNotice, downloadPdf, sendEmail, shareWhatsapp } from '../api/notice';
import { ArrowDownToLine, Check, Mail, Pencil } from 'lucide-react';

interface IPCRecommendation {
  section: string;
  title: string;
  description: string;
}

export const NoticePreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [ipcRecommendations, setIpcRecommendations] = useState<IPCRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isWhatsapping, setIsWhatsapping] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const formData = location.state?.formData as NoticeData;
  const [isEditing,SetIsEditing] = useState(false);
  const [editedNotice, setEditedNotice] = useState('');

  console.log(isEditing)

  useEffect(() => {
    if (!formData) {
      navigate('/generate');
      return;
    }

    const generateLegalNotice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await generateNotice(formData);
        setGeneratedNotice(response.notice_text);
        setIpcRecommendations(response.ipc_recommendations);
      } catch (err) {
        setError('Failed to generate notice. Please try again.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateLegalNotice();
  }, [formData, navigate]);

  const handleDownload = async () => {
    if (!generatedNotice) return;
    
    try {
      setIsDownloading(true);
      await downloadPdf(generatedNotice);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmail = async (emailData: {
    sender_email: string;
    sender_password: string;
    recipient_email: string;
    subject: string;
  }) => {
    if (!generatedNotice) return;
    
    try {
      setIsEmailing(true);
      await sendEmail({
        ...emailData,
        notice_text: generatedNotice
      });
      alert('Email sent successfully!');
      setShowEmailModal(false);
    } catch (err) {
      console.error('Email error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email. Please try again.';
      
      // Show detailed error message for authentication issues
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        alert(`Email Authentication Failed!\n\n${errorMessage}\n\n💡 Quick Fix:\n• For Gmail: Use an App Password instead of your regular password\n• For custom domains: Contact your IT administrator\n• Run 'python email_help.py' in the backend folder for detailed help`);
      } else {
        alert(`Failed to send email: ${errorMessage}`);
      }
    } finally {
      setIsEmailing(false);
    }
  };

  const handleWhatsApp = async (phoneNumber: string) => {
    if (!generatedNotice) return;
    
    try {
      setIsWhatsapping(true);
      const result = await shareWhatsapp({
        phone_number: phoneNumber,
        notice_text: generatedNotice
      });
      console.log(result);
      setShowWhatsAppModal(false);
      // WhatsApp URL will be opened automatically by the API function
    } catch (err) {
      console.error('WhatsApp error:', err);
      alert('Failed to share on WhatsApp. Please try again.');
    } finally {
      setIsWhatsapping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6A767] mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your legal notice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/generate', { state: { formData } }) }
            className="px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F3] p-6">
      <div className="w-[95%] lg:w-[85%] mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">

        <div className="lg:col-span-1 xl:sticky top-[90px] h-fit border border-[#D6A767] rounded-md">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Cannot generate legal notice...</h2>
              <div className="space-y-4">
                <ul className="list-disc list-inside text-sm text-gray-600 font-medium space-y-2">
                  <li className="flex items-start gap-4">
                    <span className="text-[#D6A767] font-bold">1.</span>
                    <span className="text-sm font-medium">When the date on which check is presented/ encashed is more than 3 months from the date on which it was drawn. </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">2.</span>
                    <span className="text-sm font-medium">When the cheque is encashed post the validity period. </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">3.</span>
                    <span className="text-sm font-medium">When the information of dishonor is brought to the notice of Drawer after 30 days from the. </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">4.</span>
                    <span className="text-sm font-medium">When the person tries to initiate a legal notice within 15 days from the date of receipt of notice of dishonor by the drawer. </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">5.</span>
                    <span className="text-sm font-medium">When a prior legal notice has already been initiated and there is an already pending case against the same person before any court for the same reason.  </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">6.</span>
                    <span className="text-sm font-medium">When the bank or the person had no reason to believe that there has been a material alteration of the cheque at the time of presentation, because such alteration is not apparent during the time of the presentation. Section 89. </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D6A767] font-bold">7.</span>
                    <span className="text-sm font-medium">When the client is not a party to the suit (i.e. Drawer, Drawee, Payee, or Holder of the Cheque).  </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Generated Notice */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-[20px]">
              <div className="flex justify-between items-center mb-4 flex-col md:flex-row">
                <h2 className="text-xl font-semibold">AI Generated Notice</h2>
                <div className='flex flex-row align-center justify-between w-[80%] md:w-[30%]'>
                <button
                onClick={() => navigate('/generate', { state: { formData } })}
                className="w-[50%] bg-[#D6A767] text-white py-2 rounded-md hover:bg-[#c49655] transition-colors"
              >
                Edit Fields
              </button>
                <button className="w-[30%] px-2 py-1 bg-[#D6A767] text-white text-sm rounded" onClick={() => navigate('/generate')}>New</button>
                </div>
              </div>
              <div className="border border-[#D6A767] rounded-lg p-6 min-h-[600px] mb-4 font-mono text-sm whitespace-pre-wrap relative">

                  {!isEditing ? (
  generatedNotice
) : (
  <textarea
    className="w-full h-[100vh] font-mono text-sm whitespace-pre-wrap focus:outline-none resize-none"
    value={editedNotice}
    onChange={(e) => setEditedNotice(e.target.value)}
  />
)}
<button
  className="absolute top-5 right-5 w-8 h-8 flex align-center justify-center text-center"
  onClick={() => {
    if (!isEditing) {
      setEditedNotice(generatedNotice); // Enter edit mode
    } else {
      setGeneratedNotice(editedNotice); // Save edits
    }
    SetIsEditing(!isEditing); // Toggle mode
  }}
>
  {isEditing ? (
    <Check className="w-8 h-8 text-[#000] text-bold" />
  ) : (
    <Pencil className="w-6 h-6 text-[#000] text-bold" />
  )}
</button>
              </div>
              <div className="flex items-end justify-end gap-2">
              <button 
                  onClick={() => setShowEmailModal(true)}
                  disabled={!generatedNotice}
                  className="px-0 py-0 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Mail className='w-8 h-8 text-[#D6A767]'/>
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading || !generatedNotice}
                  className="px-2 py-2 bg-[#D6A767] rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      Downloading...
                    </>
                  ) : (
                    <ArrowDownToLine className='w-5 h-5 text-white'/>
                  )}
                </button>
                {/* <button 
                  onClick={() => setShowWhatsAppModal(true)}
                  disabled={!generatedNotice}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  WhatsApp
                </button> */}
              </div>
            </div>
          </div>

          {/* IPC Recommendations */}
          <div className="lg:col-span-1 xl:sticky top-[90px] h-fit rounded-md">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">IPC Recommendations</h2>
              <div className="space-y-4">
                {ipcRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#D6A767] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#D6A767] font-semibold">{rec.section}</span>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm font-medium">{rec.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Email</h3>
            <EmailModal 
              onSubmit={handleEmail}
              onCancel={() => setShowEmailModal(false)}
              isLoading={isEmailing}
            />
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share on WhatsApp</h3>
            <WhatsAppModal 
              onSubmit={handleWhatsApp}
              onCancel={() => setShowWhatsAppModal(false)}
              isLoading={isWhatsapping}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Email Modal Component
const EmailModal: React.FC<{
  onSubmit: (data: {
    sender_email: string;
    sender_password: string;
    recipient_email: string;
    subject: string;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = React.useState({
    sender_email: '',
    sender_password: '',
    recipient_email: '',
    subject: 'Legal Notice'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Email
        </label>
        <input
          type="email"
          required
          value={formData.sender_email}
          onChange={(e) => setFormData({...formData, sender_email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          placeholder="your-email@gmail.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Password
        </label>
        <input
          type="password"
          required
          value={formData.sender_password}
          onChange={(e) => setFormData({...formData, sender_password: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          placeholder="Your email password"
        />
        <p className="text-xs text-gray-500 mt-1">
          For Gmail: Use an App Password instead of your regular password.
          For custom domains: Contact your IT administrator for SMTP settings.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Email
        </label>
        <input
          type="email"
          required
          value={formData.recipient_email}
          onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          placeholder="recipient@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          placeholder="Legal Notice"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655] disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Email'}
        </button>
      </div>
    </form>
  );
};

// WhatsApp Modal Component
const WhatsAppModal: React.FC<{
  onSubmit: (phoneNumber: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ onSubmit, onCancel, isLoading }) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (with country code)
        </label>
        <input
          type="tel"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6A767]"
          placeholder="+1234567890"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include country code (e.g., +91 for India, +1 for US)
        </p>
      </div>
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Opening...' : 'Open WhatsApp'}
        </button>
      </div>
    </form>
  );
}; 