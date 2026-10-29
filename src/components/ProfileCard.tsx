import React, { useState } from 'react';
import { AnimalProfile } from '../types';
import { Heart, X, UserPlus, ChevronDown, ChevronUp, Utensils } from 'lucide-react';
import { getSpeciesEmoji } from '../data/petAvatars';
import { useApp } from '../context/AppContext';
import { generateReport } from '../lib/compat';

interface ProfileCardProps {
  profile: AnimalProfile;
  onLike?: () => void;
  onPass?: () => void;
  onFriendRequest?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike, onPass, onFriendRequest, showActions = true, compact = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { currentProfile } = useApp();
  const doom = currentProfile && currentProfile.id !== profile.id ? generateReport(currentProfile, profile) : null;
  const photos = [profile.photoUrl || profile.avatarUrl, ...(profile.photoUrls || [])];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/60 ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
        <img src={photos[photoIndex % photos.length]} alt={profile.displayName} className="absolute inset-0 w-full h-full object-cover" />
        {photos.length > 1 && <button type="button" onClick={() => setPhotoIndex((index) => (index + 1) % photos.length)} className="absolute right-3 top-16 z-10 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white">Photo {photoIndex + 1}/{photos.length}</button>}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
          {doom ? (
            <span className="bg-black/55 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/15">💔 {doom.score}% match</span>
          ) : <span />}
          <span className="bg-black/55 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/15">
            {getSpeciesEmoji(profile.species)} {profile.species}{profile.breed ? ` · ${profile.breed}` : ''}
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5 text-white">
          <h3 className="text-2xl font-extrabold leading-tight">{profile.displayName}, {profile.age}</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {profile.relationshipStatus}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(profile.personalityTraits || []).slice(0, 3).map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur border border-white/20">{t}</span>
            ))}
          </div>
          {profile.bio && <p className="text-xs text-white/75 mt-3 line-clamp-2">{profile.bio}</p>}
        </div>
      </div>

      {showActions && (
        <div className="relative z-10 -mt-8 flex items-center justify-center gap-5">
          <button onClick={onPass} aria-label="Pass" className="w-14 h-14 rounded-full bg-[#15151c] border-2 border-rose-500/70 text-rose-500 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105">
            <X className="w-7 h-7" />
          </button>
          <button onClick={onFriendRequest} aria-label="Friend request" className="w-12 h-12 rounded-full bg-[#15151c] border-2 border-violet-500/70 text-violet-400 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105">
            <UserPlus className="w-5 h-5" />
          </button>
          <button onClick={onLike} aria-label="Like" className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 text-white flex items-center justify-center shadow-xl shadow-orange-600/40 cursor-pointer hover:scale-105">
            <Heart className="w-8 h-8 fill-white" />
          </button>
        </div>
      )}

      <button onClick={() => setExpanded(!expanded)} className="mx-auto mt-3 flex items-center gap-1 text-xs font-bold text-white/60 cursor-pointer">
        {expanded ? <>Less <ChevronUp className="w-3.5 h-3.5" /></> : <>More about {profile.displayName} <ChevronDown className="w-3.5 h-3.5" /></>}
      </button>

      {expanded && (
        <div className="mt-2 rounded-2xl bg-[#15151c] border border-white/10 p-4 text-sm text-white/80 space-y-3">
          {profile.bio && <p>{profile.bio}</p>}
          <div className="flex items-center gap-2 text-xs"><Utensils className="w-4 h-4 text-orange-400" /> Loves: {profile.favouriteFood}</div>
          <div className="flex flex-wrap gap-1.5">
            {(profile.interests || []).map((i) => <span key={i} className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 border border-white/10">{i}</span>)}
          </div>
          {doom && <div className="text-xs text-rose-300">Expected to last {doom.lastsFor}. {doom.reasons[0]}</div>}
        </div>
      )}
    </div>
  );
};
