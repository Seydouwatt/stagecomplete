import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 [MAIN] Starting StageComplete application...')

const rootElement = document.getElementById('root')
console.log('🔍 [MAIN] Root element found:', !!rootElement)

if (!rootElement) {
  console.error('❌ [MAIN] Root element not found!')
} else {
  console.log('✅ [MAIN] Creating React root...')
  const root = createRoot(rootElement)

  console.log('📦 [MAIN] Rendering App component...')
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('✅ [MAIN] App rendered successfully')
}
