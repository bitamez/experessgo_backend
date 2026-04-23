import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Languages, User, LogIn, Download } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ toggleChat }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [session, setSession] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <nav className="glass-card mt-6 px-8 py-4 flex items-center justify-between border-white/5 sticky top-6 z-50">
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="bg-primary-500 p-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <Bus size={22} className="text-black" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tighter text-white uppercase italic">EXPRESS<span className="text-primary-500">GO</span></span>
      </Link>
      
      {/* Dynamic Center Links */}
      <div className="hidden md:flex items-center gap-10 font-bold uppercase tracking-widest text-[10px]">
        <Link to="/" className="text-white hover:text-primary-500 transition-colors">{t('home')}</Link>
        {session && (
          <>
            <Link to="/bookings" className="text-white/60 hover:text-white transition-colors">{t('bookings')}</Link>
            <Link to="/rewards" className="text-white/60 hover:text-white transition-colors">{t('rewards')}</Link>
          </>
        )}
      </div>

      {/* Dynamic Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all text-white/60 hover:text-white border border-white/5"
        >
          <Languages size={15} />
          <span className="text-[9px] font-black uppercase tracking-widest">{language === 'en' ? 'EN' : 'አማ'}</span>
        </button>
        
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all text-white border border-primary-500/50 bg-primary-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <Download size={15} className="text-primary-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 hidden sm:inline">Install App</span>
          </button>
        )}
        
        {session ? (
          <Link to="/profile" className="flex items-center gap-2 glass-button !px-4 !py-2">
            <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
               <User size={12} className="text-primary-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-tighter">{t('profile')}</span>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-2 primary-button !px-6 !py-2.5 text-[11px] uppercase font-black tracking-widest bg-primary-500 hover:bg-primary-400">
            <LogIn size={15} />
            <span>{t('getStarted')}</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
