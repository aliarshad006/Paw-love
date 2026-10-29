import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Heart, MessageCircle, Users, User, Settings, Bell, Zap, Check } from 'lucide-react';

type Tab = 'discover' | 'matches' | 'chat' | 'circle' | 'profile';
const items: { id: Tab; label: string; icon: any }[] = [
  { id: 'discover', label: 'Discover', icon: Flame },
  { id: 'matches', label: 'Matches', icon: Heart },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'circle', label: 'Circle', icon: Users },
  { id: 'profile', label: 'Me', icon: User },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, currentProfile, unreadNotificationCount, notifications, markNotificationsAsRead } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
          <button onClick={() => setActiveTab(currentProfile ? 'discover' : 'welcome')} className="flex items-center gap-2 cursor-pointer">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center text-base shadow-lg shadow-orange-600/30">🐾</span>
            <span className="font-extrabold text-lg tracking-tight text-white">Ruff <span className="text-orange-400">Luck</span></span>
          </button>

          {currentProfile && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => setActiveTab('drama')} className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${activeTab === 'drama' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80'}`} title="Drama feed">
                <Zap className="w-4 h-4" />
              </button>
              <button onClick={() => { setOpen(!open); if (!open) markNotificationsAsRead(); }} className="relative w-9 h-9 rounded-full bg-white/10 text-white/80 flex items-center justify-center cursor-pointer" title="Notifications">
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">{unreadNotificationCount}</span>
                )}
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/80'}`} title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {open && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-3">
            <div className="rounded-2xl bg-[#15151c] border border-white/10 max-h-72 overflow-y-auto divide-y divide-white/5 shadow-2xl">
              {notifications.length === 0 && <div className="p-4 text-xs text-white/50">Nothing yet. Go break some hearts.</div>}
              {notifications.slice(0, 12).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { if (n.linkToTab) setActiveTab(n.linkToTab as any); setOpen(false); }}
                  className="w-full text-left p-3 flex gap-2 hover:bg-white/5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 mt-0.5 text-orange-400 shrink-0" />
                  <span>
                    <span className="block text-xs font-bold text-white">{n.title}</span>
                    <span className="block text-[11px] text-white/60">{n.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Bottom tab bar */}
      {currentProfile && (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0d0d12]/90 backdrop-blur-xl border-t border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="w-full max-w-7xl mx-auto h-16 px-2 sm:px-4 flex items-center justify-around">
            {items.map((it) => {
              const Icon = it.icon;
              const active = activeTab === it.id;
              return (
                <button key={it.id} onClick={() => setActiveTab(it.id)} className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer">
                  <span className={`w-11 h-8 rounded-full flex items-center justify-center transition-all ${active ? 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-lg shadow-orange-600/30 text-white' : 'text-white/50'}`}>
                    <Icon className={`w-5 h-5 ${active && it.id === 'matches' ? 'fill-white' : ''}`} />
                  </span>
                  <span className={`text-[10px] font-bold ${active ? 'text-orange-400' : 'text-white/45'}`}>{it.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};
