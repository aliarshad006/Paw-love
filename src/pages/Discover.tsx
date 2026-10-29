import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Species, AnimalProfile } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { getSpeciesEmoji } from '../data/petAvatars';
import {
  Flame,
  Filter,
  RotateCcw,
  Sparkles,
  Heart,
  X,
  UserPlus,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

export const Discover: React.FC = () => {
  const {
    allProfiles,
    currentProfile,
    likedProfileIds,
    passedProfileIds,
    setPassedProfileIds,
    likeProfile,
    passProfile,
    sendFriendRequest,
    setActiveTab
  } = useApp();

  const [selectedSpecies, setSelectedSpecies] = useState<Species | 'All'>('All');
  const [selectedTraitFilter, setSelectedTraitFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const swipeStartX = useRef<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Filter out self, and already swiped profiles
  const discoverableProfiles = useMemo(() => {
    return allProfiles.filter((p) => {
      // Don't show yourself
      if (currentProfile && p.id === currentProfile.id) return false;
      // Filter out already liked or passed
      if (likedProfileIds.includes(p.id) || passedProfileIds.includes(p.id)) return false;

      // Filter by species if selected
      if (selectedSpecies !== 'All' && p.species !== selectedSpecies) return false;
      if (searchQuery.trim()) {
        const term = searchQuery.trim().toLowerCase();
        if (![p.displayName, p.species, p.breed, p.location].filter(Boolean).join(' ').toLowerCase().includes(term)) return false;
      }

      // Filter by trait if selected
      if (
        selectedTraitFilter !== 'All' &&
        !p.personalityTraits.includes(selectedTraitFilter) &&
        !p.interests.includes(selectedTraitFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [allProfiles, currentProfile, likedProfileIds, passedProfileIds, selectedSpecies, selectedTraitFilter, searchQuery]);

  const currentPet = discoverableProfiles[0] || null;

  useEffect(() => {
    if (!currentPet && !searchQuery.trim() && selectedSpecies === 'All' && selectedTraitFilter === 'All' && passedProfileIds.length > 0) {
      setTimeout(() => setPassedProfileIds([]), 0);
    }
  }, [currentPet, searchQuery, selectedSpecies, selectedTraitFilter, passedProfileIds.length, setPassedProfileIds]);

  // Keyboard navigation for power users (Left arrow = pass, Right arrow = like)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPet) return;
      if (e.key === 'ArrowLeft') {
        passProfile(currentPet.id);
      } else if (e.key === 'ArrowRight') {
        likeProfile(currentPet);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPet, likeProfile, passProfile]);

  // Get unique species present in the kingdom
  const kingdomSpeciesList = useMemo(() => {
    const set = new Set<string>();
    allProfiles.forEach((p) => {
      if (p.species) set.add(p.species);
    });
    return ['All', ...Array.from(set)];
  }, [allProfiles]);

  return (
    <div className="min-h-screen paw-pattern-bg py-6 px-4 sm:px-6 pb-24 md:pb-12">
      <div className="max-w-xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-purple-950 flex items-center gap-2">
                <Flame className="w-6 h-6 text-pink-500 fill-pink-500" />
                Discover
              </h2>
              <p className="text-xs text-purple-800/80 font-medium">
                Like, pass or send a friend request.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-pink-600 bg-pink-100/80 px-2.5 py-1 rounded-full border border-pink-200">
                {discoverableProfiles.length} animals
              </span>
            </div>
          </div>

          {/* Dynamic Species Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
            {kingdomSpeciesList.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecies(s)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  selectedSpecies === s
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white/80 text-purple-800 hover:bg-pink-100 border border-pink-200/60'
                }`}
              >
                <span>{s === 'All' ? '🐾' : getSpeciesEmoji(s)}</span>
                <span>{s === 'All' ? 'All Animals' : s}</span>
              </button>
            ))}
          </div>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search animals by name, type, breed, or location" className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm text-purple-950" />
        </div>

        {/* Card Deck Area */}
        {currentPet ? (
          <div className="relative" onTouchStart={(event) => { swipeStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
            const startX = swipeStartX.current;
            const endX = event.changedTouches[0]?.clientX;
            swipeStartX.current = null;
            if (startX === null || endX === undefined || Math.abs(endX - startX) < 60) return;
            if (endX < startX) passProfile(currentPet.id);
            else void sendFriendRequest(currentPet);
          }}>
            <ProfileCard
              profile={currentPet}
              onLike={() => sendFriendRequest(currentPet)}
              onPass={() => passProfile(currentPet.id)}
              onFriendRequest={() => sendFriendRequest(currentPet)}
            />

            {/* Keyboard shortcut hint */}
            <div className="hidden sm:flex items-center justify-center gap-6 mt-4 text-[11px] font-bold text-purple-700/60">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-pink-200 rounded text-[10px]">←</kbd> Pass
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-pink-200 rounded text-[10px]">→</kbd> Send request
              </span>
            </div>
          </div>
        ) : (
          /* Empty Deck State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-200 shadow-xl max-w-md mx-auto my-6">
            <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
              🎾
            </div>
            <h3 className="text-2xl font-black text-purple-950 mb-2">
              Refreshing the animal lineup
            </h3>
            <p className="text-xs sm:text-sm text-purple-800/80 leading-relaxed mb-6 font-medium">
              The lineup refreshes automatically. You can also search by name or check your matches.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('matches')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                View My Matches & Friend Requests
              </button>

              <button
                onClick={() => {
                  setSelectedSpecies('All');
                  setSelectedTraitFilter('All');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold hover:bg-purple-100 border border-purple-200 cursor-pointer"
              >
                Clear Species Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
