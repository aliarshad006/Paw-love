import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  Camera,
  Image,
  Flame,
  Share2,
  Smile
} from 'lucide-react';

const DRAMA_TAGS = ['Spicy', 'Wholesome', 'Betrayal', 'Treat Theft', 'Zoomies', 'Nap Alert'] as const;

export const FriendCircle: React.FC = () => {
  const { currentProfile, posts, createPost, togglePostLike } = useApp();

  const [newPostContent, setNewPostContent] = useState('');
  const [selectedDramaTag, setSelectedDramaTag] = useState<typeof DRAMA_TAGS[number]>('Spicy');
  const [isPosting, setIsPosting] = useState(false);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    createPost(newPostContent.trim(), selectedDramaTag);
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="min-h-screen paw-pattern-bg py-6 px-4 sm:px-6 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 flex items-center justify-center sm:justify-start gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Friend Circle
          </h2>
          <p className="text-xs sm:text-sm text-purple-800/80 font-medium mt-1">
            The public pet plaza. Where animals share thoughts, zoomies logs, and complain about their humans.
          </p>
        </div>

        {/* Create Status Post Form */}
        {currentProfile && (
          <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-xl shadow-purple-900/5">
            <form onSubmit={handlePostSubmit} className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.displayName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-200"
                />
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`What is happening, ${currentProfile.displayName.split(' ')[0]}?`}
                    className="w-full p-3 rounded-2xl border border-pink-100 bg-pink-50/30 text-purple-950 text-xs sm:text-sm font-medium focus:outline-pink-500 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Tag selector & Submit */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-pink-50">
                <div className="flex items-center gap-1 overflow-x-auto text-xs">
                  <span className="text-[10px] font-black uppercase text-purple-400 mr-1">Vibe:</span>
                  {DRAMA_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedDramaTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        selectedDramaTag === tag
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-pink-50 text-purple-800 hover:bg-pink-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim() || isPosting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black shadow-md shadow-pink-500/20 hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Bark / Post</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-16 text-sm text-white/50">No posts yet. Be the first to post something.</div>
          )}
          {posts.map((post) => {
            const dateObj = new Date(post.timestamp);
            const timeAgoMinutes = Math.max(1, Math.round((Date.now() - post.timestamp) / 60000));
            const timeAgoStr = timeAgoMinutes < 60 ? `${timeAgoMinutes}m ago` : `${Math.round(timeAgoMinutes / 60)}h ago`;

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-md shadow-purple-900/5 hover:shadow-lg transition-all"
              >
                {/* Post Author Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-purple-950 text-sm sm:text-base leading-tight">
                          {post.authorName}
                        </h4>
                        <span className="text-xs">
                          {post.authorSpecies === 'Cat' && '🐱'}
                          {post.authorSpecies === 'Dog' && '🐶'}
                          {post.authorSpecies === 'Rabbit' && '🐰'}
                          {post.authorSpecies === 'Hamster' && '🐹'}
                          {post.authorSpecies === 'Bird' && '🦜'}
                          {post.authorSpecies === 'Other' && '🦫'}
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-500 font-semibold">
                        {post.authorSpecies} • {timeAgoStr}
                      </div>
                    </div>
                  </div>

                  {post.dramaTag && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-purple-200">
                      {post.dramaTag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-purple-950 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line my-3">
                  {post.content}
                </p>

                {/* Reaction Actions */}
                <div className="pt-3 border-t border-pink-50 flex items-center justify-between text-xs text-purple-700">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                      post.userLiked
                        ? 'bg-rose-50 text-rose-600 scale-105'
                        : 'hover:bg-pink-50 text-purple-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes} Paws</span>
                  </button>

                  <div className="flex items-center gap-1 text-purple-500 font-medium">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span>{post.commentsCount} Barks</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
