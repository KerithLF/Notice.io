import React, { useState } from 'react';
import { NoticeBuilder } from '../components/NoticeBuilder';
import { IPCSections } from '../components/IPCSections';
import { AIRecommendations } from '../components/AIRecommendations';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { getIpcRecommendations } from '../api/notice'; // Add this import

export const CreateNoticePage: React.FC = () => {
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [caseDetails, setCaseDetails] = useState({
    sender: 'John Doe',
    recipient: 'Jane Smith',
    caseNo: '2023-001'
  });
  const [ipcRecommendations, setIpcRecommendations] = useState<string[]>([]);
  const [ipcLoading, setIpcLoading] = useState(false);
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // If dragging from IPCSections to NoticeBuilder, append the IPC section content
    if (source.droppableId === 'ipc-sections' && destination.droppableId === 'notice-builder') {
      // Find the IPC section by id
      const draggedId = result.draggableId;
      const draggedSection = parsedIpcSections.find(sec => sec.id === draggedId);
      if (draggedSection) {
        // Format: Section Title\nDescription\n\n
        const formatted = `${draggedSection.title} Explanation:\n${draggedSection.description}\n\n`;
        setNoticeContent(prev => prev ? prev + '\n' + formatted : formatted);
      }
    }
  };

  const handleIpcRecommend = async () => {
    if (!subject.trim()) return;
    setIpcLoading(true);
    const data = await getIpcRecommendations(subject);
    setIpcRecommendations(data.recommendations || []);
    setIpcLoading(false);
  };

  // Improved parser for model output
  function parseIpcRecommendationsFromText(text: string): { id: string; title: string; description: string }[] {
    // Split on each new section (handles markdown bold and regular)
    // This regex matches: - **Section ...** Explanation: ...
    const sectionBlocks = text.split(/\n\s*-/).map((block, idx) => (idx === 0 ? block : '-'+block)).filter(b => b.trim().startsWith('-'));
    const results = [];
    for (let i = 0; i < sectionBlocks.length; i++) {
      let block = sectionBlocks[i].trim();
      // Remove leading dash and spaces
      block = block.replace(/^[-\s]+/, '');
      // Remove markdown bold
      block = block.replace(/\*\*/g, '');
      // Find the first colon after 'Section ...'
      const sectionMatch = block.match(/^(Section [^:]+):?\s*(.*)$/);
      if (sectionMatch) {
        let title = sectionMatch[1].trim();
        let rest = sectionMatch[2].trim();
        // Remove 'Explanation:' if present
        rest = rest.replace(/^Explanation:?\s*/i, '');
        results.push({ id: `ipc-reco-${i}`, title, description: rest });
      } else {
        // Fallback: use the whole block as title
        results.push({ id: `ipc-reco-${i}`, title: block, description: '' });
      }
    }
    return results.slice(0, 5);
  }

  // Store parsed recommendations for IPCSections
  const parsedIpcSections = ipcRecommendations.length === 1 && typeof ipcRecommendations[0] === 'string'
    ? parseIpcRecommendationsFromText(ipcRecommendations[0])
    : parseIpcRecommendationsFromText(ipcRecommendations.join('\n'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice.io</h1>
            <p className="text-gray-600">Build your legal notice using IPC sections and custom content</p>
          </div>
          {/* Removed 'Saving...' indicator */}
        </div>
      </div>

      {/* Case Details Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender</label>
            <input
              type="text"
              value={caseDetails.sender}
              onChange={(e) => setCaseDetails(prev => ({ ...prev, sender: e.target.value }))}
              className="input-style focus-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
            <input
              type="text"
              value={caseDetails.recipient}
              onChange={(e) => setCaseDetails(prev => ({ ...prev, recipient: e.target.value }))}
              className="input-style focus-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Case No</label>
            <input
              type="text"
              value={caseDetails.caseNo}
              onChange={(e) => setCaseDetails(prev => ({ ...prev, caseNo: e.target.value }))}
              className="input-style focus-gold"
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-start md:items-end gap-2">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-style focus-gold w-full text-base px-4 py-3"
              placeholder="Enter notice subject"
            />
          </div>
          <button
            type="button"
            onClick={handleIpcRecommend}
            className="px-6 py-3 rounded font-semibold shadow-sm transition-colors duration-150 mt-6 md:mt-0"
            style={{ background: '#D6A767', color: '#fff', border: 'none', minWidth: '140px' }}
            disabled={ipcLoading}
          >
            {ipcLoading ? "Loading..." : "Get IPC"}
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Using:</span>
          <select className="input-style focus-gold text-sm">
            <option value="">Select Template</option>
            <option value="eviction">Eviction</option>
            <option value="payment-recovery">Payment Recovery</option>
            <option value="breach-of-contract">Breach of Contract</option>
            <option value="employment-termination">Employment Termination</option>
            <option value="loan-default">Loan Default</option>
            <option value="cheque-bounce">Dishonor Of Cheque</option>
            <option value="consumer-complaint">Consumer Complaint</option>
            <option value="ip-infringement">Intellectual Property Infringement</option>
            <option value="defamation-harassment">Defamation / Harassment Notice</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Show IPCSections with recommendations only after Get IPC is clicked */}
            <IPCSections recommendations={parsedIpcSections.length > 0 ? parsedIpcSections : []} />
            <AIRecommendations 
              formData={{ subject, caseDescription: noticeContent }} 
              selectedTemplate="eviction" 
            />
          </div>
          
          <div className="lg:col-span-3">
            <NoticeBuilder 
              content={noticeContent}
              onChange={setNoticeContent}
              caseDetails={caseDetails}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};