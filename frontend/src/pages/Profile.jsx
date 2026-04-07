import React from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ticket, Award, Settings, Bell, ChevronRight, LogOut, Clock, MapPin, Sparkles } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const user_data = {
    name: 'Abebe Bikila',
    email: 'abebe@example.com',
    tier: 'Gold Member',
    tickets_count: 14,
    bonus_rides: 2,
    history: [
      { id: 1, from: 'Addis Ababa', to: 'Adama', date: 'Oct 24, 2023', status: 'Completed' },
      { id: 2, from: 'Addis Ababa', to: 'Hawassa', date: 'Oct 12, 2023', status: 'Completed' },
      { id: 3, from: 'Dire Dawa', to: 'Addis Ababa', date: 'Sep 30, 2023', status: 'Completed' },
    ]
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Sparkles size={160} className="text-primary-500" />
        </div>

        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-white/10 shadow-xl">
            <User size={64} className="text-black" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 p-2 rounded-xl">
            <Award size={20} className="text-primary-500" />
          </div>
        </div>

        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
             <h1 className="text-4xl font-bold text-white">{user_data.name}</h1>
             <span className="bg-primary-500/10 text-primary-500 border border-primary-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-auto">
                {user_data.tier}
             </span>
          </div>
          <p className="text-white/40">{user_data.email}</p>
          <div className="flex gap-4 pt-2">
            <button className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <Settings size={14} /> Edit Profile
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-400/80 hover:text-red-400 transition-colors bg-red-400/5 px-4 py-2 rounded-lg border border-red-400/10">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 flex items-center justify-between border-primary-500/20 bg-primary-500/5">
           <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Total Tickets</p>
              <h4 className="text-5xl font-black mt-2">{user_data.tickets_count}</h4>
           </div>
           <div className="p-4 bg-primary-500/10 rounded-2xl">
              <Ticket size={48} className="text-primary-500" />
           </div>
        </div>
        <div className="glass-card p-8 flex items-center justify-between">
           <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Bonus Rides</p>
              <h4 className="text-5xl font-black mt-2 text-primary-500">{user_data.bonus_rides}</h4>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl">
              <Sparkles size={48} className="text-white/20" />
           </div>
        </div>
      </div>

      {/* Travel History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Travel History</h2>
        <div className="space-y-4">
          {user_data.history.map(item => (
            <div key={item.id} className="glass-card px-8 py-6 flex items-center justify-between group hover:bg-white/5 transition-all">
               <div className="flex items-center gap-6">
                  <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-primary-500 transition-colors">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg flex items-center gap-2">
                      {item.from} <ChevronRight size={14} className="text-white/20" /> {item.to}
                    </h5>
                    <p className="text-white/40 text-sm">{item.date}</p>
                  </div>
               </div>
               <span className="bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-green-500/20">
                 {item.status}
               </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
