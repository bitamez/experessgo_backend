import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, Gift, User, MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = ({ toggleChat }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getIsActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-b-0 border-t border-white/10 bg-[#0a0a0c]/90 pb-safe pt-2 px-6 flex items-center justify-between">
      <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition-colors ${getIsActive('/') ? 'text-primary-500' : 'text-white/40 hover:text-white/60'}`}>
        <Home size={22} />
        <span className="text-[9px] font-bold uppercase tracking-widest">{t('home')}</span>
      </Link>
      
      {session ? (
        <>
          <Link to="/bookings" className={`flex flex-col items-center gap-1 p-2 transition-colors ${getIsActive('/bookings') ? 'text-primary-500' : 'text-white/40 hover:text-white/60'}`}>
            <Ticket size={22} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{t('bookings')}</span>
          </Link>
          <Link to="/rewards" className={`flex flex-col items-center gap-1 p-2 transition-colors ${getIsActive('/rewards') ? 'text-primary-500' : 'text-white/40 hover:text-white/60'}`}>
            <Gift size={22} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{t('rewards')}</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 p-2 transition-colors ${getIsActive('/profile') ? 'text-primary-500' : 'text-white/40 hover:text-white/60'}`}>
            <User size={22} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{t('profile')}</span>
          </Link>
        </>
      ) : (
        <Link to="/login" className={`flex flex-col items-center gap-1 p-2 transition-colors ${getIsActive('/login') ? 'text-primary-500' : 'text-white/40 hover:text-white/60'}`}>
          <User size={22} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Login</span>
        </Link>
      )}
      
      <button onClick={toggleChat} className="flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/60 transition-colors">
        <MessageCircle size={22} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Chatbot</span>
      </button>
    </div>
  );
};

export default BottomNav;
