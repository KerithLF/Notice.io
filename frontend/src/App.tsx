import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NoticePage } from './pages/NoticePage';
import { CreateNoticePage } from './pages/CreateNoticePage';
<<<<<<< HEAD
import { NoticePreviewPage } from './pages/NoticePreviewPage';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
=======
import { Navbar } from './components/Navbar';
import NoticeForm from "./components/NoticeForm";

function App() {
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
<<<<<<< HEAD
        
        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<NoticePage />} />
          <Route path="/create" element={<CreateNoticePage />} />
          <Route path="/notice-preview" element={<NoticePreviewPage />} />
=======
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/create" element={<CreateNoticePage />} />
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27
        </Routes>
      </div>
    </Router>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> 2135ecb251b0fb83cc65418f4d25d949ae5dec27

export default App;