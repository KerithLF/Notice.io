import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NoticePage } from './pages/NoticePage';
import { CreateNoticePage } from './pages/CreateNoticePage';
import { NoticePreviewPage } from './pages/NoticePreviewPage';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<NoticePage />} />
          <Route path="/create" element={<CreateNoticePage />} />
          <Route path="/notice-preview" element={<NoticePreviewPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;