import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  User,
  Compass,
  Heart,
  MessageCircle,
  Zap,
  ArrowLeft
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setActiveTab, currentProfile } = useApp();

  const steps = [
    {
      number: '1',
      title: 'Step 1: Create your animal profile',
      description: 'Choose your name, animal type, personality, favourite food, interests, and a funny bio.',
      icon: '🐾',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
      actionIcon: User
    },
    {
      number: '2',
      title: 'Step 2: Meet other animals',
      description: 'Browse real pets and like the ones you fancy.',
      icon: '🦁',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      actionIcon: Compass
    },
    {
      number: '3',
      title: 'Step 3: Match and doom',
      description: 'Like another animal. It matches instantly. Then the Doom-o-meter tells you exactly why it will fail.',
      icon: '❤️',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      actionIcon: Heart
    },
    {
      number: '4',
      title: 'Step 4: Receive your breakup certificate',
      description: 'Every match comes with an official certificate: cause of split and how long it will last.',
      icon: '💬',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      actionIcon: MessageCircle
    },
    {
      number: '5',
      title: 'Step 5: Chat anyway',
      description: 'Ignore the science and text them. We warned you.',
      icon: '⚡',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      actionIcon: Zap
    }
  ];

  return (
    <div className="min-h-screen paw-pattern-bg py-10 px-4 sm:px-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-800 px-4 py-1.5 rounded-full text-xs font-black border border-pink-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>HOW RUFF LUCK WORKS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-purple-950 tracking-tight">
            How RUFF LUCK Works
          </h1>

          <p className="text-sm sm:text-base text-purple-800/80 font-medium max-w-xl mx-auto leading-relaxed">
            Five steps to a doomed relationship.
          </p>
        </div>

        {/* The 5 Steps */}
        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.number}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-200/80 shadow-md shadow-purple-900/5 hover:border-pink-300 transition-all flex items-start gap-4 sm:gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                {s.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${s.badgeColor}`}>
                    Step {s.number} of 5
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-purple-950">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-800/80 font-medium mt-1 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 text-center shadow-xl space-y-4">
          <button
            onClick={() => setActiveTab(currentProfile ? 'discover' : 'create-profile')}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-lg shadow-xl shadow-pink-500/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Start My Animal Life</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-purple-600">
            <button
              onClick={() => setActiveTab('welcome')}
              className="hover:text-purple-950 cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Welcome</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab(currentProfile ? 'discover' : 'create-profile')}
              className="hover:text-purple-950 underline cursor-pointer"
            >
              {currentProfile ? 'Back to Discover' : 'Skip & Create Profile Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
