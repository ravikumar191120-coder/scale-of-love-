import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Heart } from 'lucide-react';
import { COSMIC_SCALES } from '../data/scales';
import { ScaleItem } from '../types';

interface NavigationControlsProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentIndex,
  onSelectIndex,
  isPlaying,
  onTogglePlay,
}) => {
  const currentScale: ScaleItem = COSMIC_SCALES[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === COSMIC_SCALES.length - 1;
  const nextScale: ScaleItem | undefined = COSMIC_SCALES[currentIndex + 1];

  const handlePrev = () => {
    if (!isFirst) {
      onSelectIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      onSelectIndex(currentIndex + 1);
    }
  };

  // Progress percentage
  const progressPercent = ((currentIndex + 1) / COSMIC_SCALES.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto space-y-3 px-2">
      {/* 10/10 Cinematic Cosmic Milestone Dots */}
      <div className="flex items-center justify-between gap-1 px-3 py-1.5 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl overflow-x-auto scrollbar-none">
        {COSMIC_SCALES.map((item, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          const isHeart = idx === COSMIC_SCALES.length - 1;

          return (
            <button
              key={item.id}
              onClick={() => onSelectIndex(idx)}
              title={`${idx + 1}. ${item.title}`}
              className="relative p-1.5 group shrink-0 transition-transform active:scale-90"
            >
              <div
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? isHeart
                      ? 'w-6 h-6 sm:w-7 sm:h-7 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)] ring-2 ring-white scale-110'
                      : 'w-6 h-6 sm:w-7 sm:h-7 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] ring-2 ring-rose-400 scale-110'
                    : isPassed
                    ? 'bg-rose-500/70'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
              >
                {isActive && (
                  <span className="text-[10px]">
                    {isHeart ? '❤️' : idx + 1}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 10/10 Interactive Glowing Controller Bar */}
      <div className="relative bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Animated Top Progress Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-indigo-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-4 mt-1">
          {/* Back Step */}
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`p-3 sm:px-4 sm:py-3 rounded-2xl flex items-center gap-2 font-medium text-xs sm:text-sm transition-all ${
              isFirst
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 active:scale-95 shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Piche</span>
          </button>

          {/* Auto Tour Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`p-3 rounded-2xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isPlaying ? 'Pause Auto Cosmic Zoom' : 'Auto-Play Cosmic Voyage'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="hidden md:inline">Auto ON</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="hidden md:inline">Auto</span>
              </>
            )}
          </button>

          {/* 10/10 MAIN HERO "NEXT" BUTTON WITH COSMIC GLOW & PREVIEW */}
          <motion.button
            onClick={handleNext}
            disabled={isLast}
            whileTap={{ scale: 0.96 }}
            className={`flex-1 max-w-xs py-3 px-4 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 transition-all relative overflow-hidden shadow-xl ${
              isLast
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] cursor-default'
                : 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.8)] border border-rose-400/40'
            }`}
          >
            {/* Shimmer sweep effect */}
            {!isLast && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
            )}

            {isLast ? (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-white animate-heartbeat-active" />
                <span>Antim Manzil: Mera Dil ❤️</span>
              </div>
            ) : (
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-sm sm:text-base font-extrabold tracking-wide">
                    Cosmic Zoom Out
                  </span>
                  <ChevronRight className="w-5 h-5 animate-pulse" />
                </div>
                {nextScale && (
                  <span className="text-[10px] sm:text-[11px] font-normal text-rose-100 opacity-90 truncate max-w-[140px] sm:max-w-[180px]">
                    {nextScale.type === 'heart' ? 'Agla: Antim Manzil ❤️' : `Agla: Mystery #${nextScale.order + 1} 🔮`}
                  </span>
                )}
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
