import React from 'react';
import { useApp } from '../context/AppContext';
import { generateReport } from '../lib/compat';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';

export const MatchModal: React.FC = () => {
  const { latestMatchModal, closeMatchModal, currentProfile, startChatWithProfile } = useApp();

  if (!latestMatchModal || !currentProfile) return null;

  const { partner } = latestMatchModal;

  const report = generateReport(currentProfile, partner);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-pink-400 relative overflow-hidden transform animate-scaleUp">
        {/* Decorative background sparkles */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400" />
        <button
          onClick={closeMatchModal}
          className="absolute top-4 right-4 text-purple-400 hover:text-purple-800 p-1.5 rounded-full hover:bg-pink-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-3 animate-bounce">
          <Sparkles className="w-8 h-8 fill-pink-500 stroke-pink-600" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-800 uppercase tracking-tight">
          It's a Match! (Not for long)
        </h2>

        <p className="text-sm font-semibold text-purple-800 mt-1">
          You and <span className="text-pink-600 font-extrabold">{partner.displayName}</span> matched. Science disagrees.
        </p>

        {/* Side-by-side Avatars with Heart */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="relative">
            <img
              src={currentProfile.avatarUrl}
              alt={currentProfile.displayName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-300 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-1 bg-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border border-pink-200">
              {currentProfile.displayName.split(' ')[0]}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg animate-pulse-gentle">
            <Heart className="w-5 h-5 fill-white stroke-white" />
          </div>

          <div className="relative">
            <img
              src={partner.avatarUrl}
              alt={partner.displayName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-300 shadow-lg"
            />
            <span className="absolute -bottom-2 -left-1 bg-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md border border-purple-200">
              {partner.displayName.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Compatibility report + breakup certificate */}
        <div className="bg-pink-50 rounded-2xl p-3.5 border border-pink-200 text-xs text-purple-900 leading-relaxed font-medium mb-3 text-left">
          <div className="font-extrabold text-pink-900 mb-1">🐾 Compatibility: {report.score}% ({report.steps}-step analysis)</div>
          <ul className="list-disc list-inside space-y-1">
            {report.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
        <div className="border-2 border-dashed border-purple-400 rounded-2xl p-3 text-xs text-purple-900 mb-6 bg-amber-50">
          <div className="font-extrabold uppercase tracking-wide">📜 Official Breakup Certificate #{report.certNo}</div>
          <div className="mt-1">{report.verdict}</div>
          <div className="mt-1">Expected to last: <strong>{report.lastsFor}</strong></div>
          <div>Cause of split: <strong>{report.cause}</strong></div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              closeMatchModal();
              startChatWithProfile(partner);
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-extrabold text-base shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            Start Sniffing & Chat
          </button>

          <button
            onClick={closeMatchModal}
            className="w-full py-3 px-6 rounded-2xl bg-purple-50 text-purple-900 font-bold text-sm hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200/60"
          >
            Keep Sniffing Other Pets
          </button>
        </div>
      </div>
    </div>
  );
};
