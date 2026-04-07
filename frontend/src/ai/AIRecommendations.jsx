import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCcw, Info } from 'lucide-react';
import { useAI } from './useAI';
import { useLanguage } from '../context/LanguageContext';

const AIRecommendations = () => {
  const { recommendations, loading, error, refresh } = useAI();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center glass-card">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-primary-500" size={32} />
          <p className="text-white/40 animate-pulse font-medium">AI is curating your journeys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 glass-card border-red-500/20 bg-red-500/5 text-center">
        <Info className="mx-auto text-red-400 mb-3" size={32} />
        <p className="text-red-400/80 mb-4">{error}</p>
        <button 
          onClick={refresh}
          className="text-xs font-bold uppercase tracking-widest text-primary-500 hover:text-primary-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles size={24} className="text-primary-500" /> AI Insights
        </h2>
        <button onClick={refresh} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <RefreshCcw size={16} className="text-white/40" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <motion.div 
            key={rec.id} 
            whileHover={{ y: -5 }}
            className="glass-card p-6 border-l-4 border-l-primary-500 group cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">{rec.reason}</span>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-primary-400 transition-colors">{rec.source} to {rec.destination}</h3>
              </div>
              <div className="bg-primary-500/20 p-2 rounded-xl group-hover:bg-primary-500 group-hover:text-black transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
            
            <div className="mt-8 flex items-end justify-between">
              <div className="flex gap-6">
                <div>
                  <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">Departure</span>
                  <span className="text-white font-bold">{rec.next_bus}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">Fare</span>
                  <span className="text-primary-400 font-bold">{rec.price}</span>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5 transition-colors">
                Reserve Seat
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
