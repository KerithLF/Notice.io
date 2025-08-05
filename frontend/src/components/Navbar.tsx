import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, FileText, Plus, } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="header-dark shadow-sm border-b border-[#D6A767] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-logo" />
            <span className="text-xl font-bold text-logo">Notice.io</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/generate"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === '/generate'
                  ? 'bg-[#D6A767] text-white'
                  : 'text-[#D6A767] hover:text-white hover:bg-[#D6A767]'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Generate Notice</span>
            </Link>
            
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === '/create'
                  ? 'bg-[#D6A767] text-white'
                  : 'text-[#D6A767] hover:text-white hover:bg-[#D6A767]'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Create New</span>
            </Link>
            
            {/* <div className="flex items-center space-x-2">
              <button className="btn-outline text-sm px-4 py-2">Login</button>
              <button className="btn-primary text-sm px-4 py-2">Signup</button>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};