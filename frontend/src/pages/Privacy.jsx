import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: "Data We Collect",
      icon: <Eye className="text-primary-500" />,
      content: "We collect information you provide directly to us, including name, email, phone number, and payment information when you book a ticket or register an account."
    },
    {
      title: "How We Use Your Data",
      icon: <FileText className="text-primary-500" />,
      content: "Your data is used to process bookings, verify transactions, send travel notifications, and improve our AI-powered travel recommendations."
    },
    {
      title: "Data Security",
      icon: <Shield className="text-primary-500" />,
      content: "We implement industry-standard encryption (SSL/TLS) to protect your personal and payment information during transmission and storage."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold mb-6">
            <Lock size={14} />
            SECURITY FIRST
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">Privacy Policy</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Your privacy is our top priority. We are committed to protecting the personal information you share with ExpressGo.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group hover:bg-white/5 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {section.title}
                    <ChevronRight size={16} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-primary-500/10 border border-primary-500/20 text-center">
          <p className="text-white/60 text-sm italic">
            Last updated: April 2026. For privacy concerns, please contact our Data Protection Officer at privacy@expressgo.et
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
