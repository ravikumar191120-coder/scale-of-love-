import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Volume2,
  VolumeX,
  Link2,
  Sparkles,
  Music,
} from 'lucide-react';
import { COSMIC_SCALES } from './data/scales';
import { ScaleItem, UserMediaConfig } from './types';
import { CosmicBackground } from './components/CosmicBackground';
import { ScaleVisualizer } from './components/ScaleVisualizer';
import { NavigationControls } from './components/NavigationControls';
import { CosmicHeartFinale } from './components/CosmicHeartFinale';
import { QuizCard } from './components/QuizCard';
import { MediaConfigModal } from './components/MediaConfigModal';
import { cosmicAudio } from './utils/audio';
import { triggerLoveConfettiExplosion } from './utils/confetti';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [hasStartedExperience, setHasStartedExperience] = useState(false);
  const [answeredScales, setAnsweredScales] = useState<number[]>([]);

  // Default pre-filled media config with user's exact links & Jagriti's details
  const [mediaConfig, setMediaConfig] = useState<UserMediaConfig>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const eyes =
        params.get('eyes') ||
        localStorage.getItem('cfg_eyes') ||
        'https://files.catbox.moe/1ven8l.png';
      const body =
        params.get('body') ||
        localStorage.getItem('cfg_body') ||
        'https://files.catbox.moe/rlruwn.png';
      const heart =
        params.get('heart') ||
        localStorage.getItem('cfg_heart') ||
        'https://files.catbox.moe/ran737.png';
      const music =
        params.get('music') ||
        localStorage.getItem('cfg_music') ||
        'https://files.catbox.moe/c2bn7o.mp3';
      const name =
        params.get('name') || localStorage.getItem('cfg_name') || 'Jagriti';

      return {
        eyesImageUrl: eyes,
        bodyImageUrl: body,
        handHeartImageUrl: heart,
        musicAudioUrl: music,
        gfName: name,
        nicknames: ['Jaggu', 'Tolu'],
        gfHeightFt: '5.4',
      };
    }
    return {
      eyesImageUrl: 'https://files.catbox.moe/1ven8l.png',
      bodyImageUrl: 'https://files.catbox.moe/rlruwn.png',
      handHeartImageUrl: 'https://files.catbox.moe/ran737.png',
      musicAudioUrl: 'https://files.catbox.moe/c2bn7o.mp3',
      gfName: 'Jagriti',
      nicknames: ['Jaggu', 'Tolu'],
      gfHeightFt: '5.4',
    };
  });

  const currentScale: ScaleItem = COSMIC_SCALES[currentIndex];
  const isHeartStage = currentIndex === COSMIC_SCALES.length - 1;
  const isCurrentRevealed =
    answeredScales.includes(currentIndex) || isHeartStage;

  // Sync music URL with sound engine
  useEffect(() => {
    if (mediaConfig.musicAudioUrl) {
      cosmicAudio.setCustomMusicUrl(mediaConfig.musicAudioUrl);
    }
  }, [mediaConfig.musicAudioUrl]);

  // Audio reactivity & celebratory confetti on scale change
  useEffect(() => {
    if (hasStartedExperience && !isMuted) {
      if (isHeartStage) {
        cosmicAudio.playCosmicChime();
        cosmicAudio.startHeartbeatLoop(84, 1.3);
        triggerLoveConfettiExplosion();
      } else {
        cosmicAudio.stopHeartbeatLoop();
        cosmicAudio.playStepSound();
      }
    }
  }, [currentIndex, isHeartStage, hasStartedExperience, isMuted]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIndex((prev) => Math.min(COSMIC_SCALES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-tour timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= COSMIC_SCALES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Touch swipe gesture support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -50 && currentIndex < COSMIC_SCALES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (deltaX > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    touchStartX.current = null;
  };

  const handleStartExperience = () => {
    setHasStartedExperience(true);
    cosmicAudio.startMusic(mediaConfig.musicAudioUrl);
    setIsMuted(false);
  };

  const handleToggleSound = () => {
    if (!hasStartedExperience) {
      handleStartExperience();
      return;
    }
    const muted = cosmicAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectIndex = (idx: number) => {
    if (!hasStartedExperience) {
      handleStartExperience();
    }
    setCurrentIndex(idx);
  };

  const handleCorrectAnswer = () => {
    if (!answeredScales.includes(currentIndex)) {
      setAnsweredScales((prev) => [...prev, currentIndex]);
    }
  };

  const handleHeartClick = () => {
    cosmicAudio.playHeartbeat(86, 1.4);
    cosmicAudio.playCosmicChime();
    triggerLoveConfettiExplosion();
  };

  const handleSaveMediaConfig = (cfg: UserMediaConfig) => {
    setMediaConfig(cfg);
    try {
      localStorage.setItem('cfg_eyes', cfg.eyesImageUrl);
      localStorage.setItem('cfg_body', cfg.bodyImageUrl);
      localStorage.setItem('cfg_heart', cfg.handHeartImageUrl);
      localStorage.setItem('cfg_music', cfg.musicAudioUrl);
      localStorage.setItem('cfg_name', cfg.gfName);
    } catch {}
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-black text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-rose-500 selection:text-white"
    >
      {/* 3D Deep Space Canvas with Floating Love Particles */}
      <CosmicBackground
        currentOrder={currentIndex}
        isHeartStage={isHeartStage}
      />

      {/* Romantic Intro Invitation Modal / Tap to Begin with Music */}
      <AnimatePresence>
        {!hasStartedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-slate-900/90 border border-rose-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(244,63,94,0.35)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-400 to-indigo-500 animate-pulse" />

              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mb-4 text-rose-400 animate-pulse-slow">
                <Heart className="w-8 h-8 fill-rose-500" />
              </div>

              <div className="text-xs font-mono text-rose-300 uppercase tracking-widest mb-1">
                For: Jagriti ❤️
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif-cormorant text-white mb-3">
                Ek Romantic Quiz & Cosmic Voyage ✨
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-serif-cormorant text-base">
                Kya aapko pata hai is poori kayanat mein sabse pretty cheez kya
                hai? Aur sabse bada aakaar kiska hai?
                <br />
                <span className="text-rose-300 font-medium">
                  (Headphones ya speaker on rakhein ♫)
                </span>
              </p>

              <button
                onClick={handleStartExperience}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Music className="w-4 h-4 animate-bounce" />
                <span>Music Chalao & Shuru Karo ➜</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean, Intimate Header */}
      <header className="relative z-20 flex items-center justify-between px-5 py-3 border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-sm sm:text-base font-semibold tracking-wide text-white font-serif-cormorant">
            Jagriti ❤️
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle button */}
          <button
            onClick={handleToggleSound}
            className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all flex items-center gap-1.5 active:scale-95 ${
              !isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={isMuted ? 'Music Play Karein' : 'Mute Music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Music ON ♫</span>
              </>
            )}
          </button>

          {/* Discreet Media Link Icon */}
          <button
            onClick={() => setIsMediaModalOpen(true)}
            className="p-1.5 text-slate-400 hover:text-rose-300 bg-slate-900/70 border border-slate-800 rounded-full transition-colors"
            title="Catbox Pic / Audio Links Edit Karein"
          >
            <Link2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full px-4 py-3 sm:py-6 gap-3 sm:gap-4">
        {/* Scale Info Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400 font-mono">
            {isCurrentRevealed ? (
              <>
                <span>Cosmic Tier {currentIndex + 1}/12</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{currentScale.scientificUnit}</span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-400">Revealed ✨</span>
              </>
            ) : (
              <>
                <span>Cosmic Mystery {currentIndex + 1}/12</span>
                <span aria-hidden="true">·</span>
                <span className="text-rose-400 font-medium">Sawal Ka Jawab Do... 🔮</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif-cormorant transition-all duration-500">
            {isCurrentRevealed ? currentScale.title : currentScale.mysteryTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto font-serif-cormorant text-base italic">
            {isCurrentRevealed ? currentScale.tagline : currentScale.mysteryTagline}
          </p>
        </div>

        {/* Central Display: Image + Interactive Quiz Card */}
        <div className="w-full space-y-4">
          <ScaleVisualizer
            scale={currentScale}
            mediaConfig={mediaConfig}
            isRevealed={isCurrentRevealed}
            onHeartClick={handleHeartClick}
          />

          {isHeartStage ? (
            <CosmicHeartFinale
              mediaConfig={mediaConfig}
              onRestart={() => setCurrentIndex(0)}
            />
          ) : (
            <QuizCard
              key={currentScale.id}
              scale={currentScale}
              isAnswered={answeredScales.includes(currentIndex)}
              onCorrectAnswer={handleCorrectAnswer}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="relative z-20 pb-4 pt-1">
        <NavigationControls
          currentIndex={currentIndex}
          onSelectIndex={handleSelectIndex}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      </footer>

      {/* Media Config Modal */}
      <MediaConfigModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        config={mediaConfig}
        onSave={handleSaveMediaConfig}
      />
    </div>
  );
}
