import { forwardRef } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({ label, hint, error, options = [], placeholder, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-bark">
          {label}
          {props.required && <span className="text-clay mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            'select-base ps-9',
            error && 'border-clay',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist pointer-events-none" />
      </div>
      {hint  && !error && <p className="text-xs text-mist">{hint}</p>}
      {error && <p className="text-xs text-clay">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
