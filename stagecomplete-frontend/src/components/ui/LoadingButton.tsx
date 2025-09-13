import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({
    children,
    isLoading = false,
    loadingText,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled,
    className,
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          {
            'w-full': fullWidth,
            'loading': isLoading
          },
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {isLoading ? loadingText || 'Chargement...' : children}
      </button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export default LoadingButton