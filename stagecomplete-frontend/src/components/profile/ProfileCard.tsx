import React from "react";
import { Edit, MapPin, Mail, Phone, Globe, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  role: "ARTIST" | "VENUE" | "ADMIN";
  profile: ProfileData;
}

interface ProfileCardProps {
  user: User;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
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
    const fields = [
      profile.name,
      profile.bio,
      profile.location,
      profile.phone,
      profile.website,
    ];
    const filledFields = fields.filter(field => field && field.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completeness = calculateCompleteness();
  const isIncomplete = completeness < 80;

  const memberSince = new Date(profile.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

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
                  alt={profile.name}
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
                  {profile.name}
                </h2>
                <p className="text-base-content/60 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                {profile.location && (
                  <p className="text-base-content/60 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                )}
                <p className="text-xs text-base-content/40 flex items-center gap-2 mt-2">
                  <Calendar className="w-3 h-3" />
                  Membre depuis {memberSince}
                </p>
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

            {/* Bio */}
            {profile.bio ? (
              <div className="mt-4">
                <p className="text-base-content/80 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-base-content/40 italic">
                  Aucune biographie ajoutée
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Informations de contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.phone ? (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                <Phone className="w-5 h-5 text-base-content/60" />
                <span className="text-base-content">{profile.phone}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg opacity-50">
                <Phone className="w-5 h-5 text-base-content/40" />
                <span className="text-base-content/40 italic">Non renseigné</span>
              </div>
            )}

            {profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <Globe className="w-5 h-5 text-base-content/60" />
                <span className="text-base-content truncate">{profile.website}</span>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg opacity-50">
                <Globe className="w-5 h-5 text-base-content/40" />
                <span className="text-base-content/40 italic">Non renseigné</span>
              </div>
            )}
          </div>
        </div>

        {/* Réseaux sociaux */}
        {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Réseaux sociaux</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profile.socialLinks).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          </div>
        )}

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
              Complétez votre profil pour augmenter votre visibilité
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
                Ajoutez une biographie, votre localisation et vos informations de contact 
                pour améliorer votre profil.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};