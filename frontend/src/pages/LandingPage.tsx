import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF6F3]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
          Generate Legal Notices with{' '}
          <span className="text-[#D6A767]">AI Power</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Create professional legal notices in minutes using advanced AI technology. Choose
          your litigation type, customize tone, and generate precise legal documents.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/generate"
            className="flex items-center gap-2 px-6 py-3 bg-[#D6A767] text-white rounded-lg hover:bg-[#c49655] transition-colors"
          >
            <span className="text-xl">⚡</span>
            Generate Notice
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#D6A767] text-[#D6A767] rounded-lg hover:bg-[#D6A767] hover:text-white transition-colors"
          >
            <span className="text-xl">✏️</span>
            Create from Scratch
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            Powerful Features for Legal Professionals
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to create professional legal notices efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dynamic Form Fields */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FAF6F3] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Dynamic Form Fields</h3>
            <p className="text-gray-600">
              Input fields automatically adapt based on your selected litigation type for maximum
              relevance and accuracy.
            </p>
          </div>

          {/* AI-Powered Generation */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#D6A767] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Generate professional legal notices with customizable tone and style using
              advanced AI technology.
            </p>
          </div>

          {/* IPC Recommendations */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FAF6F3] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">IPC Recommendations</h3>
            <p className="text-gray-600">
              Choose from professionally crafted templates tailored to different litigation
              types and legal scenarios.
            </p>
          </div>

          {/* PDF Export */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FAF6F3] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⬇️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">PDF Export</h3>
            <p className="text-gray-600">
              Download your generated legal notices as professional PDF documents ready for
              official use.
            </p>
          </div>

          {/* Direct Sharing */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#D6A767] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl text-white">↗️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Direct Sharing</h3>
            <p className="text-gray-600">
              Share your legal notices directly via email or WhatsApp with a single click.
            </p>
          </div>

          {/* Drag & Drop IPC Sections */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FAF6F3] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✏️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Drag & Drop IPC Sections</h3>
            <p className="text-gray-600">
              Easily add relevant IPC sections to your notices with intuitive drag-and-drop
              functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};