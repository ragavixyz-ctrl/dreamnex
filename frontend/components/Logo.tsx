'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="relative">
        <motion.div
          className={`${sizes[size]} rounded-xl bg-gradient-to-br from-primary via-purple-600 to-pink-500 flex items-center justify-center shadow-lg`}
          animate={{
            boxShadow: [
              '0 0 20px rgba(79, 70, 229, 0.3)',
              '0 0 30px rgba(147, 51, 234, 0.4)',
              '0 0 20px rgba(79, 70, 229, 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-pink-500 opacity-0 blur-xl"
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      {showText && (
        <span
          className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-500 bg-clip-text text-transparent`}
        >
          DreamNex
        </span>
      )}
    </motion.div>
  );
}

