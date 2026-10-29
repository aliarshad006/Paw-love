import React from 'react';
import { motion } from 'motion/react';

const NAME = 'Ruff Luck'.split('');

export const Splash: React.FC = () => (
  <motion.div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[#2b0f08] to-[#8a2410] text-white"
    exit={{ opacity: 0, scale: 1.08 }}
    transition={{ duration: 0.6 }}
  >
    {['💔', '🐾', '💔', '🐾', '💔', '🐾'].map((e, i) => (
      <motion.span
        key={i}
        className="absolute text-3xl opacity-40"
        style={{ left: `${10 + i * 15}%`, bottom: '-10%' }}
        animate={{ y: [0, -900], rotate: [0, 25, -25, 0] }}
        transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
      >
        {e}
      </motion.span>
    ))}

    <motion.div
      className="relative w-28 h-28 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-6xl shadow-2xl"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 12 }}
    >
      🐾
      <motion.span
        className="absolute inset-0 rounded-full border-4 border-orange-300"
        animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </motion.div>

    <div className="mt-6 flex text-5xl sm:text-6xl font-black tracking-tight">
      {NAME.map((c, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 200 }}
        >
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </div>

    <motion.p
      className="mt-2 text-sm sm:text-base font-semibold text-orange-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      Matches that never work 💔
    </motion.p>

    <div className="mt-8 w-56 h-1.5 rounded-full bg-white/20 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-orange-300 to-white"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </div>
  </motion.div>
);
