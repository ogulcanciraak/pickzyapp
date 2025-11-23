
import React, { useState } from 'react';
import { Duck } from '../types';
import { Plus, X, Play, Trash2, Clock } from 'lucide-react';

interface SetupScreenProps {
  ducks: Duck[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onStart: () => void;
  raceDuration: number;
  setRaceDuration: (val: number) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  ducks, 
  onAdd, 
  onRemove, 
  onClear,
  onStart, 
  raceDuration, 
  setRaceDuration 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
        if(ducks.length >= 50) {
            alert("En fazla 50 ördek yarıştırabilirsiniz!");
            return;
        }
        onAdd(inputValue);
        setInputValue('');
    }
  };

  const getColor = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return { bg: 'bg-gray-500', text: 'text-white' };
    }
  };

  return (
    <div className="w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-slate-800 flex flex-col h-full">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 text-center flex justify-between items-center">
            <h2 className="text-2xl font-black text-white tracking-wide uppercase flex-1">Yarışçılar</h2>
            {ducks.length > 0 && (
                <button 
                    onClick={onClear}
                    title="Tümünü Temizle"
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>

        <div className="p-6 bg-slate-100 flex-1 flex flex-col min-h-0">
            {/* Settings Row */}
            <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Clock size={18} />
                        <span>Süre: {raceDuration} sn</span>
                    </div>
                </div>
                <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    value={raceDuration} 
                    onChange={(e) => setRaceDuration(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                    <span>Hızlı (5s)</span>
                    <span>Uzun (60s)</span>
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4 shrink-0">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="İsim girin..."
                    className="flex-1 border-2 border-slate-300 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none shadow-inner"
                    autoFocus
                />
                <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white rounded-lg px-4 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </form>

            {/* List */}
            <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 mb-4 flex-1">
                {ducks.length === 0 && (
                    <div className="text-center text-slate-400 italic py-8 flex flex-col items-center">
                        <span className="text-4xl mb-2">🦆</span>
                        <p>Henüz kimse eklenmedi.</p>
                        <p className="text-sm mt-2">Yukarıdan isim ekleyerek başlayın.</p>
                    </div>
                )}
                
                {ducks.map((duck, index) => {
                    const colors = getColor(duck.color);
                    return (
                        <div key={duck.id} className="flex items-center bg-white p-2 rounded-lg border-2 border-slate-200 shadow-sm animate-[fadeIn_0.2s_ease-out]">
                            <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold mr-3 border border-black/10 shrink-0`}>
                                {index + 1}
                            </div>
                            <span className="flex-1 font-bold text-slate-700 text-lg truncate">{duck.name}</span>
                            <button 
                                onClick={() => onRemove(duck.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-2 shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Action */}
            <button
                onClick={onStart}
                disabled={ducks.length < 2}
                className="w-full shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-2xl font-black py-4 rounded-xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
            >
                <Play fill="currentColor" size={28} />
                BAŞLAT
            </button>
        </div>
      </div>
    </div>
  );
};
