import { motion, AnimatePresence } from 'framer-motion'
import Spinner from './Spinner'
import clsx from 'clsx'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  backdrop?: 'transparent' | 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const backdropClasses = {
  transparent: 'bg-transparent',
  light: 'bg-white/80',
  dark: 'bg-black/80'
}

export const LoadingOverlay = ({
  isLoading,
  message = 'Chargement...',
  backdrop = 'light',
  size = 'lg',
  className
}: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={clsx(
            'absolute inset-0 z-50 flex flex-col items-center justify-center',
            backdropClasses[backdrop],
            className
          )}
        >
          <Spinner size={size} className="mb-4" />
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-gray-600"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay