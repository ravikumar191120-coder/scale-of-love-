import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { UserMediaConfig } from '../types';
import { cosmicAudio } from '../utils/audio';
import { triggerLoveConfettiExplosion } from '../utils/confetti';

interface CosmicHeartFinaleProps {
  mediaConfig: UserMediaConfig;
  onRestart: () => void;
}

const FULL_SECRET_LETTER = `Aapki pyari jheel si aankhon se shuru hua yeh safar... aapki 5.4 ft ki masoom height, Mount Everest, hamara Hindustan, Prithvi, Suraj aur 93 arab light-years ke poore brahmand tak gaya.

Vigyan kehta hai ki is brahmand ki seema 93 arab saal hai... par unhe shayad andaza nahi ki jab aap muskurakar 'Suno na...' bolti hain, toh mere seene mein ek naya brahmand janam le leta hai.

Duniya bhar mein karodon aakashgangayein aur sitare honge, par mere liye meri poori kayanat sirf aap hain. Aapki har zid, aapke har gusse aur aapke har nakhre par yeh dil hamesha aise hi fida rahega!`;

export const CosmicHeartFinale: React.FC<CosmicHeartFinaleProps> = ({
  mediaConfig,
  onRestart,
}) => {
  const [isHeartbeatPumping, setIsHeartbeatPumping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Trigger celebratory love confetti explosion on reaching final Cosmic Heart stage
  useEffect(() => {
    triggerLoveConfettiExplosion();
  }, []);

  // Typewriter effect for Secret Letter
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 2;
      if (index >= FULL_SECRET_LETTER.length) {
        setDisplayedText(FULL_SECRET_LETTER);
        setIsTypingComplete(true);
        clearInterval(interval);
      } else {
        setDisplayedText(FULL_SECRET_LETTER.slice(0, index));
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const triggerHeartbeatBurst = () => {
    setIsHeartbeatPumping(true);
    cosmicAudio.playHeartbeat(84, 1.4);
    cosmicAudio.playCosmicChime();
    triggerLoveConfettiExplosion();
    setTimeout(() => {
      setIsHeartbeatPumping(false);
    }, 1200);
  };

  const handleSkipTyping = () => {
    setDisplayedText(FULL_SECRET_LETTER);
    setIsTypingComplete(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 text-center px-2">
      {/* Grand Emotional Climax Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-950/90 backdrop-blur-2xl border border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(244,63,94,0.35)] relative overflow-hidden"
      >
        {/* Animated Top Love Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 animate-pulse" />

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-rose-300 uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>The Greatest Realm in Existence</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        </div>

        {/* Grand Headline in Luxury Cormorant Font */}
        <h2 className="text-2xl sm:text-3xl font-bold font-serif-cormorant text-white mb-2">
          Mera Dil ❤️
        </h2>

        {/* The Exact Romantic Climax Message Requested */}
        <div className="my-4 p-5 sm:p-6 bg-rose-950/30 border border-rose-500/35 rounded-2xl relative shadow-inner">
          <p className="text-base sm:text-lg text-rose-100 font-serif-cormorant italic leading-relaxed whitespace-pre-wrap">
            "Poore 93 Arab Light-Years ke brahmand se bhi karodon guna bada mera dil hai...
            Aur yeh dil sirf aur sirf meri jaanu Jaggu ke liye kaam karta hai.
            Itna bada vishal dil hai, par wahan raj sirf aur sirf ek hi ladki karti hai—meri Jaggu ❤️"
          </p>
        </div>

        {/* Secret Love Letter with Typewriter Effect */}
        <div className="my-5 p-5 sm:p-6 bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-slate-950/60 border border-rose-400/40 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.25)] text-left relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300 border-b border-rose-500/20 pb-3 mb-4">
            <span className="tracking-widest uppercase font-semibold">Priya Jagriti Ji,</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-pink-300/80">✨ Ta-Umar Ke Liye ✨</span>
              {!isTypingComplete && (
                <button
                  onClick={handleSkipTyping}
                  className="text-[10px] text-rose-400 hover:text-white underline"
                >
                  (Skip)
                </button>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-rose-100 font-serif-cormorant italic leading-relaxed whitespace-pre-wrap min-h-[140px]">
            "{displayedText}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-rose-400 ml-1 animate-pulse align-middle" />
            )}
            "
          </p>

          <div className="mt-4 pt-3 border-t border-rose-500/20 flex justify-end">
            <span className="text-sm sm:text-base font-handwriting text-rose-300 font-semibold tracking-wide">
              ~ Hamesha sirf aapka Somnath ❤️
            </span>
          </div>
        </div>

        {/* Interactive Feel Dhadkan & Confetti Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
          <button
            onClick={triggerHeartbeatBurst}
            className={`px-6 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              isHeartbeatPumping
                ? 'bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.9)] scale-105'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950 border border-rose-400/50'
            }`}
          >
            <Heart
              className={`w-4 h-4 fill-white ${
                isHeartbeatPumping ? 'animate-ping' : ''
              }`}
            />
            <span>Dhadkan Mehsoos Karo (Feel Pulse & Hearts 💖)</span>
          </button>

          <button
            onClick={triggerLoveConfettiExplosion}
            className="px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-cosmic" />
            <span>Love Confetti 🌟</span>
          </button>
        </div>

        {/* Restart Action */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dobara Safar Shuru Karein</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
