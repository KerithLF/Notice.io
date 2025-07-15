import React, { useState } from 'react';
import { NoticeBuilder } from '../components/NoticeBuilder';
import { IPCSections } from '../components/IPCSections';
import { AIRecommendations } from '../components/AIRecommendations';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

export const CreateNoticePage: React.FC = () => {
  const [noticeContent, setNoticeContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [caseDetails, setCaseDetails] = useState({
    sender: 'John Doe',
    recipient: 'Jane Smith',
    caseNo: '2023-001'
  });
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === 'ipc-sections' && destination.droppableId === 'notice-builder') {
      const draggedText = result.draggableId;
      const newContent = noticeContent + (noticeContent ? '\n\n' : '') + draggedText;
      setNoticeContent(newContent);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice.io</h1>
            <p className="text-gray-600">Build your legal notice using IPC sections and custom content</p>
          </div>
          <div className="text-sm text-gray-500">
            <span className="typing-indicator">Saving...</span>
          </div>
        </div>
      </div>

      {/* Case Details Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-style focus-gold"
              placeholder="Enter notice subject"
            />
          </div>
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
      </div>

      {/* Template Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Using:</span>
          <select className="input-style focus-gold text-sm">
            <option>Eviction Template</option>
            <option>Contract Breach Template</option>
            <option>Payment Notice Template</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <IPCSections subject={subject} />
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