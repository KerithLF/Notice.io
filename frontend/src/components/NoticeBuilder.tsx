import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Download, Mail, MessageSquare, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Upload } from 'lucide-react';
import jsPDF from 'jspdf';

interface NoticeBuilderProps {
  content: string;
  onChange: (content: string) => void;
  caseDetails?: {
    sender: string;
    recipient: string;
    caseNo: string;
  };
}

export const NoticeBuilder: React.FC<NoticeBuilderProps> = ({ content, onChange, caseDetails }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 20, 20);
    doc.save('custom-legal-notice.pdf');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Custom Legal Notice');
    const body = encodeURIComponent(content);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(content);
    window.open(`https://wa.me/?text=${text}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header with case details */}
      {caseDetails && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span><strong>Sender:</strong> {caseDetails.sender}</span>
              <span><strong>Recipient:</strong> {caseDetails.recipient}</span>
              <span><strong>Case No:</strong> {caseDetails.caseNo}</span>
            </div>
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Bold className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Italic className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>14px</option>
            <option>16px</option>
            <option>18px</option>
          </select>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <AlignLeft className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <AlignCenter className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <AlignRight className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <List className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <Droppable droppableId="notice-builder">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`drop-zone min-h-96 p-6 transition-colors ${
              snapshot.isDraggingOver
                ? 'drag-over'
                : ''
            }`}
          >
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              rows={25}
              className="w-full h-full border-none outline-none resize-none text-sm bg-transparent leading-relaxed"
              placeholder="Start drafting your legal notice or apply AI suggestions..."
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Footer with actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Proofreading Mode</span>
            </div>
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <Upload className="h-4 w-4" />
            </button>
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <Upload className="h-4 w-4 transform rotate-180" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Download As</option>
              <option>PDF</option>
              <option>Word</option>
              <option>Text</option>
            </select>
            <button
              onClick={downloadPDF}
              className="btn-primary text-sm px-4 py-2"
              disabled={!content}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};