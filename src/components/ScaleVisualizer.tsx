import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScaleItem, UserMediaConfig } from '../types';
import { Sparkles, Heart, ZoomIn, Eye } from 'lucide-react';

interface ScaleVisualizerProps {
  scale: ScaleItem;
  mediaConfig: UserMediaConfig;
  isRevealed?: boolean;
  onHeartClick?: () => void;
}

export const ScaleVisualizer: React.FC<ScaleVisualizerProps> = ({
  scale,
  mediaConfig,
  isRevealed = true,
  onHeartClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Determine current active image URL (support custom Catbox links)
  let activeImageUrl = scale.imageUrl;
  if (scale.type === 'eyes' && mediaConfig.eyesImageUrl) {
    activeImageUrl = mediaConfig.eyesImageUrl;
  } else if (scale.type === 'human' && mediaConfig.bodyImageUrl) {
    activeImageUrl = mediaConfig.bodyImageUrl;
  } else if (scale.type === 'heart' && mediaConfig.handHeartImageUrl) {
    activeImageUrl = mediaConfig.handHeartImageUrl;
  }

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Heart Pulse Dynamic Glow (Music Reactive Glow) */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-45 transition-all duration-1000 pointer-events-none animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${scale.themeColor.accent} 0%, ${scale.themeColor.glow} 45%, transparent 75%)`,
        }}
      />
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-30 pointer-events-none animate-heartbeat-active"
        style={{
          background: `radial-gradient(circle, ${scale.themeColor.accent} 0%, transparent 60%)`,
        }}
      />

      {/* Main Visual Frame with Cosmic Camera Warp Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${scale.id}-${activeImageUrl}`}
          initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.25, filter: 'blur(10px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] sm:aspect-square max-h-[360px] rounded-3xl overflow-hidden border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group bg-slate-950/85 backdrop-blur-md flex items-center justify-center"
          style={{
            borderColor: `${scale.themeColor.accent}45`,
            boxShadow: `0 0 40px ${scale.themeColor.bgGlow}`,
          }}
          onClick={scale.type === 'heart' ? onHeartClick : undefined}
        >
          {/* Real Photo with Zero-Broken-Image Fallback & Full Height Containment for 2nd Pic */}
          {!imageError ? (
            <img
              src={activeImageUrl}
              alt={scale.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className={`w-full h-full transition-all duration-700 group-hover:scale-105 ${
                scale.type === 'human'
                  ? 'object-contain p-2 max-h-[350px]'
                  : 'object-cover'
              } ${
                !isRevealed
                  ? 'filter blur-[13px] scale-110 opacity-60'
                  : 'filter blur-0 scale-100 opacity-100'
              }`}
            />
          ) : (
            <CosmicFallbackIllustration scale={scale} mediaConfig={mediaConfig} />
          )}

          {/* Mysterious Quiz Veil when not yet answered */}
          {!isRevealed && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
              <Sparkles className="w-8 h-8 text-rose-400 animate-spin-cosmic mb-2" />
              <p className="text-xs sm:text-sm font-semibold font-serif-luxury text-rose-200">
                Pehle Niche Sawal Ka Jawab Do! ✨
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                Sahi guess karte hi photo reveal hogi
              </p>
            </div>
          )}

          {/* Vignette & cinematic contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Subtle Corner Info Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-slate-200">
            {isRevealed ? (
              <>
                {scale.type === 'eyes' && <Eye className="w-3.5 h-3.5 text-rose-400" />}
                {scale.type === 'heart' && <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />}
                {scale.type !== 'eyes' && scale.type !== 'heart' && (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scale.themeColor.accent }} />
                )}
                <span>{scale.displaySize}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Mystery #{scale.order + 1} 🔮</span>
              </>
            )}
          </div>

          {/* Scale Step Tag */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono text-slate-300">
            {scale.order + 1}/12
          </div>

          {/* Tap Prompt on Heart Stage */}
          {scale.type === 'heart' && (
            <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-semibold shadow-lg shadow-rose-950 animate-pulse">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Tap Karo Dhadkan Sunne Ke Liye ❤️</span>
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* Resilient SVG Illustration fallback when image is loading or blocked */
const CosmicFallbackIllustration: React.FC<{
  scale: ScaleItem;
  mediaConfig: UserMediaConfig;
}> = ({ scale }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
      {scale.type === 'eyes' && (
        <div className="relative">
          <Eye className="w-20 h-20 text-rose-400 animate-pulse-slow" />
          <Sparkles className="w-6 h-6 text-pink-300 absolute -top-1 -right-2" />
        </div>
      )}
      {scale.type === 'heart' && (
        <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heartbeat-active" />
      )}
      {scale.type !== 'eyes' && scale.type !== 'heart' && (
        <div
          className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
          style={{ borderColor: scale.themeColor.accent }}
        >
          <span className="text-2xl">
            {scale.type === 'human' && '💃'}
            {scale.type === 'landmark' && '🏔️'}
            {scale.type === 'country' && '🇮🇳'}
            {scale.type === 'planet' && '🌍'}
            {scale.type === 'star' && '☀️'}
            {scale.type === 'system' && '🪐'}
            {scale.type === 'giant-star' && '⭐'}
            {scale.type === 'galaxy' && '🌌'}
            {scale.type === 'supercluster' && '🕸️'}
            {scale.type === 'universe' && '🔮'}
          </span>
        </div>
      )}
      <p className="mt-3 text-xs font-mono text-slate-400">{scale.title}</p>
    </div>
  );
};
