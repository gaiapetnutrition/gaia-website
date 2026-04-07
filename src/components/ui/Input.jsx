import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ label, hint, error, prefix, suffix, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-bark">
          {label}
          {props.required && <span className="text-clay mr-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute end-3 text-mist text-sm pointer-events-none">{prefix}</span>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-base',
            prefix && 'pe-9',
            suffix && 'ps-9',
            error && 'border-clay focus:border-clay focus:shadow-none ring-1 ring-clay/30',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute start-3 text-mist text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-mist">{hint}</p>}
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
