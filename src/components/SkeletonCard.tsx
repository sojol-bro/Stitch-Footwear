import { motion } from 'motion/react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-sm">
      <div className="aspect-square rounded-2xl bg-brand-cream/50 overflow-hidden relative mb-4">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>
      <div className="px-2 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-brand-cream rounded-md" />
          <div className="h-4 w-12 bg-brand-cream rounded-md" />
        </div>
        <div className="h-3 w-16 bg-brand-cream rounded-md opacity-50" />
        <div className="h-10 w-full bg-brand-cream rounded-xl" />
      </div>
    </div>
  );
};
