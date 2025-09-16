import React from "react";
import { Edit, MapPin, Mail, Phone, Globe, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  id: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isFounder: boolean;
  role: "ARTIST" | "VENUE" | "MEMBER" | "ADMIN";
  profile: ProfileData;
  createdAt: string;
  updatedAt: string;
}

interface UserCardProps {
  user: User;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  showEditButton = true,
}) => {
  const { profile } = user;

  const roleConfig = {
    ARTIST: {
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      icon: "🎭",
      label: "Artiste",
    },
    VENUE: {
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      icon: "🎪",
      label: "Venue",
    },
    MEMBER: {
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "border-info/20",
      icon: "👥",
      label: "Membre",
    },
    ADMIN: {
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      icon: "👑",
      label: "Administrateur",
    },
  };

  const config = roleConfig[user.role] || roleConfig.ARTIST;

  // Calcul du pourcentage de complétion du profil
  const calculateCompleteness = () => {
    const personalFields = [
      user.firstName,
      user.lastName,
      user.phone,
      profile.avatar,
    ];
    const filledFields = personalFields.filter(field => field && field.trim() !== "").length;
    return Math.round((filledFields / personalFields.length) * 100);
  };

  const completeness = calculateCompleteness();
  const isIncomplete = completeness < 80;

  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  // Déterminer le nom à afficher
  const getDisplayName = () => {
    if (profile.displayName && profile.displayName.trim()) {
      return profile.displayName;
    }
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return 'Utilisateur';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-base-100 shadow-lg border-2 ${config.borderColor}`}
    >
      <div className="card-body p-6">
        {/* En-tête avec avatar et infos de base */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={getDisplayName()}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-base-300"
                />
              ) : (
                <div className={`w-24 h-24 rounded-full ${config.bgColor} ring-4 ring-base-300 flex items-center justify-center`}>
                  <span className="text-3xl">{config.icon}</span>
                </div>
              )}
              
              {/* Badge rôle */}
              <div className={`absolute -bottom-2 -right-2 badge ${config.bgColor} ${config.color} border-2 border-base-100`}>
                {config.label}
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-base-content">
                  {getDisplayName()}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`badge ${config.bgColor} ${config.color} border-2`}>
                    {config.icon} {config.label}
                  </span>
                  {user.isFounder && (
                    <span className="badge badge-primary">🏆 Fondateur</span>
                  )}
                </div>
              </div>

              {/* Bouton Éditer */}
              {showEditButton && (
                <button
                  onClick={onEdit}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Éditer
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Informations personnelles */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Informations personnelles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.firstName || user.lastName ? (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <User className="w-5 h-5 text-base-content/60" />
                <span className="text-base-content">
                  {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg opacity-50">
                <User className="w-5 h-5 text-base-content/40" />
                <span className="text-base-content/40 italic">Nom non renseigné</span>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Mail className="w-5 h-5 text-base-content/60" />
              <span className="text-base-content">{user.email}</span>
            </div>

            {user.phone ? (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Phone className="w-5 h-5 text-base-content/60" />
                <span className="text-base-content">{user.phone}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg opacity-50">
                <Phone className="w-5 h-5 text-base-content/40" />
                <span className="text-base-content/40 italic">Téléphone non renseigné</span>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Calendar className="w-5 h-5 text-base-content/60" />
              <span className="text-base-content">Inscrit en {memberSince}</span>
            </div>

            {user.isFounder && (
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20 sm:col-span-2">
                <span className="text-lg">🏆</span>
                <span className="text-primary font-medium">Membre fondateur</span>
              </div>
            )}
          </div>
        </div>

        {/* Indicateur de complétion du profil */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profil complété</span>
            <span className={`text-sm font-bold ${completeness >= 80 ? 'text-success' : 'text-warning'}`}>
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                completeness >= 80 ? 'bg-success' : 'bg-warning'
              }`}
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          {isIncomplete && (
            <p className="text-xs text-base-content/60 mt-2">
              <User className="w-3 h-3 inline mr-1" />
              Complétez vos informations personnelles
            </p>
          )}
        </div>

        {/* Message si profil incomplet */}
        {isIncomplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-warning mt-4"
          >
            <div className="flex-1">
              <h4 className="font-medium">Profil incomplet</h4>
              <p className="text-sm">
                Ajoutez votre nom, prénom, téléphone et photo de profil pour compléter vos informations.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};