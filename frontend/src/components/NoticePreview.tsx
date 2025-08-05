import React from 'react';
import { Edit, Download, Mail, MessageSquare, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import { NoticeData } from '../types/notice';

interface NoticePreviewProps {
  notice: string;
  onEdit: () => void;
  formData: NoticeData;
}

export const NoticePreview: React.FC<NoticePreviewProps> = ({ notice, onEdit, formData }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(notice, 180);
    doc.text(lines, 20, 20);
    doc.save(`legal-notice-${formData.selected_type}.pdf`);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Legal Notice: ${formData.selected_type}`);
    const body = encodeURIComponent(notice);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(notice);
    window.open(`https://wa.me/?text=${text}`);
  };

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
          </div>
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
          </button>

          <button
            onClick={shareViaWhatsApp}
            disabled={!notice}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-4 w-4" />
            
          </button>
        </div>
      </div>
    </div>
  );
};