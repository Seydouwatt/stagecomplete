import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  User,
  Music,
  Calendar,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Star,
  Award,
} from "lucide-react";
import type { PublicArtistProfile, ArtistMember } from "../../../types";

interface MembersTabProps {
  artistProfile: PublicArtistProfile;
}

export const MembersTab: React.FC<MembersTabProps> = ({ artistProfile }) => {
  const [members, setMembers] = useState<ArtistMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setIsLoading(true);
        // Utiliser les membres directement depuis artistProfile (ils sont maintenant inclus dans l'API)
        if (artistProfile.members && artistProfile.members.length > 0) {
          setMembers(artistProfile.members);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des membres:", error);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [artistProfile.id, artistProfile.members]);

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case "BEGINNER":
        return "Débutant";
      case "INTERMEDIATE":
        return "Intermédiaire";
      case "PROFESSIONAL":
        return "Professionnel";
      default:
        return experience;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">Chargement des membres...</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="w-16 h-16 text-base-content/30 mb-4" />
        <h3 className="text-xl font-semibold text-base-content/70 mb-2">
          Aucun membre répertorié
        </h3>
        <p className="text-base-content/50 max-w-md">
          Les informations sur les membres du groupe ne sont pas encore
          disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction du groupe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-2xl mb-4">
            <Users className="w-6 h-6 text-primary" />
            L'équipe de {artistProfile.profile.name}
          </h2>
          <p className="text-base-content/70 mb-4">
            Découvrez les talents qui composent ce{" "}
            {artistProfile.artistType === "BAND" ? "groupe" : "collectif"}
            de {members.length} membres passionnés.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="badge badge-primary badge-outline">
              {members.filter((m) => m.isFounder).length} fondateur
              {members.filter((m) => m.isFounder).length > 1 ? "s" : ""}
            </div>
            <div className="badge badge-secondary badge-outline">
              {members.length} membres actifs
            </div>
            <div className="badge badge-accent badge-outline">
              Actif depuis {artistProfile.yearsActive} ans
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="card-body p-6">
              {/* Header du membre */}
              <div className="flex items-start gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        member.avatar ||
                        `https://via.placeholder.com/64x64/1f2937/white?text=${member.artistName.charAt(
                          0
                        )}`
                      }
                      alt={member.artistName}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{member.artistName}</h3>
                    {member.isFounder && (
                      <div className="badge badge-warning badge-sm gap-1">
                        <Star className="w-3 h-3" />
                        Fondateur
                      </div>
                    )}
                  </div>
                  <p className="text-primary font-medium">{member.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-sm text-base-content/70">
                      {getExperienceLabel(member.experience || "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <p className="text-base-content/80 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
              )}

              {/* Instruments */}
              {member.instruments && member.instruments.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4 text-secondary" />
                    Instruments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.instruments.map((instrument, idx) => (
                      <span
                        key={idx}
                        className="badge badge-secondary badge-outline badge-sm"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Informations supplémentaires */}
              <div className="space-y-2 text-sm text-base-content/60">
                {member.yearsActive && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{member.yearsActive} années d'expérience</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    Membre depuis{" "}
                    {new Date(
                      member.joinDate || member.createdAt
                    ).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>

              {/* Contact et réseaux sociaux */}
              <div className="mt-4 pt-4 border-t border-base-300">
                <div className="flex flex-wrap gap-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="btn btn-outline btn-xs gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </a>
                  )}

                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="btn btn-outline btn-xs gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Tél
                    </a>
                  )}

                  {member.socialLinks?.instagram && (
                    <a
                      href={member.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs gap-1"
                    >
                      <Instagram className="w-3 h-3" />
                      IG
                    </a>
                  )}

                  {member.socialLinks?.facebook && (
                    <a
                      href={member.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs gap-1"
                    >
                      <Facebook className="w-3 h-3" />
                      FB
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistiques du groupe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="card-body">
          <h3 className="card-title mb-4">
            <Award className="w-5 h-5 text-primary" />
            Statistiques du groupe
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">
                {members.length}
              </div>
              <div className="text-sm text-base-content/70">Membres</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-secondary mb-1">
                {Math.round(
                  members.reduce((acc, m) => acc + (m.yearsActive || 0), 0) /
                    members.length
                )}
              </div>
              <div className="text-sm text-base-content/70">
                Années d'exp. moy.
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold text-accent mb-1">
                {members.filter((m) => m.isFounder).length}
              </div>
              <div className="text-sm text-base-content/70">Fondateurs</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-info mb-1">
                {
                  Array.from(
                    new Set(members.flatMap((m) => m.instruments || []))
                  ).length
                }
              </div>
              <div className="text-sm text-base-content/70">Instruments</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
