import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { ScaleItem, QuizOption } from '../types';
import { cosmicAudio } from '../utils/audio';

interface QuizCardProps {
  scale: ScaleItem;
  isAnswered: boolean;
  onCorrectAnswer: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  scale,
  isAnswered,
  onCorrectAnswer,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWrongShake, setIsWrongShake] = useState(false);

  const handleSelect = (option: QuizOption) => {
    setSelectedOptionId(option.id);
    setFeedback(option.romanticFeedback);

    if (option.isCorrect) {
      cosmicAudio.playCosmicChime();
      cosmicAudio.playHeartbeat(82, 1.3);
      onCorrectAnswer();
    } else {
      setIsWrongShake(true);
      setTimeout(() => setIsWrongShake(false), 500);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-950/85 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-500"
        style={{
          boxShadow: isAnswered
            ? `0 0 40px ${scale.themeColor.bgGlow}`
            : '0 20px 45px rgba(0,0,0,0.7)',
          borderColor: isAnswered ? `${scale.themeColor.accent}70` : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: scale.themeColor.accent }}
        />

        {/* Header Kicker */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Dil Ka Sawal #{scale.order + 1}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isAnswered ? '✨ Revealed!' : 'Guess Karo!'}
          </span>
        </div>

        {/* Question Title in Luxury Cormorant Serif */}
        <h3 className="text-lg sm:text-2xl font-serif-cormorant font-semibold text-white mb-1.5 leading-snug">
          "{scale.quizQuestion}"
        </h3>

        {scale.quizHint && !isAnswered && (
          <p className="text-xs text-rose-300/80 italic mb-4 font-serif-cormorant">
            Ishara: {scale.quizHint}
          </p>
        )}

        {/* Unique Choice Cards Grid */}
        <div className={`space-y-2.5 mt-3 ${isWrongShake ? 'animate-bounce' : ''}`}>
          {scale.quizOptions.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const showCorrect = isAnswered && opt.isCorrect;

            return (
              <motion.button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm text-left transition-all flex items-center justify-between border relative overflow-hidden group ${
                  showCorrect
                    ? 'bg-rose-950/40 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] ring-1 ring-rose-400/50'
                    : isSelected && !opt.isCorrect
                    ? 'bg-amber-950/40 border-amber-600/70 text-amber-200'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      showCorrect
                        ? 'bg-rose-500 text-white shadow-sm'
                        : isSelected && !opt.isCorrect
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {showCorrect ? <Check className="w-3.5 h-3.5" /> : opt.id.replace('opt', '')}
                  </div>
                  <span className="font-medium text-slate-100">{opt.text}</span>
                </div>

                {showCorrect && (
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-500 shrink-0 animate-pulse" />
                )}
                {isSelected && !opt.isCorrect && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Reaction Feedback Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-3 p-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                isAnswered
                  ? 'bg-rose-950/50 border border-rose-500/50 text-rose-200 shadow-sm'
                  : 'bg-amber-950/50 border border-amber-600/50 text-amber-200'
              }`}
            >
              <span>{isAnswered ? '💖' : '💡'}</span>
              <span>{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Romantic Commentary in Luxury Cormorant Font */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 pt-4 border-t border-slate-800/80 space-y-2"
          >
            <p className="text-sm sm:text-base text-rose-100 font-serif-cormorant italic leading-relaxed">
              "{scale.romanticNote}"
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-1">
              📍 Scientific Fact: {scale.comparisonFact}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
