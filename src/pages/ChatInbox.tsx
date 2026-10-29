import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, AnimalProfile } from '../types';
import { STICKERS } from '../data/petAvatars';
import {
  MessageCircle,
  Trash2,
  Send,
  Smile,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Clock,
  HelpCircle,
  Flame,
  Info
} from 'lucide-react';

export const ChatInbox: React.FC = () => {
  const {
    currentProfile,
    allProfiles,
    matches,
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeChatPartner,
    chatMessages,
    sendMessage,
    deleteChat,
    startChatWithProfile,
    firebaseStatus
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showTwoUserGuide, setShowTwoUserGuide] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (e?: React.FormEvent, stickerValue?: string) => {
    if (e) e.preventDefault();
    const textToSend = stickerValue ? `Sent a sticker: ${stickerValue}` : inputMessage.trim();
    if (!textToSend && !stickerValue) return;

    try {
      setIsSending(true);
      await sendMessage(textToSend, stickerValue);
      setInputMessage('');
      setShowStickerPicker(false);
    } catch (err) {
      console.warn("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Compile list of available conversations (matches + active conversations)
  const availablePartners: AnimalProfile[] = React.useMemo(() => {
    if (!currentProfile) return [];
    const list: AnimalProfile[] = [];

    matches.forEach((m) => {
      const partnerId = m.profileIds.find((id) => id !== currentProfile.id);
      const profile = allProfiles.find((p) => p.id === partnerId);
      if (profile && !list.some((p) => p.id === profile.id)) {
        list.push(profile);
      }
    });

    conversations.forEach((conversation) => {
      const partnerId = conversation.participantIds.find((id) => id !== currentProfile.id);
      const profile = allProfiles.find((item) => item.id === partnerId) ||
        (partnerId ? conversation.participants[partnerId] : undefined);
      if (profile && !list.some((item) => item.id === profile.id)) {
        list.push(profile as AnimalProfile);
      }
    });

    // Also include active partner if not already listed
    if (activeChatPartner && !list.some((p) => p.id === activeChatPartner.id)) {
      list.push(activeChatPartner);
    }

    return list;
  }, [matches, conversations, allProfiles, currentProfile, activeChatPartner]);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] paw-pattern-bg p-0 sm:p-4 pb-20 md:pb-4">
      <div className="w-full max-w-7xl mx-auto bg-white sm:rounded-3xl border-y sm:border border-pink-200/90 shadow-2xl overflow-hidden min-h-[calc(100dvh-7.5rem)] sm:min-h-[calc(100dvh-8rem)] flex flex-col md:flex-row">
        {/* Left Column: Conversations / Matches List */}
        <div
          className={`w-full md:w-80 border-r border-pink-100 flex flex-col bg-pink-50/30 ${
            activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <h3 className="font-extrabold text-purple-950 text-base">Animal Chat Inbox</h3>
            </div>
            <button
              onClick={() => setShowTwoUserGuide(!showTwoUserGuide)}
              className="text-[11px] font-bold text-pink-600 hover:text-pink-800 bg-pink-50 px-2 py-1 rounded-lg border border-pink-200 flex items-center gap-1 cursor-pointer"
              title="Learn how to test real-time chat with 2 users"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>2-User Test</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-pink-50">
            {availablePartners.length === 0 ? (
              <div className="p-8 text-center text-purple-400 text-xs">
                <p className="mb-2 text-2xl">🐾</p>
                <p className="font-bold text-purple-800 mb-1">No chats active yet</p>
                <p className="leading-relaxed">
                  Go to Discover, like some animals to make mutual matches, then start chatting here!
                </p>
              </div>
            ) : (
              availablePartners.map((partner) => {
                const isSelected = activeChatPartner?.id === partner.id;
                return (
                  <button
                    key={partner.id}
                    onClick={() => startChatWithProfile(partner)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-pink-100/70 border-l-4 border-pink-500'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={partner.avatarUrl}
                        alt={partner.displayName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-extrabold text-sm text-purple-950 truncate">
                          {partner.displayName}
                        </span>
                        <span className="text-[10px] font-bold text-purple-400">
                          {partner.species}
                        </span>
                      </div>
                      <p className="text-xs text-purple-700/70 truncate">
                        "{partner.relationshipStatus}"
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat Thread or Empty Selection */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeChatPartner ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 sm:p-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/40">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-white text-purple-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={activeChatPartner.avatarUrl}
                    alt={activeChatPartner.displayName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-200"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-purple-950 text-sm sm:text-base leading-tight">
                        {activeChatPartner.displayName}
                      </h4>
                      <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-1.5 rounded-md">
                        {activeChatPartner.species}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-600 font-medium">
                      Craves: {activeChatPartner.favouriteFood}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      firebaseStatus.mode === 'cloud-firestore'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {firebaseStatus.mode === 'cloud-firestore' ? 'Cloud Sync' : 'Demo Mode'}
                  </span>
                  <button type="button" onClick={() => { if (activeConversationId && confirm('Delete this chat from your inbox?')) void deleteChat(activeConversationId); }} className="p-2 rounded-lg text-rose-500 hover:bg-rose-50" title="Delete chat" aria-label="Delete chat">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Thread Container */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#FAF5F2]/40">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-2xl mx-auto mb-2">
                      🐾
                    </div>
                    <p className="text-sm font-bold text-purple-950">
                      Paw connected with {activeChatPartner.displayName}!
                    </p>
                    <p className="text-xs text-purple-700/70 mt-1 max-w-xs mx-auto">
                      Send a message, a sticker, or an absurd comment to break the ice.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.senderId === currentProfile?.id;
                    const dateObj = new Date(msg.timestamp);
                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={msg.senderAvatar || activeChatPartner.avatarUrl}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-xl object-cover ring-1 ring-pink-200 mb-1"
                          />
                        )}

                        <div className={`max-w-[78%] sm:max-w-md ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-rose-500 text-white rounded-br-xs shadow-md shadow-pink-500/20'
                                : 'bg-white text-purple-950 rounded-bl-xs border border-purple-100 shadow-sm'
                            }`}
                          >
                            {msg.sticker && (
                              <div className="text-3xl my-1 animate-bounce">
                                {msg.sticker}
                              </div>
                            )}
                            <div>{msg.text}</div>
                          </div>

                          <div
                            className={`flex items-center gap-1 mt-1 text-[10px] text-purple-400 font-medium px-1 ${
                              isMe ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-pink-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Sticker Picker Drawer */}
              {showStickerPicker && (
                <div className="p-3 bg-pink-50 border-t border-pink-200 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-purple-900 uppercase">
                      Send Snack & Toy Sticker:
                    </span>
                    <button
                      onClick={() => setShowStickerPicker(false)}
                      className="text-purple-400 text-xs font-bold"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STICKERS.map((stk) => (
                      <button
                        key={stk.emoji}
                        onClick={() => handleSend(undefined, stk.emoji)}
                        className="p-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-100 hover:scale-110 transition-all text-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title={stk.label}
                      >
                        <span>{stk.emoji}</span>
                        <span className="text-[11px] font-bold text-purple-900 hidden sm:inline">
                          {stk.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input Footer */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-pink-100 flex items-center gap-2 bg-white">
                <button
                  type="button"
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                  className="p-2.5 rounded-xl text-pink-600 hover:bg-pink-50 border border-pink-200 transition-colors cursor-pointer"
                  title="Pick stickers (bones, fish, balls)"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder={`Speak to ${activeChatPartner.displayName} (barks, meows & tea)...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  autoComplete="off"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-sm font-medium focus:outline-pink-500 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={isSending || inputMessage.trim().length === 0}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold hover:opacity-95 disabled:opacity-40 transition-all shadow-md shadow-pink-500/20 cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-purple-400">
              <div className="w-20 h-20 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center text-4xl mb-4">
                💌
              </div>
              <h3 className="text-xl font-black text-purple-950 mb-1">Select a Conversation</h3>
              <p className="text-xs text-purple-700/70 max-w-sm leading-relaxed">
                Pick an animal from the left list or jump into Discover to match with dogs, cats, rabbits and birds.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Two-User Testing Helper Modal */}
      {showTwoUserGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-200 shadow-2xl text-left">
            <h3 className="text-xl font-extrabold text-purple-950 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              How This Chat Works
            </h3>
            <p className="text-xs text-purple-800 leading-relaxed mb-4">
              RUFF LUCK works fully offline.
            </p>

            <p className="text-xs text-purple-900 font-medium bg-pink-50/60 p-4 rounded-2xl border border-pink-100">Everything lives in your browser. Open the app in a second window to meet another pet. No servers, no accounts, no real data.</p>

            <button
              onClick={() => setShowTwoUserGuide(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-950 text-white font-bold text-xs hover:bg-purple-900 cursor-pointer"
            >
              Got it, let's chat!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
