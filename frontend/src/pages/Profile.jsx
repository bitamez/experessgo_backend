import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Ticket, Award, Settings, Bell, ChevronRight, LogOut, Clock, MapPin, Sparkles, Check, X } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const stats = {
    tier: 'Gold Member',
    tickets_count: 0,
    bonus_rides: 0,
    history: []
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setName(user.user_metadata?.name || 'New Passenger');
      } else {
        navigate('/login');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { name: name }
    });
    
    if (!error) {
      setUser(data.user);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (!user) return <div className="p-10 text-center text-white/50">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
            <Sparkles size={160} className="text-primary-500" />
        </div>

        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-white/10 shadow-xl overflow-hidden text-black font-bold text-4xl">
             {name ? name.charAt(0).toUpperCase() : <User size={64} className="text-black" />}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 p-2 rounded-xl">
            <Award size={20} className="text-primary-500" />
          </div>
        </div>

        <div className="text-center md:text-left space-y-2 flex-1 w-full z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
             {isEditing ? (
               <input 
                 autoFocus
                 type="text" 
                 value={name} 
                 onChange={(e) => setName(e.target.value)}
                 className="bg-black/50 border border-primary-500/50 rounded-xl px-4 py-2 text-3xl font-bold text-white outline-none w-full md:w-auto focus:border-primary-500 transition-colors"
                 placeholder="Enter your name"
               />
             ) : (
               <h1 className="text-4xl font-bold text-white">{name}</h1>
             )}
             
             {!isEditing && (
               <span className="bg-primary-500/10 text-primary-500 border border-primary-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-auto">
                  {stats.tier}
               </span>
             )}
          </div>
          <p className="text-white/40">{user.email}</p>
          <div className="flex gap-4 pt-2 justify-center md:justify-start">
            {isEditing ? (
              <>
                <button disabled={isSaving} onClick={handleSave} className="flex items-center justify-center gap-2 text-xs font-bold text-black transition-colors bg-primary-500 hover:bg-primary-400 px-6 py-2 rounded-lg border border-primary-500/50">
                  {isSaving ? "Saving..." : <><Check size={14} /> Save</>}
                </button>
                <button disabled={isSaving} onClick={() => { setIsEditing(false); setName(user.user_metadata?.name || 'New Passenger'); }} className="flex items-center justify-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors bg-white/5 px-6 py-2 rounded-lg border border-white/10">
                  <X size={14} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <Settings size={14} /> Edit Profile
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-400/80 hover:text-red-400 transition-colors bg-red-400/5 px-4 py-2 rounded-lg border border-red-400/10">
                  <LogOut size={14} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 flex items-center justify-between border-primary-500/20 bg-primary-500/5">
           <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Total Tickets</p>
              <h4 className="text-5xl font-black mt-2">{stats.tickets_count}</h4>
           </div>
           <div className="p-4 bg-primary-500/10 rounded-2xl">
              <Ticket size={48} className="text-primary-500" />
           </div>
        </div>
        <div className="glass-card p-8 flex items-center justify-between">
           <div>
              <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Bonus Rides</p>
              <h4 className="text-5xl font-black mt-2 text-primary-500">{stats.bonus_rides}</h4>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl">
              <Sparkles size={48} className="text-white/20" />
           </div>
        </div>
      </div>

      {/* Travel History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Travel History</h2>
        {stats.history.length === 0 ? (
          <div className="glass-card p-10 text-center flex flex-col items-center gap-2">
            <Clock size={32} className="text-white/20 mb-2" />
            <h3 className="text-xl font-bold text-white/60">No recent travels</h3>
            <p className="text-sm text-white/40">Book a ticket to see your journey history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.history.map((item, index) => (
              <div key={index} className="glass-card px-8 py-6 flex items-center justify-between group hover:bg-white/5 transition-all">
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
        )}
      </div>
    </div>
  );
};

export default Profile;
