import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NoticeData } from '../types/notice';
import { generateNotice } from '../api/notice';

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
  const formData = location.state?.formData as NoticeData;

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
    <div className="min-h-screen bg-[#FAF6F3] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generated Notice */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">AI Generated Notice</h2>
                <span className="px-2 py-1 bg-[#D6A767] text-white text-sm rounded">New</span>
              </div>
              <div className="border rounded-lg p-6 min-h-[600px] mb-4 font-mono text-sm whitespace-pre-wrap">
                {generatedNotice}
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Download
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Email
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* IPC Recommendations */}
          <div className="lg:col-span-1">
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
              <button
                onClick={() => navigate('/generate', { state: { formData } })}
                className="mt-6 w-full bg-[#D6A767] text-white py-2 rounded-md hover:bg-[#c49655] transition-colors"
              >
                Edit Fields
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 