import { useEffect } from 'react';

export function useDebugLog(component: string, message: string, data?: any) {
  useEffect(() => {
    console.log(`🔍 [${component}] ${message}`, data ? data : '');
  }, [component, message, data]);
}

export function debugLog(component: string, message: string, data?: any) {
  console.log(`🔍 [${component}] ${message}`, data ? data : '');
}