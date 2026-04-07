import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Ticket, Sparkles, Clock, ArrowRight, Bus } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import SeatMap from '../components/SeatMap';
import AIRecommendations from '../ai/AIRecommendations';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    from: 'Addis Ababa',
    to: 'Adama',
    date: ''
  });

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  const handleProceed = async () => {
    if (!session) {
      navigate('/login');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/buses/schedules/`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeat(null);
    setTimeout(() => {
      document.getElementById('seat-selection-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 pt-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} /> AI-Powered Travel
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-200 via-primary-500 to-primary-800 leading-tight">
          {session ? `Welcome Back, ${session.user.email.split('@')[0]}` : t('heroTitle')} <br /> 
          {session ? 'Plan Your Next Trip' : t('heroSubtitle')}
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          {t('heroDesc')}
        </p>
      </motion.div>

      {/* Search Box */}
      <div className="max-w-4xl mx-auto -mt-8 relative z-10">
        <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-medium text-white/40 flex items-center gap-2">
              <MapPin size={14} className="text-primary-500" /> {t('from')}
            </label>
            <select 
              value={searchParams.from}
              onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
              className="input-field w-full appearance-none"
            >
              <option className="bg-black text-white">Addis Ababa</option>
              <option className="bg-black text-white">Adama</option>
              <option className="bg-black text-white">Hawassa</option>
              <option className="bg-black text-white">Bahir Dar</option>
            </select>
          </div>
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-medium text-white/40 flex items-center gap-2">
              <MapPin size={14} className="text-primary-500" /> {t('to')}
            </label>
            <select 
              value={searchParams.to}
              onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
              className="input-field w-full appearance-none"
            >
              <option className="bg-black text-white">Adama</option>
              <option className="bg-black text-white">Addis Ababa</option>
              <option className="bg-black text-white">Hawassa</option>
              <option className="bg-black text-white">Dire Dawa</option>
            </select>
          </div>
          <div className="space-y-2 col-span-1">
            <label className="text-sm font-medium text-white/40 flex items-center gap-2">
              <Calendar size={14} className="text-primary-500" /> {t('date')}
            </label>
            <input 
              type="date" 
              value={searchParams.date}
              onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              className="input-field w-full invert dark:invert-0" 
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="primary-button flex items-center justify-center gap-2 h-[46px] group"
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <Search size={18} />}
            <span>{isSearching ? 'Searching...' : t('findBus')}</span>
          </button>
        </div>
      </div>

      {/* Results or Recommendations */}
      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Available Schedules <span className="text-sm font-normal text-white/40">({results.length} found)</span>
                </h2>
                <button onClick={() => { setResults([]); setSelectedSchedule(null); }} className="text-primary-500 text-sm hover:underline">Clear results</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((schedule) => (
                  <div 
                    key={schedule.schedule_id} 
                    onClick={() => handleScheduleSelect(schedule)}
                    className={`glass-card p-6 flex items-center justify-between group cursor-pointer transition-all border
                      ${selectedSchedule?.schedule_id === schedule.schedule_id ? 'border-primary-500 bg-primary-500/5' : 'hover:border-primary-500/50 border-white/10'}
                    `}
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Bus size={32} className="text-primary-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-white/40 text-xs font-medium uppercase tracking-tighter">
                          <Clock size={12} /> {schedule.departure_time}
                        </div>
                        <h4 className="text-xl font-bold text-white mt-1">{schedule.bus.bus_name}</h4>
                        <p className="text-white/60 text-sm">{schedule.route.source_en} <ArrowRight size={12} className="inline mx-1" /> {schedule.route.destination_en}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-500">450 <span className="text-xs">ETB</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seat Selection */}
            {selectedSchedule && (
              <motion.div 
                id="seat-selection-section"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
              >
                <SeatMap busId={selectedSchedule.bus.bus_id} onSeatSelect={(seat) => setSelectedSeat(seat)} />
                
                <div className="glass-card p-8 space-y-8 sticky top-32">
                  <h3 className="text-2xl font-bold">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/40">Bus</span>
                      <span className="text-white font-medium">{selectedSchedule.bus.bus_name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/40">Route</span>
                      <span className="text-white font-medium">{selectedSchedule.route.source_en} to {selectedSchedule.route.destination_en}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/40">Seat Number</span>
                      <span className={`font-bold ${selectedSeat ? 'text-primary-500' : 'text-white/20'}`}>
                        {selectedSeat || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between py-4 text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary-500">450 ETB</span>
                    </div>
                  </div>
                  <button 
                    disabled={!selectedSeat}
                    onClick={handleProceed}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                      ${!selectedSeat ? 'bg-white/5 text-white/40 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-400 text-black shadow-lg shadow-primary-500/20'}
                    `}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="recommendations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* AI Recommendations Component */}
            <AIRecommendations />

            {/* Fast Stats / Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group hover:border-primary-500/30 transition-all cursor-pointer">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform text-white"><Ticket size={120} /></div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-primary-300">My Tickets</h3>
                <p className="text-4xl font-bold text-white mt-1">12</p>
              </div>
              <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden group hover:border-primary-500/30 transition-all cursor-pointer border-primary-500/40 bg-primary-500/5">
                <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform"><Sparkles size={120} className="text-primary-500" /></div>
                <h3 className="text-xs uppercase font-bold tracking-widest text-primary-400">Bonus Rides</h3>
                <p className="text-4xl font-bold text-primary-400 mt-1">1</p>
                <button className="mt-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-xs px-4 py-2 rounded-lg font-medium self-start backdrop-blur-sm border border-primary-500/20 transition-colors">
                  Redeem Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={450} 
        bookingDetails={selectedSchedule ? {
          bus: selectedSchedule.bus.bus_name,
          route: `${selectedSchedule.route.source_en} to ${selectedSchedule.route.destination_en}`,
          seat: selectedSeat
        } : null}
      />
    </div>
  );
};

export default Home;
