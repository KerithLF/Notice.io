<<<<<<< HEAD
import { Edit3Icon, SparklesIcon } from 'lucide-react';
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
            <SparklesIcon className="h-5 w-5" />
            <span className="text-xl">Generate Notice</span>
            
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-3 border-2 border-[#D6A767] text-[#D6A767] rounded-lg hover:bg-[#D6A767] hover:text-white transition-colors"
          >
            <Edit3Icon className="h-5 w-5" />
            <span className="text-xl">Create from Scratch</span>
            
          </Link>
=======
import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, FileText, Edit3, Download, Share2, Zap, Sparkles, Users, Shield } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Legal Notices with
            <span className="text-gold"> AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional legal notices in minutes using advanced AI technology. 
            Choose your litigation type, customize tone, and generate precise legal documents.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/notice"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Generate Notice</span>
            </Link>
            <Link
              to="/create"
              className="btn-outline inline-flex items-center space-x-2"
            >
              <Edit3 className="h-5 w-5" />
              <span>Create from Scratch</span>
            </Link>
          </div>
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
        </div>
      </div>

      {/* Features Section */}
<<<<<<< HEAD
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
            Powerful Features for Legal Professionals
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to create professional legal notices efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<<<<<<< HEAD
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
=======
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-optional w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Scale className="h-6 w-6 text-[#3C222F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dynamic Form Fields</h3>
            <p className="text-gray-600">
              Input fields automatically adapt based on your selected litigation type for maximum relevance and accuracy.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-gold w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Generate professional legal notices with customizable tone and style using advanced AI technology.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-[#D6A767]" />
            </div>
            <h3 className="text-xl font-semibold mb-3">IPC Recommendations</h3>
            <p className="text-gray-600">
              Choose from professionally crafted templates tailored to different litigation types and legal scenarios.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-optional w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-[#3C222F]" />
            </div>
            <h3 className="text-xl font-semibold mb-3">PDF Export</h3>
            <p className="text-gray-600">
              Download your generated legal notices as professional PDF documents ready for official use.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-gold w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-white" />
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
            </div>
            <h3 className="text-xl font-semibold mb-3">Direct Sharing</h3>
            <p className="text-gray-600">
              Share your legal notices directly via email or WhatsApp with a single click.
            </p>
          </div>

<<<<<<< HEAD
          {/* Drag & Drop IPC Sections */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#FAF6F3] rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✏️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Drag & Drop IPC Sections</h3>
            <p className="text-gray-600">
              Easily add relevant IPC sections to your notices with intuitive drag-and-drop
              functionality.
=======
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="section-dark w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Edit3 className="h-6 w-6 text-[#D6A767]" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Drag & Drop IPC Sections</h3>
            <p className="text-gray-600">
              Easily add relevant IPC sections to your notices with intuitive drag-and-drop functionality.
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};