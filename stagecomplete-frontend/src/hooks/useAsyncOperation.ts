import { useState, useCallback } from 'react'
import { toast } from '../stores/useToastStore'

interface UseAsyncOperationOptions {
  successMessage?: string
  errorMessage?: string
  showSuccessToast?: boolean
  showErrorToast?: boolean
}

export const useAsyncOperation = <T = any>(
  options: UseAsyncOperationOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const {
    successMessage = 'Opération réussie',
    errorMessage = 'Une erreur est survenue',
    showSuccessToast = true,
    showErrorToast = true
  } = options

  const execute = useCallback(async <TResult = T>(
    asyncFunction: () => Promise<TResult>,
    customOptions?: {
      successMessage?: string
      errorMessage?: string
    }
  ): Promise<TResult | null> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await asyncFunction()
      setData(result as T)
      
      if (showSuccessToast) {
        toast.success(customOptions?.successMessage || successMessage)
      }
      
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (customOptions?.errorMessage || errorMessage)
      setError(errorMsg)
      
      if (showErrorToast) {
        toast.error(errorMsg)
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [successMessage, errorMessage, showSuccessToast, showErrorToast])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    isLoading,
    error,
    data,
    execute,
    reset
  }
}