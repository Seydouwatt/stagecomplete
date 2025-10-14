import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) {
      // App déjà installée, ne rien afficher
      return;
    }

    // Vérifier si le banner a déjà été fermé dans cette session
    const bannerDismissed = sessionStorage.getItem('pwa-banner-dismissed');

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);

      // Afficher le banner après 10 secondes si pas déjà fermé
      if (!bannerDismissed) {
        setTimeout(() => {
          setShowBanner(true);
        }, 10000);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('✅ PWA installée avec succès');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ Utilisateur a accepté l\'installation');
        setShowBanner(false);
      } else {
        console.log('❌ Utilisateur a refusé l\'installation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showInstallButton) return null;

  return (
    <>
      {/* Bouton dans le header (toujours visible sur mobile) */}
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="btn btn-ghost btn-sm gap-2 hidden sm:flex"
        title="Installer l'application"
        data-cy="install-pwa-button"
      >
        <Download className="w-4 h-4" />
        <span className="hidden lg:inline">Installer</span>
      </button>

      {/* Banner promotionnel (apparaît après 10s) */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white p-4 shadow-2xl z-50 animate-slide-up"
          data-cy="install-pwa-banner"
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <img src="/pwa-192x192.png" alt="StageComplete" className="w-10 h-10 rounded-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Installez StageComplete</h3>
                <p className="text-xs sm:text-sm opacity-90 truncate">
                  Accès rapide depuis votre écran d'accueil
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="btn btn-sm btn-accent gap-2"
              >
                {isInstalling ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    <span className="hidden sm:inline">Installation...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Installer</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismissBanner}
                className="btn btn-ghost btn-sm btn-square text-white"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
