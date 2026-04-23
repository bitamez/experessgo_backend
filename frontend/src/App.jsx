import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import ComingSoon from './pages/ComingSoon';
import { Info, Briefcase, Newspaper, Users, Calendar } from 'lucide-react';

import ChatWidget from './components/ChatWidget';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <LanguageProvider>
      <Router>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 selection:bg-primary-500 selection:text-black min-h-screen flex flex-col pb-20 md:pb-0">
        <Navbar toggleChat={() => setIsChatOpen(!isChatOpen)} />
        
        <main className="mt-8 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<ComingSoon title="My Bookings" icon={Briefcase} />} />
            <Route path="/rewards" element={<ComingSoon title="ExpressGo Rewards" icon={Users} />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<ComingSoon title="About ExpressGo" icon={Info} />} />
            <Route path="/careers" element={<ComingSoon title="Join Our Team" icon={Briefcase} />} />
            <Route path="/blog" element={<ComingSoon title="Travel Blog" icon={Newspaper} />} />
            <Route path="/partners" element={<ComingSoon title="Our Partners" icon={Users} />} />
            <Route path="/schedules" element={<ComingSoon title="Full Schedule" icon={Calendar} />} />
          </Routes>
        </main>

        </div>
        
        <Footer />
        <BottomNav toggleChat={() => setIsChatOpen(!isChatOpen)} />
        <ChatWidget isOpen={isChatOpen} toggle={() => setIsChatOpen(!isChatOpen)} />
      </Router>
    </LanguageProvider>
  );
}

export default App;
