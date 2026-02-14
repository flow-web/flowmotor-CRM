/**
 * AudioWaveform — Animated vertical bar visualizer for audio recording.
 *
 * When `active` is true the bars animate with staggered CSS keyframes
 * in gold (#C4A484). When idle the bars shrink to a minimal resting height
 * and dim to a muted color.
 *
 * Bar count is kept at 24 for a clean, dense look on mobile.
 */

const BAR_COUNT = 24

export default function AudioWaveform({ active = false }) {
  return (
    <>
      {/* Scoped keyframes — injected once, deduped by the browser */}
      <style>{`
        @keyframes waveBar {
          0%, 100% { height: var(--bar-min); }
          50%      { height: var(--bar-max); }
        }
      `}</style>

      <div
        className="flex items-end justify-center gap-[3px] h-16 px-2"
        aria-hidden="true"
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          // Stagger each bar so the wave looks organic
          const delay = (i * 0.07).toFixed(2)
          // Randomise max height per bar so each cycle looks different
          const maxH = 40 + Math.round(Math.sin(i * 1.3) * 20 + Math.random() * 10)

          return (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: 3,
                '--bar-min': '6px',
                '--bar-max': `${maxH}px`,
                height: active ? `${maxH * 0.5}px` : '6px',
                backgroundColor: active
                  ? 'rgba(196, 164, 132, 0.85)'
                  : 'rgba(196, 164, 132, 0.2)',
                animation: active
                  ? `waveBar ${0.6 + Math.random() * 0.4}s ease-in-out ${delay}s infinite`
                  : 'none',
              }}
            />
          )
        })}
      </div>
    </>
  )
}
