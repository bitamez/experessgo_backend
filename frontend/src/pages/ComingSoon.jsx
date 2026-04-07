import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Info, Briefcase, Newspaper, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ComingSoon = ({ title, icon: Icon }) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-lg p-12 space-y-8 border-primary-500/20 bg-primary-500/5"
      >
        <div className="w-20 h-20 bg-primary-500/20 rounded-3xl flex items-center justify-center mx-auto border border-primary-500/30">
          <Icon size={40} className="text-primary-500 animate-pulse" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">{title}</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            We are currently building this premium section to provide you with the best travel experience in Ethiopia. 
            Stay tuned for our official launch!
          </p>
        </div>
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">
          <Sparkles size={14} className="text-primary-500" />
          Powered by ExpressGo AI
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
