import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Flame, FileText, Gauge, MessageCircle } from 'lucide-react';

const features = [
  { icon: Gauge, title: 'Doom-o-meter', text: 'Every pet gets a compatibility score, calculated with extremely serious science.' },
  { icon: FileText, title: 'Breakup certificates', text: 'Match with someone and instantly receive an official document predicting the split.' },
  { icon: MessageCircle, title: 'Real chat', text: 'Talk to real pets from real accounts. Your messages are saved.' },
];

export const WelcomeLanding: React.FC = () => {
  const { setActiveTab, currentProfile } = useApp();
  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-5 pt-10 pb-8 max-w-xl mx-auto flex flex-col">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 mb-5">
          MAD Hacks 2026 · Useless Software
        </div>
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white">
          Find love.<br />
          <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Watch it fail.</span>
        </h1>
        <p className="mt-4 text-sm text-white/65 leading-relaxed">
          The dating app for pets where every match comes with a compatibility report and an official breakup certificate.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab(currentProfile ? 'discover' : 'create-profile')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-extrabold shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-5 h-5" />
            {currentProfile ? `Continue as ${currentProfile.displayName}` : 'Create your pet profile'}
          </button>
          <button onClick={() => setActiveTab('how-it-works')} className="w-full py-3 rounded-2xl bg-white/10 border border-white/10 text-white font-bold text-sm cursor-pointer">
            How it works
          </button>
        </div>
      </motion.div>

      <div className="mt-10 space-y-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex gap-4 p-4 rounded-2xl bg-[#15151c] border border-white/10"
          >
            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">{f.title}</div>
              <div className="text-xs text-white/60 mt-0.5 leading-relaxed">{f.text}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
