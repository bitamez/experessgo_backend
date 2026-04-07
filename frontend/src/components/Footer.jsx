import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Globe, Mail, Phone, MapPin, ExternalLink, Shield, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Partners', path: '/partners' }
    ],
    Booking: [
      { name: t('findBus'), path: '/' },
      { name: t('bookings'), path: '/bookings' },
      { name: 'Rewards Program', path: '/rewards' },
      { name: 'Bus Schedule', path: '/schedules' }
    ],
    Support: [
      { name: t('support'), path: '/support' },
      { name: t('terms'), path: '/terms' },
      { name: t('privacy'), path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' }
    ]
  };

  return (
    <footer className="relative z-[9999] pointer-events-auto mt-40 border-t border-white/5 bg-black/80 pt-20 pb-10">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500/20 transition-all duration-300">
                <Bus className="text-primary-500" size={28} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">EXPRESSGO</span>
            </Link>
            <p className="text-white/50 leading-relaxed max-w-sm">
              Redefining luxury travel across Ethiopia with AI-integrated booking and premium bus services. Travel with comfort, safety, and technology.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Globe, Globe, Globe].map((Icon, i) => (
                <a 
                  key={i}
                  href="#"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 text-white/40 hover:text-primary-500 transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-white/40 hover:text-primary-500 transition-all text-sm flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Legal */}
        <div className="pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <Mail size={16} className="text-primary-500" />
              <span>support@expressgo.et</span>
            </div>
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <Phone size={16} className="text-primary-500" />
              <span>+251 900 000 000</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/20 text-xs font-medium">
              © {currentYear} ExpressGo Ethiopia. PROUDLY DEVELOPED IN ADDIS ABABA.
            </p>
          </div>

          <div className="flex justify-end gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Systems Operational
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
