import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NoticePage } from './pages/NoticePage';
import { CreateNoticePage } from './pages/CreateNoticePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-[#3C222F] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-2xl">⚖️</span>
                  <span className="font-semibold text-lg">Notice.io</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/generate"
                  className="px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655]"
                >
                  Generate Notice
                </Link>
                <Link
                  to="/create"
                  className="px-4 py-2 border border-[#D6A767] text-[#D6A767] rounded-md hover:bg-[#D6A767] hover:text-white"
                >
                  Create New
                </Link>
                <button className="px-4 py-2 text-white hover:text-[#D6A767]">
                  Login
                </button>
                <button className="px-4 py-2 bg-[#D6A767] text-white rounded-md hover:bg-[#c49655]">
                  Signup
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<NoticePage />} />
          <Route path="/create" element={<CreateNoticePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;