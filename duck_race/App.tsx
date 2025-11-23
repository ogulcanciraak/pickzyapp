
import React, { useState, useEffect, useRef } from 'react';
import { Duck, GameState, DUCK_COLORS } from './types';
import { SetupScreen } from './components/SetupScreen';
import { RaceTrack } from './components/RaceTrack';
import { WinnerModal } from './components/WinnerModal';
import { Volume2, VolumeX, Shuffle } from 'lucide-react';

// --- SVG GENERATOR FOR UNIQUE DUCKS ---
const generateUniqueDuckSvg = () => {
  const colors = ['#facc15', '#fbbf24', '#fde047', '#ffffff', '#a8a29e', '#57534e']; // Yellows, White, Grey, Brown
  const beakColors = ['#f97316', '#ea580c', '#fb923c'];
  const bodyColor = colors[Math.floor(Math.random() * colors.length)];
  const beakColor = beakColors[Math.floor(Math.random() * beakColors.length)];
  
  // Accessories
  const hatType = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0; // 0=None, 1=TopHat, 2=Cap, 3=Cowboy, 4=Crown
  const hasGlasses = Math.random() > 0.8;

  let accessorySvg = '';

  // Hats
  if (hatType === 1) { // Top Hat
    accessorySvg += `<rect x="35" y="5" width="30" height="25" fill="#1e293b" /><rect x="25" y="30" width="50" height="5" fill="#1e293b" /><rect x="35" y="25" width="30" height="5" fill="#ef4444" />`;
  } else if (hatType === 2) { // Cap
    accessorySvg += `<path d="M30 30 Q30 10 70 30 L70 35 L30 35 Z" fill="#2563eb" /><rect x="65" y="30" width="20" height="5" fill="#2563eb" />`;
  } else if (hatType === 3) { // Cowboy
    accessorySvg += `<ellipse cx="50" cy="25" rx="35" ry="10" fill="#78350f" /><path d="M35 25 Q50 5 65 25" fill="#92400e" stroke="#78350f" stroke-width="2"/>`;
  } else if (hatType === 4) { // Crown
    accessorySvg += `<path d="M30 30 L30 15 L40 25 L50 10 L60 25 L70 15 L70 30 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" />`;
  }

  // Glasses
  if (hasGlasses) {
    accessorySvg += `<circle cx="65" cy="45" r="6" fill="black" /><circle cx="80" cy="45" r="6" fill="black" /><line x1="71" y1="45" x2="74" y2="45" stroke="black" stroke-width="2" />`;
  } else {
    // Normal Eye
    accessorySvg += `<circle cx="70" cy="45" r="5" fill="white" /><circle cx="72" cy="45" r="2" fill="black" />`;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- Body -->
      <path d="M20 60 Q10 80 40 90 L80 90 Q95 80 90 60 Q85 40 60 40 L60 60 Z" fill="${bodyColor}" />
      <!-- Head -->
      <circle cx="60" cy="40" r="25" fill="${bodyColor}" />
      <!-- Wing -->
      <path d="M35 65 Q45 85 65 65" fill="none" stroke="${bodyColor === '#ffffff' ? '#e5e5e5' : '#ca8a04'}" stroke-width="3" />
      <!-- Beak -->
      <path d="M80 45 Q95 40 95 50 Q90 60 80 55 Z" fill="${beakColor}" />
      
      ${accessorySvg}
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [winner, setWinner] = useState<Duck | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [raceDuration, setRaceDuration] = useState<number>(10); // Seconds
  
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isRacingRef = useRef<boolean>(false);

  // Initialize
  useEffect(() => {
    const initialNames = ['Rory', 'Ilia', 'Rozalyn', 'George', 'Ian'];
    const initialDucks: Duck[] = initialNames.map((name, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      color: JSON.stringify(DUCK_COLORS[idx % DUCK_COLORS.length]),
      avatarUrl: generateUniqueDuckSvg(),
      progress: 0,
      speed: 0,
      state: 'idle',
      stateTimer: 0,
      reactionTime: 0,
      waddleOffset: Math.random() * 100
    }));
    setDucks(initialDucks);
  }, []);

  const handleAddDuck = (name: string) => {
    if (!name.trim()) return;
    
    setDucks(prev => {
      const newDuck: Duck = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        color: JSON.stringify(DUCK_COLORS[prev.length % DUCK_COLORS.length]),
        avatarUrl: generateUniqueDuckSvg(),
        progress: 0,
        speed: 0,
        state: 'idle',
        stateTimer: 0,
        reactionTime: 0,
        waddleOffset: Math.random() * 100
      };
      return [...prev, newDuck];
    });
  };

  const handleRemoveDuck = (id: string) => {
    setDucks(prev => prev.filter(d => d.id !== id));
  };

  const handleClearDucks = () => {
    if (confirm('Tüm listeyi silmek istediğinize emin misiniz?')) {
        setDucks([]);
    }
  };

  const handleShuffle = () => {
    setDucks(prev => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.map((d, idx) => ({
            ...d,
            color: JSON.stringify(DUCK_COLORS[idx % DUCK_COLORS.length]),
            avatarUrl: generateUniqueDuckSvg() 
        }));
    });
  };

  const startRace = () => {
    if (ducks.length < 2) return;
    
    // RESET DUCKS FOR NEW RACE
    setDucks(prev => prev.map(d => ({ 
      ...d, 
      progress: 0, 
      speed: 0,
      rank: undefined,
      state: 'idle',
      stateTimer: 0,
      // Random reaction time: 0 to 800ms
      reactionTime: Math.random() * 800, 
    })));
    
    setWinner(null);
    setTimer(0);
    setGameState('racing');
    isRacingRef.current = true;
    startTimeRef.current = Date.now();
    previousTimeRef.current = Date.now();
    
    // Start the loop
    requestRef.current = requestAnimationFrame(animateRace);
  };

  const resetGame = () => {
    isRacingRef.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('setup');
    setWinner(null);
    setTimer(0);
    setDucks(prev => prev.map(d => ({ ...d, progress: 0, speed: 0, rank: undefined, state: 'idle' })));
  };

  const restartRace = () => {
    startRace();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  // --- ADVANCED PHYSICS ENGINE WITH CATCH-UP LOGIC ---
  const animateRace = (time: number) => {
    if (!isRacingRef.current) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current;
    const deltaTime = Math.min(currentTime - previousTimeRef.current, 50); 
    previousTimeRef.current = currentTime;
    
    setTimer(elapsedTime);

    setDucks(prevDucks => {
      let raceFinished = false;
      let currentWinner: Duck | null = null;

      // Calculate Leader Position for Rubber Banding
      const maxProgress = Math.max(...prevDucks.map(d => d.progress));

      const updatedDucks = prevDucks.map(duck => {
        if (duck.rank) return duck; // Already finished

        // 1. REACTION TIME
        if (elapsedTime < duck.reactionTime) return duck;

        let newDuck = { ...duck };

        // 2. STATE MACHINE
        if (newDuck.stateTimer > 0) {
            newDuck.stateTimer -= deltaTime;
        } else {
            newDuck.state = 'running';
            newDuck.stateTimer = 0;

            const rand = Math.random();
            const progressPercent = newDuck.progress;
            
            // Dynamic probabilities based on position
            // If far behind, higher chance to boost
            let boostChance = 0.005;
            let tripChance = 0.008;

            if (maxProgress - progressPercent > 15) {
                boostChance = 0.02; // Desperate catch up
                tripChance = 0.001; // Less likely to trip if behind
            }
            
            // Final Sprint Chaos (Last 15%)
            if (progressPercent > 85) {
                boostChance = 0.03; 
                tripChance = 0.02; // Nervousness
            }

            if (rand < boostChance) {
                newDuck.state = 'boosting';
                newDuck.stateTimer = 600 + Math.random() * 800;
            } else if (rand < boostChance + 0.005) {
                newDuck.state = 'tired';
                newDuck.stateTimer = 800 + Math.random() * 800;
            } else if (rand < boostChance + 0.005 + tripChance) {
                newDuck.state = 'tripped';
                newDuck.stateTimer = 400 + Math.random() * 400;
            }
        }

        // 3. TARGET SPEED CALCULATION
        const idealVelocityPerMs = 105 / ((raceDuration * 1000) - 500); 

        let targetMultiplier = 1.0;

        // Catch-Up / Rubber Band Logic
        const distanceToLeader = maxProgress - newDuck.progress;
        let rubberBandFactor = 1.0;
        
        if (distanceToLeader > 0) {
            // If behind, get up to 20% speed bonus based on distance
            rubberBandFactor = 1 + (Math.min(distanceToLeader, 30) * 0.01);
        } else if (distanceToLeader === 0 && maxProgress > 0) {
            // If leader, slight drag (wind resistance) to keep race tight
            rubberBandFactor = 0.96;
        }

        switch (newDuck.state) {
            case 'boosting':
                targetMultiplier = 3.5 * rubberBandFactor; 
                break;
            case 'tired':
                targetMultiplier = 0.4 * rubberBandFactor;
                break;
            case 'tripped':
                targetMultiplier = 0.0;
                break;
            case 'running':
            default:
                // Sine wave waddle
                const waddle = Math.sin((currentTime / 600) + newDuck.waddleOffset); 
                
                // Random Flux (Turbulence)
                const flux = 0.9 + Math.random() * 0.2; 

                targetMultiplier = (1.0 + (waddle * 0.2)) * rubberBandFactor * flux;
                break;
        }

        // 4. APPLY PHYSICS
        // Fast acceleration, slower deceleration
        const lerpFactor = newDuck.speed < targetMultiplier ? 0.08 : 0.04;
        newDuck.speed = duck.speed + (targetMultiplier - duck.speed) * lerpFactor;

        // Move
        const moveAmount = idealVelocityPerMs * newDuck.speed * deltaTime;
        newDuck.progress = duck.progress + moveAmount;

        // Finish Check
        if (newDuck.progress >= 100) {
            const finishedCount = prevDucks.filter(d => d.rank !== undefined).length;
            const rank = finishedCount + 1;
            
            if (rank === 1) {
                raceFinished = true;
                currentWinner = { ...newDuck, progress: 100, rank: 1 };
                return currentWinner;
            }
            return { ...newDuck, progress: 100, rank };
        }

        return newDuck;
      });

      if (raceFinished && currentWinner) {
        setWinner(currentWinner);
        setTimeout(() => {
             isRacingRef.current = false;
             if(requestRef.current) cancelAnimationFrame(requestRef.current);
             setGameState('finished');
        }, 1000);
      }
      
      if (!updatedDucks.some(d => !d.rank)) {
         isRacingRef.current = false;
         if(requestRef.current) cancelAnimationFrame(requestRef.current);
         setGameState('finished');
      }

      return updatedDucks;
    });

    if (isRacingRef.current) {
        requestRef.current = requestAnimationFrame(animateRace);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      isRacingRef.current = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="h-screen w-full bg-sky-300 relative overflow-hidden flex flex-col font-sans">
      
      {/* Game HUD / Header */}
      <div className="z-50 px-4 py-3 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent absolute top-0 w-full pointer-events-none h-24">
        
        {/* Left Controls */}
        <div className="flex flex-col gap-2 pointer-events-auto">
             <div className="flex gap-1">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/80 hover:bg-black text-white p-2 rounded border-2 border-white/20 transition-all"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
             </div>
             
             {gameState === 'setup' && (
                <button 
                  onClick={handleShuffle}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold border-2 border-green-800 shadow-md flex items-center gap-2"
                >
                  <Shuffle size={16} /> Karıştır
                </button>
             )}
        </div>

        {/* Center Timer */}
        <div className="bg-slate-200 border-4 border-slate-700 rounded-xl px-6 py-1 shadow-2xl transform translate-y-2">
            <div className="font-digital text-6xl text-slate-900 tracking-widest leading-none">
                {formatTime(timer)}
            </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-col gap-2 pointer-events-auto items-end">
            {gameState !== 'setup' && (
                 <button 
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
                 >
                    Durdur / Sıfırla
                 </button>
            )}
             {gameState === 'setup' && (
                <div className="text-white font-bold drop-shadow-md text-right">
                    <p className="text-2xl">HAZIRLIK</p>
                    <p className="text-sm opacity-80">{ducks.length} Yarışmacı</p>
                </div>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-0 h-full">
          {gameState === 'setup' ? (
            <div className="h-full flex items-center justify-center bg-black/20 backdrop-blur-sm pt-20">
               <SetupScreen 
                  ducks={ducks} 
                  onAdd={handleAddDuck} 
                  onRemove={handleRemoveDuck} 
                  onClear={handleClearDucks}
                  onStart={startRace} 
                  raceDuration={raceDuration}
                  setRaceDuration={setRaceDuration}
               />
            </div>
          ) : (
            <RaceTrack ducks={ducks} />
          )}
      </div>

      {gameState === 'finished' && winner && (
        <WinnerModal 
          winner={winner} 
          onRestart={restartRace} 
          onReset={resetGame} 
          timer={formatTime(timer)}
        />
      )}
    </div>
  );
};

export default App;
