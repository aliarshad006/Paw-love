import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalProfile } from '../types';
import {
  Heart,
  Users,
  MessageCircle,
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const MatchesAndFriends: React.FC = () => {
  const {
    matches,
    friendRequests,
    currentProfile,
    allProfiles,
    startChatWithProfile,
    respondToFriendRequest,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'friends'>('matches');

  // Pending and Accepted friend requests
  const pendingRequests = friendRequests.filter((r) => r.status === 'pending');
  const acceptedFriends = friendRequests.filter((r) => r.status === 'accepted');

  return (
    <div className="min-h-screen paw-pattern-bg py-6 px-4 sm:px-6 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              Matches & Pack
            </h2>
            <p className="text-xs sm:text-sm text-purple-800/80 font-medium">
              Pets who smelled mutual interest or joined your friend circle.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-pink-200 shadow-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('matches')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'matches'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                  : 'text-purple-700 hover:text-purple-950 hover:bg-pink-50'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Romantic Matches ({matches.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('friends')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'friends'
                  ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-xs'
                  : 'text-purple-700 hover:text-purple-950 hover:bg-pink-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Friend Paws ({acceptedFriends.length + pendingRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Content Section: Romantic Matches */}
        {activeSubTab === 'matches' && (
          <div>
            {matches.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-200 shadow-xl max-w-md mx-auto my-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-3xl mx-auto mb-3">
                  💔
                </div>
                <h3 className="text-xl font-black text-purple-950 mb-1">
                  No Mutual Matches Yet
                </h3>
                <p className="text-xs text-purple-800/80 leading-relaxed mb-6 font-medium">
                  Head back to Discover, sniff some pet profiles, and like your favorites. Matches happen when both pets like each other.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
                >
                  Go to Discover 🐾
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((m) => {
                  if (!currentProfile) return null;
                  const partnerId = m.profileIds.find((id) => id !== currentProfile.id);
                  const partner = allProfiles.find((p) => p.id === partnerId) || (Object.values(m.profiles) as any[]).find((p: any) => p.id !== currentProfile.id);
                  if (!partner) return null;

                  return (
                    <div
                      key={m.id}
                      className="bg-white rounded-3xl p-4 border border-pink-200/90 shadow-lg shadow-purple-900/5 hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-pink-100">
                          <img
                            src={partner.avatarUrl}
                            alt={partner.displayName}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                            🔥 Mutual Match
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <h4 className="font-extrabold text-base text-purple-950 truncate">
                            {partner.displayName}
                          </h4>
                          <span className="text-xs font-bold text-pink-600">
                            {partner.species}
                          </span>
                        </div>

                        <p className="text-xs text-purple-800/80 mt-1 line-clamp-2 font-medium">
                          "{partner.bio}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const full = allProfiles.find((p) => p.id === partner.id) || (partner as AnimalProfile);
                            startChatWithProfile(full);
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Content Section: Friend Paws & Pack Requests */}
        {activeSubTab === 'friends' && (
          <div className="space-y-6">
            {/* Pending Friend Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-md">
                <h3 className="text-base font-extrabold text-purple-950 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Pending Friend Paws ({pendingRequests.length})</span>
                </h3>

                <div className="divide-y divide-pink-100">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.toProfile.avatarUrl}
                          alt={req.toProfile.displayName}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-200"
                        />
                        <div>
                          <div className="text-sm font-extrabold text-purple-950">
                            {req.toProfile.displayName}
                          </div>
                          <div className="text-xs text-purple-600 font-medium">
                            {req.toProfile.species} • Status: Waiting for mutual sniff
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => respondToFriendRequest(req.id, true)}
                          className="p-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Accept Friend Paw"
                        >
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Accept</span>
                        </button>
                        <button
                          onClick={() => respondToFriendRequest(req.id, false)}
                          className="p-2 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold hover:bg-rose-100 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Friends */}
            <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-md">
              <h3 className="text-base font-extrabold text-purple-950 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Accepted Pack Members ({acceptedFriends.length})</span>
              </h3>

              {acceptedFriends.length === 0 ? (
                <div className="text-center py-8 text-purple-500 text-xs font-medium">
                  No friends added to the pack yet. Send a Friend Paw from Discover!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {acceptedFriends.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={req.toProfile.avatarUrl}
                          alt={req.toProfile.displayName}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-white"
                        />
                        <div>
                          <div className="text-xs font-black text-purple-950">
                            {req.toProfile.displayName}
                          </div>
                          <div className="text-[11px] text-purple-700 font-semibold">
                            {req.toProfile.species} • Pack Friend
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => startChatWithProfile(req.toProfile)}
                        className="p-2 rounded-xl bg-white text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-pink-600" />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
