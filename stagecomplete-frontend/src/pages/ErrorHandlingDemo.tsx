import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from '../stores/useToastStore'
import { useAsyncOperation } from '../hooks/useAsyncOperation'
import LoadingButton from '../components/ui/LoadingButton'
import LoadingOverlay from '../components/ui/LoadingOverlay'
import Spinner from '../components/ui/Spinner'

export const ErrorHandlingDemo: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false)
  const { isLoading, execute } = useAsyncOperation()

  const simulateSuccess = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { message: 'Opération réussie!' }
    }, {
      successMessage: 'Données sauvegardées avec succès ✨'
    })
  }

  const simulateError = async () => {
    await execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      throw new Error('Erreur simulée pour démonstration')
    }, {
      errorMessage: 'Échec de la simulation 😞'
    })
  }

  const showToasts = () => {
    toast.success('Succès ! Tout fonctionne parfaitement 🎉')
    setTimeout(() => toast.info('Information utile 💡'), 500)
    setTimeout(() => toast.warning('Attention aux détails ⚠️'), 1000)
    setTimeout(() => toast.error('Erreur pour test uniquement ❌'), 1500)
  }

  const showOverlayDemo = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  return (
    <div className="min-h-screen bg-base-200 p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            🧪 Démonstration Error Handling & Loading States
          </h1>
          <p className="text-base-content/70">
            Test des composants toast, loading et gestion d'erreurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Toast Notifications */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">🔔 Toast Notifications</h2>
              <p className="text-base-content/70 mb-4">
                Testez les différents types de notifications
              </p>
              
              <div className="space-y-2">
                <button 
                  className="btn btn-success btn-sm w-full"
                  onClick={() => toast.success('Super ! Ça marche ✨')}
                >
                  Success Toast
                </button>
                <button 
                  className="btn btn-error btn-sm w-full"
                  onClick={() => toast.error('Oops, une erreur ! 😓')}
                >
                  Error Toast
                </button>
                <button 
                  className="btn btn-warning btn-sm w-full"
                  onClick={() => toast.warning('Attention! ⚠️')}
                >
                  Warning Toast
                </button>
                <button 
                  className="btn btn-info btn-sm w-full"
                  onClick={() => toast.info('Info importante 💡')}
                >
                  Info Toast
                </button>
                <button 
                  className="btn btn-primary btn-sm w-full"
                  onClick={showToasts}
                >
                  Toutes les notifications
                </button>
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">⏳ Loading States</h2>
              <p className="text-base-content/70 mb-4">
                Différents spinners et états de chargement
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm">Small:</span>
                  <Spinner size="sm" />
                  <span className="text-sm">Medium:</span>
                  <Spinner size="md" />
                  <span className="text-sm">Large:</span>
                  <Spinner size="lg" />
                </div>

                <LoadingButton
                  variant="primary"
                  size="sm"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="En cours..."
                  onClick={simulateSuccess}
                >
                  Test Async Success
                </LoadingButton>

                <LoadingButton
                  variant="error"
                  size="sm"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Simulation..."
                  onClick={simulateError}
                >
                  Test Async Error
                </LoadingButton>

                <button
                  className="btn btn-outline btn-sm w-full"
                  onClick={showOverlayDemo}
                >
                  Overlay Demo (3s)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* API Error Simulation */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🌐 Simulation d'erreurs API</h2>
            <p className="text-base-content/70 mb-4">
              Testez la gestion d'erreurs réseau et serveur
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className="btn btn-outline btn-error"
                onClick={() => {
                  // Simuler erreur 400
                  toast.error('Erreur 400: Requête invalide')
                }}
              >
                Erreur 400
              </button>
              <button 
                className="btn btn-outline btn-warning"
                onClick={() => {
                  // Simuler erreur 401
                  toast.error('Erreur 401: Non autorisé')
                }}
              >
                Erreur 401
              </button>
              <button 
                className="btn btn-outline btn-error"
                onClick={() => {
                  // Simuler erreur 500
                  toast.error('Erreur 500: Erreur serveur')
                }}
              >
                Erreur 500
              </button>
            </div>
          </div>
        </div>

        {/* Success Examples */}
        <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-lg">
          <h3 className="text-lg font-semibold text-success mb-2">
            ✅ Fonctionnalités implémentées
          </h3>
          <ul className="list-disc list-inside space-y-1 text-success-content/80">
            <li>Toast notifications avec 4 types (success, error, warning, info)</li>
            <li>Animations Framer Motion pour les toasts</li>
            <li>Loading states avec spinners personnalisés</li>
            <li>LoadingButton avec états de chargement</li>
            <li>LoadingOverlay pour les overlays de chargement</li>
            <li>Hook useAsyncOperation pour gérer les opérations async</li>
            <li>Intercepteur Axios avec gestion d'erreurs automatique</li>
            <li>Messages d'erreur en français</li>
          </ul>
        </div>
      </motion.div>

      {/* Loading Overlay Demo */}
      <LoadingOverlay 
        isLoading={showOverlay}
        message="Démonstration de l'overlay de chargement..."
        backdrop="dark"
      />
    </div>
  )
}

export default ErrorHandlingDemo