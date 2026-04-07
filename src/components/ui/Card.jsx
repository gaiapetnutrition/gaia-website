import clsx from 'clsx'

export default function Card({ children, className, hover = true, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'card',
        padding && 'p-6 md:p-8',
        hover && 'hover:shadow-card-hover cursor-default',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
