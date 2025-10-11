import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  Settings,
  MapPin,
  TrendingUp,
  Users,
  LogOut,
  Crown,
  CalendarCheck,
  IdCard,
} from "lucide-react";
import { clsx } from "clsx";

import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";
import UpgradePrompt from "../premium/UpgradePrompt";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  isPremium?: boolean;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const isFreeArtist =
    user?.role === "ARTIST" && (!user?.plan || user.plan === "FREE");

  // Navigation items based on role and plan
  const getNavigationItems = (): NavigationItem[] => {
    const isPremium = user?.plan === "PREMIUM";

    if (user?.role === "ARTIST") {
      // Sections de base pour les artistes gratuits
      const freeArtistItems: NavigationItem[] = [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          href: "/artist/dashboard",
        },
        {
          id: "portfolio",
          label: "Fiche Artiste",
          icon: IdCard,
          href: "/artist/portfolio",
        },
        {
          id: "bookings",
          label: "Mes Bookings",
          icon: CalendarCheck,
          href: "/artist/bookings",
        },
      ];

      // Sections premium pour les artistes
      const premiumArtistItems: NavigationItem[] = [
        {
          id: "messages",
          label: "Messages",
          icon: MessageSquare,
          href: "/messages",
          badge: 3,
          isPremium: true,
        },
        {
          id: "calendar",
          label: "Calendrier",
          icon: Calendar,
          href: "/calendar",
          isPremium: true,
        },
        {
          id: "browse-venues",
          label: "Trouver des venues",
          icon: Search,
          href: "/browse/venues",
          isPremium: true,
        },
        {
          id: "analytics",
          label: "Statistiques",
          icon: TrendingUp,
          href: "/artist/analytics",
          isPremium: true,
        },
      ];

      if (isPremium) {
        return [...freeArtistItems, ...premiumArtistItems];
      } else {
        return freeArtistItems;
      }
    } else if (user?.role === "VENUE") {
      // Les venues ont accès à tout (pour l'instant)
      const baseItems: NavigationItem[] = [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          href: "/venue/dashboard",
        },
        {
          id: "messages",
          label: "Messages",
          icon: MessageSquare,
          href: "/messages",
          badge: 3,
        },
        {
          id: "calendar",
          label: "Calendrier",
          icon: Calendar,
          href: "/calendar",
        },
      ];

      return [
        ...baseItems,
        {
          id: "browse-artists",
          label: "Trouver des artistes",
          icon: Search,
          href: "/browse/artists",
        },
        {
          id: "venue-profile",
          label: "Profil Venue",
          icon: MapPin,
          href: "/venue/profile",
        },
        {
          id: "events",
          label: "Mes Événements",
          icon: Calendar,
          href: "/venue/events",
        },
        {
          id: "team",
          label: "Équipe",
          icon: Users,
          href: "/venue/team",
        },
      ];
    }

    // Default pour autres rôles
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        href: user?.role === "VENUE" ? "/venue/dashboard" : "/artist/dashboard",
      },
    ];
  };

  const navigationItems = getNavigationItems();

  const isActiveRoute = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    onClose?.();
  };

  return (
    <aside
      data-testid="sidebar"
      className={clsx(
        "bg-base-200 border-r border-base-300 transition-all duration-300 h-[calc(100vh-64px)]",
        "lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "fixed lg:relative inset-y-0 left-0 z-50",
        "w-64 lg:w-72"
      )}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                user?.role === "ARTIST"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/20 text-secondary"
              )}
            >
              <span className="text-xl">
                {user?.role === "ARTIST" ? "🎭" : "🎪"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.profile?.name}</p>
              <p className="text-xs text-base-content/60">
                {user?.role === "ARTIST" ? "Artiste" : "Venue"}
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button onClick={onClose} className="btn btn-ghost btn-sm lg:hidden">
            ✕
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="menu menu-vertical w-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  data-testid={`nav-${item.id}`}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
                  )}
                  onClick={() => onClose?.()}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-primary badge-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* Lien Découvrir - seulement pour premium ou venues */}
          {(user?.role === "VENUE" || user?.plan === "PREMIUM") && (
            <Link to="/browse" className="btn btn-ghost">
              {user?.role === "ARTIST"
                ? "Découvrir les venues"
                : "Découvrir les artistes"}
            </Link>
          )}

          {/* Bouton upgrade pour artistes gratuits */}
          {isFreeArtist && (
            <button
              onClick={() => setShowUpgradePrompt(!showUpgradePrompt)}
              className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none hover:from-purple-600 hover:to-blue-600 mt-4"
            >
              <Crown className="w-4 h-4" />
              Passer à Premium
            </button>
          )}
        </ul>

        {/* Bottom section */}
        <div className="mt-8 pt-4 border-t border-base-300">
          <ul className="menu menu-vertical w-full">
            <li>
              <Link
                to="/user"
                data-testid="nav-profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300"
              >
                <User className="w-5 h-5" />
                <span>Mes Infos</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                data-testid="nav-settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300"
              >
                <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                data-testid="nav-logout"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-error/10 text-error w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Bottom user card */}
      <div className=" bottom-4 left-4 right-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-primary/20">
                  <span className="flex justify-around">
                    {user?.profile.avatar || <User />}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.profile?.name}
                </p>
                <p className="text-xs text-base-content/60">
                  Plan {user?.plan === "PREMIUM" ? "Premium" : "Gratuit"}
                </p>
              </div>
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt Modal pour artistes gratuits */}
      {showUpgradePrompt && isFreeArtist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <UpgradePrompt
              trigger="sidebar"
              onClose={() => setShowUpgradePrompt(false)}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
