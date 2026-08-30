import { motion } from 'framer-motion';

const RICK_WELCOME_VIDEO_URL = '/brand/rick-digital-growth-guide-welcome.webm';

export default function RickGrowthGuideAvatar({
  guideMotion = 'idle',
  className = '',
  label = 'Your Digital Growth Guide',
  decorative = false,
}) {
  const motionByState = {
    hello: { y: [0, -7, 0], rotate: [0, -1.5, 0], transition: { duration: 1.1, repeat: 1 } },
    listening: { y: [0, -2, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } },
    explaining: { y: [0, -3, 0], scale: [1, 1.015, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } },
    next_step: { x: [0, 4, 0], y: [0, -3, 0], transition: { duration: 0.75, repeat: 1 } },
    idle: { y: [0, -3, 0], transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } },
  };

  return (
    <div
      className={['relative overflow-visible', className].filter(Boolean).join(' ')}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      {!decorative && <span className="sr-only">{label}</span>}
      <motion.video
        src={RICK_WELCOME_VIDEO_URL}
        muted
        autoPlay
        loop
        playsInline
        aria-hidden="true"
        animate={motionByState[guideMotion] || motionByState.idle}
        className="h-full w-full object-cover object-center drop-shadow-[0_14px_18px_rgba(0,0,0,0.38)]"
      />
    </div>
  );
}
