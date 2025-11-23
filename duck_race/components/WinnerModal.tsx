import React, { useEffect, useState } from 'react';
import { Duck } from '../types';
import { RotateCcw, Home, Trophy, Clock } from 'lucide-react';

interface WinnerModalProps {
  winner: Duck;
  timer: string;
  onRestart: () => void;
  onReset: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ winner, timer, onRestart, onReset }) => {
  const [show, setShow] = useState(false);
  const colors = JSON.parse(winner.color);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${show ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent pointer-events-none opacity-0'}`}>
      
      <div className={`bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all duration-500 border-8 border-yellow-400 ${show ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'}`}>
        
        {/* Header Icon */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
             <div className="bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white inline-block">
                <Trophy size={48} className="text-white drop-shadow-md" fill="currentColor" />
             </div>
        </div>

        <div className="mt-8">
            <h2 className="text-4xl font-black text-slate-800 mb-1 uppercase tracking-tight">Kazanan</h2>
            
            {/* Duck Visual */}
            <div className="my-6 relative inline-block">
                <img src={winner.avatarUrl} alt="Winner" className="w-32 h-32 object-contain animate-bounce-slow" />
                <div className="absolute -bottom-2 right-0 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                    #1
                </div>
            </div>

            <div className={`text-3xl font-bold ${colors.text.replace('text-white', 'text-blue-600')} mb-4`}>
                {winner.name}
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-xl bg-slate-100 py-2 rounded-lg mb-6 mx-4">
                <Clock size={20} />
                {timer}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onRestart}
                    className="flex flex-col items-center justify-center py-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105 transition-all font-bold border-b-4 border-blue-300 active:border-b-0 active:translate-y-1"
                >
                    <RotateCcw size={20} className="mb-1" />
                    Tekrar
                </button>
                <button 
                    onClick={onReset}
                    className="flex flex-col items-center justify-center py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105 transition-all font-bold border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                >
                    <Home size={20} className="mb-1" />
                    Menü
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};