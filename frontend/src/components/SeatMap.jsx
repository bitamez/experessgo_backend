import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const SeatMap = ({ busId, onSeatSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  
  // Generating a sample 2x2 layout for a bus
  const rows = 12;
  const layout = ['A', 'B', 'C', 'D']; // A & B | Aisle | C & D
  
  // Simulated booked seats
  const bookedSeats = [2, 5, 8, 12, 19, 25, 30, 42];

  const handleSeatClick = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return;
    setSelectedSeat(seatNum);
    onSeatSelect(seatNum);
  };

  return (
    <div className="glass-card p-8 space-y-8 max-w-lg mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
           Select Your Seat <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-1 rounded">Bus #{busId}</span>
        </h3>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white/10 border border-white/20"></div> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary-500"></div> Selected</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white/20 border border-white/10 opacity-30"></div> Booked</div>
        </div>
      </div>

      {/* Driver Cabin */}
      <div className="w-full h-12 bg-white/5 rounded-t-3xl border-x border-t border-white/10 flex items-center justify-center text-white/20 text-xs font-bold uppercase tracking-widest gap-2">
        <div className="w-8 h-8 rounded-full border-4 border-white/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/10"></div>
        </div>
        Driver's Cabin
      </div>

      <div className="grid grid-cols-5 gap-y-4 px-4 bg-gradient-to-b from-white/5 to-transparent py-8 rounded-b-3xl border-x border-b border-white/10">
        {[...Array(rows)].map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Left side (A, B) */}
            <div 
                onClick={() => handleSeatClick(rowIndex * 4 + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer border
                    ${bookedSeats.includes(rowIndex * 4 + 1) ? 'bg-white/5 opacity-10 cursor-not-allowed border-none' : 
                      selectedSeat === rowIndex * 4 + 1 ? 'bg-primary-500 text-black border-primary-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-primary-500/50 hover:bg-white/10'}
                `}
            >
              {rowIndex * 4 + 1}
            </div>
            <div 
                onClick={() => handleSeatClick(rowIndex * 4 + 2)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer border
                    ${bookedSeats.includes(rowIndex * 4 + 2) ? 'bg-white/5 opacity-10 cursor-not-allowed border-none' : 
                      selectedSeat === rowIndex * 4 + 2 ? 'bg-primary-500 text-black border-primary-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-primary-500/50 hover:bg-white/10'}
                `}
            >
              {rowIndex * 4 + 2}
            </div>

            {/* Aisle */}
            <div className="flex items-center justify-center">
                <div className="w-1 h-8 bg-white/5 rounded-full"></div>
            </div>

            {/* Right side (C, D) */}
            <div 
                onClick={() => handleSeatClick(rowIndex * 4 + 3)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer border
                    ${bookedSeats.includes(rowIndex * 4 + 3) ? 'bg-white/5 opacity-10 cursor-not-allowed border-none' : 
                      selectedSeat === rowIndex * 4 + 3 ? 'bg-primary-500 text-black border-primary-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-primary-500/50 hover:bg-white/10'}
                `}
            >
              {rowIndex * 4 + 3}
            </div>
            <div 
                onClick={() => handleSeatClick(rowIndex * 4 + 4)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer border
                    ${bookedSeats.includes(rowIndex * 4 + 4) ? 'bg-white/5 opacity-10 cursor-not-allowed border-none' : 
                      selectedSeat === rowIndex * 4 + 4 ? 'bg-primary-500 text-black border-primary-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-primary-500/50 hover:bg-white/10'}
                `}
            >
              {rowIndex * 4 + 4}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="bg-primary-500/5 p-4 rounded-2xl border border-primary-500/10 flex items-start gap-3">
        <Info className="text-primary-500 shrink-0" size={18} />
        <p className="text-xs text-white/60 leading-relaxed">
            Premium seats have extra legroom and a dedicated charging port. <br />
            <span className="text-primary-400 font-bold">Selected seat: {selectedSeat || 'None'}</span>
        </p>
      </div>
    </div>
  );
};

export default SeatMap;
