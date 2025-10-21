import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { HeartIcon } from '@heroicons/react/24/solid'

type ZodiacHeartMapProps = {
  signs: { sign: string; label: string }[]
  activeSign: string
  onSelect: (sign: string) => void
}

function computePositions(length: number) {
  return new Array(length).fill(null).map((_, index) => {
    const angle = (-90 + index * (360 / length)) * (Math.PI / 180)
    const radius = 42
    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    return { x, y }
  })
}

function ZodiacHeartMapComponent({ signs, activeSign, onSelect }: ZodiacHeartMapProps) {
  const positions = useMemo(() => computePositions(signs.length), [signs.length])

  return (
    <div className="relative mx-auto h-[320px] w-[320px] max-w-full">
      <div className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur">
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Heart Flow</p>
          <p className="mt-2 font-serif text-xl text-white">{signs.find((item) => item.sign === activeSign)?.label}</p>
          <p className="mt-1 text-[0.7rem] text-white/50">点击心形，调频你的星座心跳</p>
        </div>
      </div>
      {signs.map((item, index) => {
        const position = positions[index]
        const isActive = item.sign === activeSign
        return (
          <button
            key={item.sign}
            type="button"
            onClick={() => onSelect(item.sign)}
            className={clsx(
              'group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-xs transition',
              isActive ? 'scale-110 text-white' : 'text-white/70 hover:scale-105 hover:text-white'
            )}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <span
              className={clsx(
                'flex h-12 w-12 items-center justify-center rounded-full border bg-white/10 backdrop-blur transition',
                isActive
                  ? 'border-aurora/80 text-aurora shadow-[0_0_25px_rgba(137,255,217,0.35)]'
                  : 'border-white/10 text-white/70 group-hover:border-white/30'
              )}
            >
              <HeartIcon className="h-6 w-6" />
            </span>
            <span className="text-[0.7rem] uppercase tracking-[0.3em]">{item.label}</span>
          </button>
        )
      })}
      <div className="pointer-events-none absolute inset-[12%] rounded-full border border-dashed border-white/10" />
    </div>
  )
}

const ZodiacHeartMap = memo(ZodiacHeartMapComponent)

export default ZodiacHeartMap
