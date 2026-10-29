import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DramaEvent } from '../types';
import {
  Zap,
  Flame,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  Share2,
  Plus,
  Send,
  Eye,
  Siren
} from 'lucide-react';

export const DramaFeed: React.FC = () => {
  const { dramaEvents, reactToDrama } = useApp();
  const [showSubmitScoop, setShowSubmitScoop] = useState(false);
  const [scoopHeadline, setScoopHeadline] = useState('');
  const [scoopDescription, setScoopDescription] = useState('');
  const [scoopTag, setScoopTag] = useState<DramaEvent['tag']>('Gossip');

  const handleAddScoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoopHeadline.trim()) return;

    const newDrama: DramaEvent = {
      id: `scoop-${Date.now()}`,
      headline: scoopHeadline.trim(),
      description: scoopDescription.trim() || 'Anonymous informant provided verified neighborhood scent logs.',
      tag: scoopTag,
      timestamp: Date.now(),
      reactionsCount: 1,
      userReacted: true,
      participants: ['Anonymous Whistleblower']
    };

    dramaEvents.unshift(newDrama);
    setScoopHeadline('');
    setScoopDescription('');
    setShowSubmitScoop(false);
  };

  const getTagColor = (tag: DramaEvent['tag']) => {
    switch (tag) {
      case 'Breaking':
        return 'bg-rose-500 text-white';
      case 'Scandal':
        return 'bg-purple-900 text-pink-200';
      case 'Petty Court':
        return 'bg-amber-500 text-purple-950';
      case 'Love Alert':
        return 'bg-pink-500 text-white';
      default:
        return 'bg-purple-600 text-white';
    }
  };

  return (
    <div className="min-h-screen paw-pattern-bg py-6 px-4 sm:px-6 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Submit Scoop Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 px-3 py-0.5 rounded-full text-xs font-black mb-1 border border-rose-200">
              <Siren className="w-3.5 h-3.5 animate-pulse" />
              <span>THE FUR TABLOID</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-purple-950 flex items-center gap-2">
              <Zap className="w-8 h-8 text-pink-500 fill-pink-500" />
              Pet Relationship Drama
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/80 font-medium">
              Hot rumors, paw court trials, and unfiltered dating scandals from around the dog park.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitScoop(!showSubmitScoop)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Spill Anonymous Tea 🫖</span>
          </button>
        </div>

        {/* Submit Scoop Drawer */}
        {showSubmitScoop && (
          <div className="bg-white rounded-3xl p-6 border-2 border-pink-400 shadow-2xl animate-scaleUp text-left">
            <h3 className="text-lg font-black text-purple-950 mb-1 flex items-center gap-2">
              <span>🫖 Spill Neighborhood Gossip</span>
            </h3>
            <p className="text-xs text-purple-700/80 mb-4">
              Submit an anonymous drama event. All pet whistleblowers are protected by the Feline Privacy Treaty of 2024.
            </p>

            <form onSubmit={handleAddScoop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bella the Beagle caught sniffing rival squirrel stash"
                  value={scoopHeadline}
                  onChange={(e) => setScoopHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-sm font-medium focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Scandalous Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide scent details, witnesses, or emotional distress levels..."
                  value={scoopDescription}
                  onChange={(e) => setScoopDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-xs sm:text-sm font-medium focus:outline-pink-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-purple-900">Tag:</span>
                  {(['Breaking', 'Gossip', 'Scandal', 'Love Alert', 'Petty Court'] as DramaEvent['tag'][]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setScoopTag(t)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        scoopTag === t ? 'bg-pink-600 text-white' : 'bg-pink-50 text-purple-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitScoop(false)}
                    className="px-3 py-2 rounded-xl text-purple-600 text-xs font-bold hover:bg-purple-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black shadow-md cursor-pointer"
                  >
                    Publish Scandal
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Drama Cards List */}
        <div className="space-y-4">
          {dramaEvents.length === 0 && (
            <div className="text-center py-16 text-sm text-white/50">No drama yet. Like someone and the gossip starts.</div>
          )}
          {dramaEvents.map((drama) => {
            const dateObj = new Date(drama.timestamp);
            const timeAgoMinutes = Math.max(1, Math.round((Date.now() - drama.timestamp) / 60000));
            const timeAgoStr = timeAgoMinutes < 60 ? `${timeAgoMinutes}m ago` : `${Math.round(timeAgoMinutes / 60)}h ago`;

            return (
              <div
                key={drama.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/90 shadow-xl shadow-purple-900/5 hover:border-pink-300 transition-all text-left relative overflow-hidden"
              >
                {/* Colored Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400" />

                <div className="flex items-start justify-between gap-3 mb-2 pt-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider ${getTagColor(
                      drama.tag
                    )}`}
                  >
                    {drama.tag}
                  </span>
                  <span className="text-[11px] text-purple-400 font-semibold">{timeAgoStr}</span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-purple-950 mt-1 leading-snug">
                  {drama.headline}
                </h3>

                <p className="text-xs sm:text-sm text-purple-800/80 leading-relaxed mt-2 font-medium">
                  {drama.description}
                </p>

                {/* Footer Reactions */}
                <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reactToDrama(drama.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        drama.userReacted
                          ? 'bg-pink-500 text-white shadow-xs scale-105'
                          : 'bg-pink-50 text-purple-900 hover:bg-pink-100 border border-pink-200'
                      }`}
                    >
                      <span>🫖</span>
                      <span>{drama.reactionsCount} Gasps & Sips</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                    99% Chaos Rating 🔥
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
