import { motion } from 'framer-motion';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Floating gradient orb 1 — cyan */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '5%', left: '15%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
      />

      {/* Floating gradient orb 2 — violet */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '45%', right: '5%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
      />
    </div>
  );
}
