import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Smartphone, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const PaymentModal = ({ isOpen, onClose, amount, bookingDetails }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const paymentMethods = [
    { id: 'chapa', name: 'Chapa', icon: CreditCard, color: 'text-green-400' },
    { id: 'telebirr', name: 'Telebirr', icon: Smartphone, color: 'text-blue-400' },
    { id: 'cbe', name: 'CBE Birr', icon: Wallet, color: 'text-purple-400' }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://expressgo-backend-1.onrender.com/api';
      const endpoint = `${baseUrl}/bookings/payments/${selectedMethod}/`;
      
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Use the logged-in user's real email
      const userEmail = session?.user?.email || bookingDetails?.email || 'ticket@expressgo.et';
      const firstName = userEmail.split('@')[0] || bookingDetails?.passenger_name || 'Customer';

      const res = await axios.post(endpoint, {
        amount,
        first_name: firstName,
        email: userEmail,
        trip_id: bookingDetails?.id || bookingDetails?.schedule_id || 'N-A',
      }, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.data.checkout_url) {
        // Redirect to the real Chapa / Payment Gateway checkout page
        window.location.href = res.data.checkout_url;
      } else {
        // Fallback for simulation if no URL is provided
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
        }, 1500);
      }

    } catch (error) {
      console.error("Payment initialization failed", error);
      setIsProcessing(false);

      // Safely extract a readable message — Chapa/DRF can return nested objects
      const data = error.response?.data;
      let errMsg = error.message || "Failed to connect to backend";
      if (data) {
        const raw = data.message || data.detail || data.error;
        if (typeof raw === 'string') {
          errMsg = raw;
        } else if (raw !== undefined) {
          errMsg = JSON.stringify(raw);
        } else {
          errMsg = JSON.stringify(data);
        }
      }

      alert("Payment Error: " + errMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-md p-6 relative bg-secondary border-white/10"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>

          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
                <p className="text-primary-400 text-3xl font-bold">{amount} ETB</p>
              </div>

              <div className="space-y-4 mb-8">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4
                      ${selectedMethod === method.id 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-white/10 hover:border-white/30 bg-white/5'}
                    `}
                  >
                    <div className={`p-2 rounded-lg bg-white/5 ${method.color}`}>
                      <method.icon size={24} />
                    </div>
                    <span className="font-medium text-lg">{method.name}</span>
                    {selectedMethod === method.id && (
                      <CheckCircle2 className="ml-auto text-primary-500" size={20} />
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                  ${!selectedMethod 
                    ? 'bg-white/5 text-white/40 cursor-not-allowed' 
                    : 'bg-primary-500 hover:bg-primary-400 text-black shadow-lg shadow-primary-500/20'}
                `}
              >
                {isProcessing ? 'Processing SECURE Payment...' : 'Pay Now'}
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-white/60 mb-8">Your ticket has been booked.</p>
              <button 
                onClick={onClose}
                className="primary-button w-full"
              >
                View Ticket
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentModal;
