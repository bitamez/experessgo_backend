import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Clock, Sparkles } from 'lucide-react';

const Support = () => {
  const contactInfo = [
    {
      title: "Email Support",
      icon: <Mail className="text-primary-500" />,
      detail: "support@expressgo.et",
      description: "Get a response within 2 hours for all booking and account inquiries."
    },
    {
      title: "Phone Support",
      icon: <Phone className="text-primary-500" />,
      detail: "+251 900 000 000",
      description: "Direct line for urgent travel assistance and terminal directions."
    },
    {
      title: "Live AI Support",
      icon: <MessageCircle className="text-primary-500" />,
      detail: "Ask AI Chatbot",
      description: "Our intelligent travel assistant is always online to help you book your next trip."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold mb-6">
            <Sparkles size={14} className="animate-pulse" />
            24/7 ASSISTANCE
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">How can we help?</h1>
          <p className="text-white/60 text-xl max-w-3xl mx-auto leading-relaxed">
            Our team is here to ensure your travel experience is smooth and stress-free. Whether you need booking help or trip updates, we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 flex flex-col items-center text-center group hover:bg-primary-500/5 transition-all cursor-pointer"
            >
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all mb-8 shadow-2xl">
                {info.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{info.title}</h3>
              <p className="text-primary-500 font-bold mb-6 text-lg">{info.detail}</p>
              <p className="text-white/40 leading-relaxed text-sm">
                {info.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass-card p-12 bg-gradient-to-r from-primary-500/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 border border-primary-500/20">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter italic">Ready to travel with us?</h2>
            <p className="text-white/50 text-lg">Experience the next generation of Ethiopian travel today.</p>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
            <Clock size={20} className="text-primary-500" />
            <span className="text-sm font-medium">Standard response time: 2 Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
