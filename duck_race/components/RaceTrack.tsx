
import React from 'react';
import { Duck } from '../types';
import { Zap, AlertCircle } from 'lucide-react';

interface RaceTrackProps {
  ducks: Duck[];
}

// Simple Bush SVG component to match the art style
const Bush = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50C10 50 0 40 10 30C20 20 20 10 40 10C60 10 70 20 80 20C90 20 100 40 90 50" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 50C20 50 15 35 30 30" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M70 50C70 50 75 35 60 30" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RaceTrack: React.FC<RaceTrackProps> = ({ ducks }) => {
  
  const getColor = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return { bg: 'bg-gray-500', border: 'border-gray-600', text: 'text-white' };
    }
  };

  const count = ducks.length;
  // If we have few ducks, we want them bigger and centered (Zoom In)
  // If we have many, we want them compact (Zoom Out)
  
  // Calculate a row height based on count. 
  // Max height 160px (Zoomed in), Min height 40px (Zoomed out)
  const calculateRowHeight = () => {
    if (count <= 3) return 'h-40';
    if (count <= 6) return 'h-32';
    if (count <= 10) return 'h-24';
    if (count <= 20) return 'h-16';
    return 'h-full'; // Flex basis for very large numbers
  };

  const rowHeightClass = calculateRowHeight();
  const isCrowded = count > 10;
  const isVeryCrowded = count > 25;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#2d88a4]">
        
        {/* BACKGROUND ART LAYER */}
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col">
            <div className="h-[20%] bg-[#22c55e] relative shadow-lg shrink-0">
                <Bush className="absolute bottom-2 left-[5%] w-16 h-10 opacity-80" />
                <Bush className="absolute bottom-6 left-[45%] w-12 h-8 opacity-60" />
                <Bush className="absolute bottom-4 right-[10%] w-20 h-12 opacity-80" />
                <div className="absolute bottom-8 left-[20%] text-green-700 font-bold opacity-40">w</div>
                <div className="absolute bottom-4 right-[30%] text-green-700 font-bold opacity-40">w</div>
                 <div className="absolute bottom-0 w-full h-4 bg-[#784f32]">
                    <div className="absolute -top-1 left-0 w-full h-2 bg-[#784f32] [clip-path:polygon(0%_100%,_10%_0%,_20%_100%,_30%_10%,_40%_100%,_50%_0%,_60%_100%,_70%_0%,_80%_100%,_90%_0%,_100%_100%)] opacity-50"></div>
                </div>
            </div>
            <div className="flex-1 bg-[#2686a0] relative overflow-hidden">
                <div className="w-[120%] h-24 bg-[#1f728a] absolute top-[10%] -left-10 -rotate-1 opacity-80 rounded-[50%] blur-sm"></div>
                <div className="w-[120%] h-24 bg-[#1b657d] absolute top-[30%] -left-10 rotate-1 opacity-80 rounded-[50%] blur-sm"></div>
                <div className="w-[120%] h-24 bg-[#185a70] absolute top-[50%] -left-10 -rotate-1 opacity-80 rounded-[50%] blur-sm"></div>
                <div className="w-[120%] h-24 bg-[#144f63] absolute top-[70%] -left-10 rotate-1 opacity-80 rounded-[50%] blur-sm"></div>
                <div className="w-[120%] h-24 bg-[#104557] absolute top-[90%] -left-10 -rotate-1 opacity-80 rounded-[50%] blur-sm"></div>
            </div>
        </div>

        {/* GAMEPLAY LAYER */}
        <div className="absolute inset-0 z-20 flex flex-col h-full">
            {/* Spacer for grass */}
            <div className="h-[20%] w-full flex-shrink-0 pointer-events-none"></div>

            {/* Water / Track Area */}
            <div className="flex-1 relative w-full h-full flex flex-col justify-center">
                
                {/* Finish Line */}
                <div className="absolute top-0 bottom-0 right-[10%] w-[5vw] z-0 flex flex-col border-l-4 border-r-4 border-white/30 h-full">
                    <div className="w-full h-full opacity-90" style={{
                        backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
                        backgroundColor: 'white',
                        backgroundSize: '30px 30px',
                        backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
                    }}></div>
                </div>

                {/* Container for Ducks - Uses flex but centers content if few ducks */}
                <div className={`w-full relative flex flex-col ${count > 20 ? 'h-full' : ''}`}>
                    {ducks.map((duck, index) => {
                        const colors = getColor(duck.color);
                        
                        // Determine animation class
                        let animClass = 'animate-swim'; // Default swimming
                        if (duck.state === 'boosting') animClass = 'animate-boost';
                        if (duck.state === 'tripped') animClass = ''; // No animation when tripped
                        
                        return (
                            <div 
                                key={duck.id} 
                                className={`relative w-full flex items-center shrink-0 border-b border-black/5 last:border-0 ${rowHeightClass}`}
                                style={isVeryCrowded ? { flex: 1, maxHeight: '60px' } : {}}
                            >
                                {/* Duck Position */}
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 z-20"
                                    style={{ 
                                        left: `calc(${duck.progress * 0.8}% + 10px)`, 
                                        zIndex: 100 + index, // Ensure stacking order
                                        height: isCrowded ? '140%' : '85%', // Overlap lanes if crowded
                                        width: 'auto',
                                        aspectRatio: '1/1',
                                        transition: 'left 0.3s ease-out' // Smoother transition for erratic physics
                                    }}
                                >
                                    <div className="relative group w-full h-full">
                                        
                                        {/* Status Effects */}
                                        {duck.state === 'boosting' && (
                                            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-yellow-300 animate-pulse drop-shadow-lg z-0">
                                                <Zap size={isCrowded ? 24 : 48} fill="currentColor" />
                                            </div>
                                        )}
                                        {duck.state === 'tripped' && (
                                            <div className="absolute top-0 right-0 -mt-4 text-red-500 animate-bounce font-bold text-2xl z-50">
                                                <AlertCircle size={isCrowded ? 20 : 32} fill="white" />
                                            </div>
                                        )}

                                        {/* Name Bubble */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 bg-white border-2 border-black px-4 py-2 rounded-lg shadow-sm whitespace-nowrap z-50 transition-transform origin-bottom ${isCrowded ? '-top-[60%] scale-75' : '-top-16'}`}>
                                            <p className={`relative z-10 font-black text-black font-sans leading-none tracking-tight ${isCrowded ? 'text-xs' : 'text-sm md:text-base'}`}>{duck.name}</p>
                                            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black"></div>
                                            <div className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                                        </div>

                                        {/* Duck Image Container with CSS Animation */}
                                        <div className={`relative w-full h-full ${animClass} ${duck.state === 'tripped' ? 'rotate-[30deg] translate-y-2 grayscale' : ''}`}>
                                            <img 
                                                src={duck.avatarUrl} 
                                                alt="Duck" 
                                                className="w-full h-full object-contain drop-shadow-md select-none"
                                                draggable="false"
                                            />
                                            
                                            {/* Number Badge */}
                                            {!isCrowded && (
                                                <div className={`absolute top-[60%] left-[10%] w-[30%] h-[30%] rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center shadow-sm transform -translate-y-1/2`}>
                                                    <span className="text-[60%] font-black text-white leading-none">{index + 1}</span>
                                                </div>
                                            )}

                                            {/* Rank Badge */}
                                            {duck.rank && (
                                                <div className="absolute -right-[10%] -top-[10%] bg-yellow-400 text-yellow-900 border-2 border-white w-[40%] h-[40%] rounded-full flex items-center justify-center font-black text-[70%] shadow-lg animate-bounce z-40">
                                                    #{duck.rank}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};
