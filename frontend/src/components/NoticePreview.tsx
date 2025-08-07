import React from 'react';
<<<<<<< HEAD
import { Edit, Download, Mail, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import { NoticeData } from '../types/notice';

// Add the warning types
interface WarningAlert {
  type: 'encashing_delay' | 'dishonor_delay' | 'early_notice' | 'duplicate_case' | 'standing_issue';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}
=======
import { Edit, Download, Share2, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { NoticeData } from '../types/notice';
import jsPDF from 'jspdf';
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27

interface NoticePreviewProps {
  notice: string;
  onEdit: () => void;
  formData: NoticeData;
<<<<<<< HEAD
  warnings?: WarningAlert[]; // Add warnings prop
  onRegenerate?: () => void; // Add regenerate function
}

// Warning Modal Component
const WarningModal: React.FC<{
  warnings: WarningAlert[];
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}> = ({ warnings, isOpen, onClose, onProceed }) => {
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
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Review & Edit Details
            </button>
            <button 
              onClick={onProceed}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Proceed Despite Warnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NoticePreview: React.FC<NoticePreviewProps> = ({ 
  notice, 
  onEdit, 
  formData, 
  warnings = [],
  onRegenerate 
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showWarningModal, setShowWarningModal] = React.useState(false);

  // Show warning modal when warnings are received
  React.useEffect(() => {
    if (warnings && warnings.length > 0) {
      setShowWarningModal(true);
    }
  }, [warnings]);
=======
}

export const NoticePreview: React.FC<NoticePreviewProps> = ({ notice, onEdit, formData }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(notice, 180);
    doc.text(lines, 20, 20);
<<<<<<< HEAD
    doc.save(`legal-notice-${formData.selected_type}.pdf`);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Legal Notice: ${formData.selected_type}`);
=======
    doc.save(`legal-notice-${formData.subject}.pdf`);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Legal Notice: ${formData.subject}`);
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
    const body = encodeURIComponent(notice);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(notice);
    window.open(`https://wa.me/?text=${text}`);
  };

<<<<<<< HEAD
  const handleWarningProceed = () => {
    setShowWarningModal(false);
    // Notice is already generated and passed as prop, so just close modal
  };

  const handleWarningClose = () => {
    setShowWarningModal(false);
    // Optionally trigger regeneration or editing
    if (onRegenerate) {
      onRegenerate();
    } else {
      onEdit();
    }
  };

=======
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
  React.useEffect(() => {
    if (notice) {
      setIsGenerating(true);
      const timer = setTimeout(() => setIsGenerating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-[#D6A767]" />
            <h2 className="text-xl font-semibold text-gray-900">AI Generated Notice</h2>
            <button className="text-xs bg-[#D6A767] text-white px-2 py-1 rounded-full">+ New</button>
<<<<<<< HEAD
            
            {/* Warning indicator */}
            {warnings && warnings.length > 0 && (
              <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>{warnings.length} Warning{warnings.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          
=======
          </div>
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 text-[#D6A767] hover:text-[#C19653] transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>

        {isGenerating ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6A767] mx-auto mb-4"></div>
              <p className="text-gray-600">
                <span className="typing-indicator">Your AI-generated legal notice will appear here.</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please fill in the details on the left and click "Generate" to draft your notice. 
                The system will use the selected litigation type and template to create a comprehensive 
                and legally sound document. Review the content carefully before editing or downloading.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 font-mono text-sm whitespace-pre-wrap border-l-4 border-[#D6A767]">
            {notice || (
              <div className="text-gray-500 text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">Your AI-generated legal notice will appear here.</p>
                <p className="text-xs">
                  Please fill in the details on the left and click "Generate" to draft your notice. 
                  The system will use the selected litigation type and template to create a comprehensive 
                  and legally sound document. Review the content carefully before editing or downloading.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadPDF}
            disabled={!notice}
            className="flex items-center space-x-2 bg-[#D6A767] text-white px-4 py-2 rounded-lg hover:bg-[#C19653] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>

          <button
            onClick={shareViaEmail}
            disabled={!notice}
            className="flex items-center space-x-2 bg-[#3C222F] text-white px-4 py-2 rounded-lg hover:bg-[#4A2A37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="h-4 w-4" />
<<<<<<< HEAD
=======
            <span>Email</span>
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
          </button>

          <button
            onClick={shareViaWhatsApp}
            disabled={!notice}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-4 w-4" />
<<<<<<< HEAD
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        warnings={warnings}
        isOpen={showWarningModal}
        onClose={handleWarningClose}
        onProceed={handleWarningProceed}
      />
    </div>
  );
};
=======
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
