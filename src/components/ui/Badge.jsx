import clsx from 'clsx'

const variants = {
  green:  'bg-forest/10 text-forest border border-forest/20',
  olive:  'bg-olive/10  text-olive-dark border border-olive/20',
  cream:  'bg-parchment text-bark border border-stone',
  clay:   'bg-clay/10   text-clay-dark border border-clay/20',
  white:  'bg-white text-forest border border-stone shadow-sm',
}

export default function Badge({ children, variant = 'green', className, dot = false }) {
  return (
    <span className={clsx('pill text-xs font-medium', variants[variant], className)}>
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'green' ? 'bg-forest' : 'bg-olive'
        )} />
      )}
      {children}
    </span>
  )
}
