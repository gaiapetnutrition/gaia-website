export default function Slider({ label, value, min = 0, max = 100, step = 1, unit = '', hint, onChange }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between items-baseline">
          <label className="text-sm font-medium text-bark">{label}</label>
          <span className="text-sm font-bold text-forest tabular-nums">
            {value}{unit}
          </span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div
          className="absolute h-1.5 bg-forest/20 rounded-full w-full"
          aria-hidden="true"
        />
        <div
          className="absolute h-1.5 bg-forest rounded-full transition-all duration-150"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full cursor-pointer"
          style={{ background: 'transparent' }}
        />
      </div>
      <div className="flex justify-between text-xs text-mist">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {hint && <p className="text-xs text-mist -mt-1">{hint}</p>}
    </div>
  )
}
