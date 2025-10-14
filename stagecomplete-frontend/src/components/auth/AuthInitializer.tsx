import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer - Gère l'auto-login au démarrage de l'application
 *
 * Vérifie si un token existe dans localStorage (via Zustand persist)
 * et tente de valider la session en appelant /api/auth/me
 *
 * Comportement:
 * - Si token valide → user auto-connecté, redirect selon rôle
 * - Si token invalide/expiré → logout, redirect /home
 * - Si pas de token → continue normalement
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { token, isAuthenticated, user, refreshUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 [AUTH_INIT] Initializing authentication...');
      console.log('🔐 [AUTH_INIT] Token exists:', !!token);
      console.log('🔐 [AUTH_INIT] Is authenticated:', isAuthenticated);
      console.log('🔐 [AUTH_INIT] Current path:', location.pathname);

      // Si pas de token, pas besoin de vérifier
      if (!token || !isAuthenticated) {
        console.log('✅ [AUTH_INIT] No token found, skipping validation');
        setIsInitializing(false);
        return;
      }

      // Si on est sur une route publique (/login, /register, /home, /artist/:slug), ne pas auto-redirect
      const publicPaths = ['/login', '/register', '/home', '/directory', '/artistes'];
      const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path)) ||
                          location.pathname.match(/^\/artist\/[^/]+$/); // Public artist profiles

      if (isPublicPath) {
        console.log('✅ [AUTH_INIT] On public path, skipping auto-redirect');
        setIsInitializing(false);
        return;
      }

      try {
        // Tenter de valider le token avec /api/auth/me
        console.log('🔄 [AUTH_INIT] Validating token with /api/auth/me...');
        await refreshUser();

        console.log('✅ [AUTH_INIT] Token valid, user refreshed');

        // Si on est sur /, redirect vers le dashboard approprié
        if (location.pathname === '/') {
          const dashboardPath = user?.role === 'ARTIST' ? '/artist/dashboard' : '/venue/dashboard';
          console.log(`➡️  [AUTH_INIT] Redirecting to ${dashboardPath}`);
          navigate(dashboardPath, { replace: true });
        }
      } catch (error) {
        // Token invalide ou expiré
        console.warn('⚠️  [AUTH_INIT] Token validation failed:', error);
        console.log('🔓 [AUTH_INIT] Logging out and redirecting to /home');

        logout();

        // Ne rediriger que si on n'est pas déjà sur une route publique
        if (!isPublicPath && location.pathname !== '/') {
          navigate('/home', { replace: true });
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []); // Exécuter seulement au montage initial

  // Afficher un loader pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
