import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NoticePage } from './pages/NoticePage';
import { CreateNoticePage } from './pages/CreateNoticePage';
import { Navbar } from './components/Navbar';
import NoticeForm from "./components/NoticeForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/create" element={<CreateNoticePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;