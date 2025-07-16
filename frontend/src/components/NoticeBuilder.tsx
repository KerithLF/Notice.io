import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Upload } from 'lucide-react';
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

  // Formatting handlers
  const contentEditableRef = React.useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = React.useState('14px');

  const applyFormatting = (command: string, value: string | undefined = undefined) => {
    if (!contentEditableRef.current) return;
    document.execCommand(command, false, value);
    contentEditableRef.current.focus();
    
    // Update content state after formatting
    if (contentEditableRef.current) {
      onChange(contentEditableRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      onChange(contentEditableRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    applyFormatting('fontSize', size === '14px' ? '3' : size === '16px' ? '4' : '5');
  };

  // Initialize content
  React.useEffect(() => {
    if (contentEditableRef.current && !contentEditableRef.current.innerHTML) {
      contentEditableRef.current.innerHTML = content;
    }
  }, [content]);

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
          <button 
            className="p-2 hover:bg-gray-100 rounded" 
            onClick={() => applyFormatting('bold')} 
            type="button"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded" 
            onClick={() => applyFormatting('italic')} 
            type="button"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded" 
            onClick={() => applyFormatting('underline')} 
            type="button"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <select 
            className="text-sm border border-gray-300 rounded px-2 py-1"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
          >
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
          </select>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => applyFormatting('justifyLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => applyFormatting('justifyCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => applyFormatting('justifyRight')}
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => applyFormatting('insertUnorderedList')}
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => applyFormatting('insertOrderedList')}
          >
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
            className={`drop-zone min-h-96 p-6 transition-colors relative ${
              snapshot.isDraggingOver
                ? 'border-2 border-[#D6A767] bg-[#FFF9F2]'
                : 'border border-transparent'
            }`}
          >
            {snapshot.isDraggingOver && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="text-[#D6A767] bg-white bg-opacity-80 px-4 py-2 rounded shadow text-lg font-semibold border border-[#D6A767]">
                  Drop here to add IPC section to your notice
                </span>
              </div>
            )}
            <div
              ref={contentEditableRef}
              contentEditable
              onInput={handleContentChange}
              className="w-full h-full min-h-[400px] outline-none text-sm leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
              style={{ fontSize }}
              data-placeholder="Start drafting your legal notice or apply AI suggestions..."
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
              <span className="text-sm text-gray-600">Upload</span>
            </div>
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
              <Upload className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadPDF}
              className="btn-primary text-sm px-4 py-2 cursor-pointer"
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