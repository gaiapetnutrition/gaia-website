import { forwardRef } from 'react'
import clsx from 'clsx'

const variants = {
  primary: [
    'bg-forest text-white',
    'hover:bg-forest-light hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(59,94,65,0.35)]',
    'active:bg-forest-dark active:translate-y-0 active:shadow-cta',
    'shadow-cta',
  ],
  secondary: [
    'bg-white text-forest border-2 border-forest',
    'hover:bg-forest hover:text-white hover:-translate-y-[2px]',
    'active:translate-y-0',
  ],
  ghost: [
    'bg-transparent text-forest',
    'hover:bg-forest/[8%]',
  ],
  outline: [
    'bg-transparent text-earth border border-stone',
    'hover:border-sage hover:text-forest',
  ],
  clay: [
    'bg-clay text-white',
    'hover:bg-clay-dark hover:-translate-y-[2px]',
    'active:translate-y-0',
    'shadow-md',
  ],
}

const sizes = {
  sm:  'h-9  px-4  text-sm  rounded-xl  gap-1.5',
  md:  'h-11 px-6  text-sm  rounded-xl  gap-2',
  lg:  'h-13 px-8  text-base rounded-2xl gap-2',
  xl:  'h-15 px-10 text-base rounded-2xl gap-2.5',
}

const Button = forwardRef(({
  as: Tag = 'button',
  variant = 'primary',
  size    = 'md',
  className,
  children,
  loading = false,
  icon,
  iconPosition = 'right',
  ...props
}, ref) => {
  return (
    <Tag
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center font-semibold cursor-pointer',
        'transition-[transform,background-color,box-shadow,opacity,border-color,color] duration-[180ms]',
        '[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]',
        'active:scale-[0.97] active:[transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:duration-[100ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        'whitespace-nowrap select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...(Tag === 'button' ? { disabled: loading || props.disabled } : {})}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'right' && icon}
      {children}
      {!loading && icon && iconPosition === 'left' && icon}
    </Tag>
  )
})

Button.displayName = 'Button'
export default Button
