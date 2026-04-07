import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Hammer, CreditCard, ChevronRight } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: "Booking Service",
      icon: <FileText className="text-primary-500" />,
      content: "All bookings are subject to availability and the specific carrier's rules. Tickets are non-transferable and must be presented (digital or printed) at check-in."
    },
    {
      title: "Payment & Refunds",
      icon: <CreditCard className="text-primary-500" />,
      content: "Payments must be made in full through our integrated payment gateways (Chapa, Telebirr, CBE). Refunds are available up to 24 hours before departure, subject to a 10% processing fee."
    },
    {
      title: "Code of Conduct",
      icon: <Hammer className="text-primary-500" />,
      content: "Passengers must follow the safety instructions and code of conduct set by the bus operator. ExpressGo reserves the right to cancel bookings for rule violations without a refund."
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
            <FileText size={14} />
            USER AGREEMENT
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6">Terms of Service</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            By using ExpressGo, you agree to comply with our terms and conditions. These terms govern your use of our platform and services.
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
              className="glass-card p-10 group hover:bg-white/5 transition-all border border-white/5"
            >
              <div className="flex items-start gap-8">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 group-hover:text-primary-500 transition-all">
                    {section.title}
                    <ChevronRight size={18} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </h3>
                  <p className="text-white/50 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center text-white/40 text-sm">
          ExpressGo Ethiopia. All terms are governed by the laws of the Federal Democratic Republic of Ethiopia.
        </div>
      </div>
    </div>
  );
};

export default Terms;
