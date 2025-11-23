
export interface Duck {
  id: string;
  name: string;
  color: string; // JSON string of styling info
  avatarUrl?: string; // URL for the duck image
  progress: number; // 0 to 100
  speed: number; // Current speed factor (multiplier of base speed)
  state: 'idle' | 'running' | 'boosting' | 'tired' | 'tripped'; // Current physical state
  stateTimer: number; // How many ms left in current state
  reactionTime: number; // Delay in ms before starting
  waddleOffset: number; // Random offset for the sine wave movement
  rank?: number; // Final rank
}

export type GameState = 'setup' | 'racing' | 'finished';

// Default Colors now represent lane colors for the badges
export const DUCK_COLORS = [
  { bg: 'bg-red-500', border: 'border-red-700', text: 'text-white' },
  { bg: 'bg-orange-500', border: 'border-orange-700', text: 'text-white' },
  { bg: 'bg-yellow-400', border: 'border-yellow-600', text: 'text-black' },
  { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' },
  { bg: 'bg-teal-500', border: 'border-teal-700', text: 'text-white' },
  { bg: 'bg-cyan-500', border: 'border-cyan-700', text: 'text-white' },
  { bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
  { bg: 'bg-indigo-500', border: 'border-indigo-700', text: 'text-white' },
  { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-white' },
  { bg: 'bg-pink-500', border: 'border-pink-700', text: 'text-white' },
];

// Placeholder for the main duck asset
export const DEFAULT_DUCK_IMAGE = "https://img.icons8.com/color/96/rubber-duck.png";
