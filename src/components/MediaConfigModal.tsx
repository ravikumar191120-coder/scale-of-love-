import React, { useState } from 'react';
import { X, Check, Link2, Music, Eye, Heart, Image as ImageIcon } from 'lucide-react';
import { UserMediaConfig } from '../types';

interface MediaConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserMediaConfig;
  onSave: (newConfig: UserMediaConfig) => void;
}

export const MediaConfigModal: React.FC<MediaConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [eyesUrl, setEyesUrl] = useState(config.eyesImageUrl);
  const [bodyUrl, setBodyUrl] = useState(config.bodyImageUrl);
  const [heartUrl, setHeartUrl] = useState(config.handHeartImageUrl);
  const [musicUrl, setMusicUrl] = useState(config.musicAudioUrl);
  const [gfName, setGfName] = useState(config.gfName);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      eyesImageUrl: eyesUrl.trim(),
      bodyImageUrl: bodyUrl.trim(),
      handHeartImageUrl: heartUrl.trim(),
      musicAudioUrl: musicUrl.trim(),
      gfName: gfName.trim() || 'Jagriti',
      nicknames: config.nicknames || ['Jaggu', 'Tolu'],
      gfHeightFt: '5.4',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-lg text-white">
              Catbox Links & Custom Media
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          Jab aapke paas catbox links ho, yahan paste kar dein. Page automatically
          unki real photo aur music play karega!
        </p>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Eyes Pic Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-rose-300 mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>1. USKI AANKHON KA PIC LINK (Catbox URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://files.catbox.moe/xxxxxx.jpg"
              value={eyesUrl}
              onChange={(e) => setEyesUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          {/* Full Body / Height Pic Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-rose-300 mb-1">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. USKE FULL BODY KA PIC LINK (Catbox URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://files.catbox.moe/xxxxxx.jpg"
              value={bodyUrl}
              onChange={(e) => setBodyUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          {/* Hand Made Heart Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-rose-300 mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>3. HAATH SE BANAYA HUA HEART (Catbox URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://files.catbox.moe/xxxxxx.jpg"
              value={heartUrl}
              onChange={(e) => setHeartUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          {/* Music Audio Catbox Link */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-mono text-rose-300 mb-1">
              <Music className="w-3.5 h-3.5" />
              <span>4. BACKGROUND MUSIC AUDIO LINK (Catbox .mp3 URL)</span>
            </label>
            <input
              type="url"
              placeholder="https://files.catbox.moe/xxxxxx.mp3"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          {/* Her Name */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              USKA NAAM (NICKNAME)
            </label>
            <input
              type="text"
              placeholder="Meri Jaan / Sneha / Priya"
              value={gfName}
              onChange={(e) => setGfName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
