import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  Settings,
  Music,
  MapPin,
  TrendingUp,
  Users,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";

import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
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

    if (user?.role === "ARTIST") {
      return [
        ...baseItems,
        {
          id: "browse-venues",
          label: "Trouver des venues",
          icon: Search,
          href: "/browse/venues",
        },
        {
          id: "portfolio",
          label: "Mon Portfolio",
          icon: Music,
          href: "/artist/portfolio",
        },
        {
          id: "bookings",
          label: "Mes Bookings",
          icon: Calendar,
          href: "/artist/bookings",
        },
        {
          id: "analytics",
          label: "Statistiques",
          icon: TrendingUp,
          href: "/artist/analytics",
        },
      ];
    } else if (user?.role === "VENUE") {
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

    return baseItems;
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
      className={clsx(
        "bg-base-200 border-r border-base-300 transition-all duration-300",
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
          <Link to="/browse" className="btn btn-ghost">
            {user?.role === "ARTIST"
              ? "Découvrir les venues"
              : "Découvrir les artistes"}
          </Link>
        </ul>

        {/* Bottom section */}
        <div className="mt-8 pt-4 border-t border-base-300">
          <ul className="menu menu-vertical w-full">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300"
              >
                <User className="w-5 h-5" />
                <span>Profil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300"
              >
                <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
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
      <div className="absolute bottom-4 left-4 right-4">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-primary/20">
                  <span className="text-sm">
                    {user?.profile?.name?.charAt(0) || "?"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.profile?.name}
                </p>
                <p className="text-xs text-base-content/60">Plan Premium</p>
              </div>
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
