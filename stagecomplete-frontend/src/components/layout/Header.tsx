import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  Calendar,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const userAvatar = user?.profile?.avatar || null;
  const userName = user?.profile?.name || "Utilisateur";
  const userRole = user?.role || "USER";

  const roleConfig = {
    ARTIST: {
      color: "text-primary",
      bgColor: "bg-primary/10",
      icon: "🎭",
      label: "Artiste",
    },
    VENUE: {
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      icon: "🎪",
      label: "Venue",
    },
    ADMIN: {
      color: "text-accent",
      bgColor: "bg-accent/10",
      icon: "👑",
      label: "Admin",
    },
  };

  const config =
    roleConfig[userRole as keyof typeof roleConfig] || roleConfig.ARTIST;

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-6">
      {/* Mobile menu button */}
      <div className="navbar-start">
        <button
          className="btn btn-ghost btn-circle lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link
          to={ROUTES.DASHBOARD}
          className="btn btn-ghost normal-case text-xl font-bold"
        >
          <span className="text-2xl mr-2">🎭</span>
          <span className="hidden sm:inline">
            Stage<span className={config.color}>Complete</span>
          </span>
        </Link>
      </div>

      {/* Center - Search (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Rechercher des artistes, venues..."
              className="input input-bordered w-64 xl:w-96"
            />
            <button className="btn btn-square btn-primary">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="navbar-end">
        {/* Search mobile */}
        <button className="btn btn-ghost btn-circle lg:hidden">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-5 h-5" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </label>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <span className="font-bold text-lg">Notifications</span>
              <div className="text-sm text-base-content/70">
                <div className="flex items-center gap-2 py-2">
                  <MessageSquare className="w-4 h-4" />
                  Nouveau message reçu
                </div>
                <div className="flex items-center gap-2 py-2">
                  <Calendar className="w-4 h-4" />
                  Événement confirmé
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User menu */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} />
              ) : (
                <div
                  className={`w-full h-full rounded-full ${config.bgColor} flex items-center justify-center`}
                >
                  <span className="text-lg">{config.icon}</span>
                </div>
              )}
            </div>
          </label>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.ul
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300"
                onBlur={() => setIsProfileMenuOpen(false)}
              >
                {/* User info */}
                <li className="menu-title">
                  <div className="flex flex-col">
                    <span className="font-semibold">{userName}</span>
                    <span className={`text-xs ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </li>

                <div className="divider my-1"></div>

                {/* Menu items */}
                <li>
                  <Link to="/user" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mes Informations
                  </Link>
                </li>
                <li>
                  <Link to="/messages" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                    <span className="badge badge-primary badge-sm">3</span>
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </Link>
                </li>

                {user?.role === "ARTIST" && (
                  <li>
                    <Link
                      to="/artist/portfolio"
                      className="flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Portfolio
                    </Link>
                  </li>
                )}

                <div className="divider my-1"></div>

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
