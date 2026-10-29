import { getSession, logout } from '../lib/accounts';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfileCard } from '../components/ProfileCard';
import {
  User,
  Edit3,
  Trash2,
  RefreshCw,
  Sparkles,
  Award,
  Zap,
  Flame,
  Shield,
  Heart
} from 'lucide-react';

export const ProfileDetail: React.FC = () => {
  const { currentProfile, setActiveTab, resetDemoCharacter, deleteCurrentProfile, matches, likedProfileIds } = useApp();

  if (!currentProfile) {
    return (
      <div className="min-h-screen paw-pattern-bg py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-md mx-auto border border-pink-200 shadow-xl">
          <p className="text-3xl mb-3">🐾</p>
          <h3 className="text-xl font-black text-purple-950 mb-2">No Active Pet Character</h3>
          <p className="text-xs text-purple-700/80 mb-6">
            You haven't initialized your animal profile yet.
          </p>
          <button
            onClick={() => setActiveTab('create-profile')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm"
          >
            Create Pet Profile
          </button>
        </div>
      </div>
    );
  }

  // Calculate absurd pet statistics
  const zoomiesCount = (currentProfile.age || 2) * 482;
  const snackNegotiations = (currentProfile.age || 2) * 128;
  const dramaIndex = Math.min(99, 75 + (likedProfileIds.length * 3));

  return (
    <div className="min-h-screen paw-pattern-bg py-8 px-4 sm:px-6 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 p-5 text-white shadow-xl flex items-center gap-4">
          <img src={currentProfile.avatarUrl} alt="" className="w-16 h-16 rounded-full ring-4 ring-white/70 object-cover bg-white/20" />
          <div>
            <div className="text-[11px] uppercase font-bold opacity-80">Logged in as @{getSession()}</div>
            <div className="text-xl font-black">{currentProfile.displayName}</div>
            <div className="text-xs opacity-90">{currentProfile.species} · {matches.length} matches · all doomed</div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-0.5 rounded-full text-xs font-bold mb-1 border border-pink-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pet Identity Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950">
              {currentProfile.displayName}'s Passport
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/80 font-medium">
              Your registered persona in the RUFF LUCK animal social network.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create-profile')}
              className="px-4 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => logout()}
              className="px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold flex items-center gap-1.5 border border-pink-200 transition-colors cursor-pointer"
              title="Log out"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-center">
            <div className="text-2xl font-black text-pink-600 mb-0.5">{matches.length}</div>
            <div className="text-[11px] font-bold text-purple-900 uppercase">Romantic Matches</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-center">
            <div className="text-2xl font-black text-purple-600 mb-0.5">{zoomiesCount}</div>
            <div className="text-[11px] font-bold text-purple-900 uppercase">Zoomies Logged</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-center">
            <div className="text-2xl font-black text-rose-500 mb-0.5">{dramaIndex}%</div>
            <div className="text-[11px] font-bold text-purple-900 uppercase">Drama Rating</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-center">
            <div className="text-2xl font-black text-amber-500 mb-0.5">{snackNegotiations}</div>
            <div className="text-[11px] font-bold text-purple-900 uppercase">Treats Extorted</div>
          </div>
        </div>

        {/* Profile Card Centerpiece */}
        <div className="max-w-md mx-auto">
          <ProfileCard profile={currentProfile} showActions={false} />
        </div>

        {/* Danger Zone: Clear / Delete Profile */}
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-md max-w-xl mx-auto text-left">
          <h4 className="font-extrabold text-sm text-rose-900 flex items-center gap-1.5 mb-1">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Retire Animal Character</span>
          </h4>
          <p className="text-xs text-purple-800/80 mb-4 leading-relaxed">
            Need to leave town or enter witness protection? This clears your current animal persona and all associated local chat history.
          </p>
          <button
            onClick={deleteCurrentProfile}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Permanently Delete {currentProfile.displayName}
          </button>
        </div>
      </div>
    </div>
  );
};
