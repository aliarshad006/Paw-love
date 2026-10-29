/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Splash } from './components/Splash';
import { AuthScreen } from './pages/AuthScreen';
import { getSession } from './lib/accounts';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MatchModal } from './components/MatchModal';
import { WelcomeLanding } from './pages/WelcomeLanding';
import { HowItWorks } from './pages/HowItWorks';
import { CreateProfile } from './pages/CreateProfile';
import { Discover } from './pages/Discover';
import { MatchesAndFriends } from './pages/MatchesAndFriends';
import { ChatInbox } from './pages/ChatInbox';
import { FriendCircle } from './pages/FriendCircle';
import { DramaFeed } from './pages/DramaFeed';
import { ProfileDetail } from './pages/ProfileDetail';
import { SettingsHelp } from './pages/SettingsHelp';

const MainRouter: React.FC = () => {
  const { activeTab, currentProfile } = useApp();

  // If visitor has no animal profile yet, allow Welcome, HowItWorks, CreateProfile, or Settings
  if (!currentProfile && activeTab !== 'welcome' && activeTab !== 'how-it-works' && activeTab !== 'create-profile' && activeTab !== 'settings') {
    return <WelcomeLanding />;
  }

  switch (activeTab) {
    case 'welcome':
      return <WelcomeLanding />;
    case 'how-it-works':
      return <HowItWorks />;
    case 'create-profile':
      return <CreateProfile />;
    case 'discover':
      return <Discover />;
    case 'matches':
      return <MatchesAndFriends />;
    case 'chat':
      return <ChatInbox />;
    case 'circle':
      return <FriendCircle />;
    case 'drama':
      return <DramaFeed />;
    case 'profile':
      return <ProfileDetail />;
    case 'settings':
      return <SettingsHelp />;
    default:
      return currentProfile ? <Discover /> : <WelcomeLanding />;
  }
};

export default function App() {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{splash && <Splash key="splash" />}</AnimatePresence>
      {!splash && !getSession() && <AuthScreen />}
      {!splash && getSession() && (
        <AppProvider>
          <div className="min-h-[100dvh] w-full overflow-x-hidden flex flex-col bg-transparent text-[#f4f4f6] selection:bg-pink-300 selection:text-purple-950">
            <Navbar />
            <main className="flex-1">
              <MainRouter />
            </main>
            <MatchModal />
          </div>
        </AppProvider>
      )}
    </>
  );
}
