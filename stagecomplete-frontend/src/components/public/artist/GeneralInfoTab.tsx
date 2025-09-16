import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Award,
  Briefcase,
  Clock,
  Users,
  MapPin,
  Zap,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface GeneralInfoTabProps {
  artistProfile: PublicArtistProfile;
}

export const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ artistProfile }) => {
  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case "BEGINNER": return "Débutant";
      case "INTERMEDIATE": return "Intermédiaire";
      case "PROFESSIONAL": return "Professionnel";
      default: return experience;
    }
  };

  const getArtistTypeLabel = (type: string) => {
    switch (type) {
      case "SOLO": return "Artiste solo";
      case "BAND": return "Groupe";
      case "THEATER_GROUP": return "Troupe de théâtre";
      case "COMEDY_GROUP": return "Troupe de comédie";
      case "ORCHESTRA": return "Orchestre";
      case "CHOIR": return "Chorale";
      case "OTHER": return "Autre";
      default: return type;
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    switch (specialty) {
      case "CONCERT": return "Concerts";
      case "STUDIO": return "Studio";
      case "TEACHING": return "Enseignement";
      case "WEDDING": return "Mariages";
      case "CORPORATE": return "Événements corporate";
      case "PRIVATE": return "Événements privés";
      default: return specialty;
    }
  };

  return (
    <div className="space-y-8">
      {/* Bio artistique complète */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">
            <FileText className="w-6 h-6 text-primary" />
            Biographie artistique
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed text-base-content/80">
              {artistProfile.artisticBio || artistProfile.profile.bio ||
               "Aucune biographie artistique détaillée n'est disponible pour le moment."}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations de base */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Award className="w-5 h-5 text-primary" />
              Informations de base
            </h3>

            <div className="space-y-4">
              {/* Type d'artiste */}
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-secondary mt-1" />
                <div>
                  <p className="font-medium">Type d'artiste</p>
                  <p className="text-base-content/70">
                    {getArtistTypeLabel(artistProfile.artistType || "SOLO")}
                    {artistProfile.memberCount && artistProfile.memberCount > 1 && (
                      <span className="ml-2 text-sm">
                        ({artistProfile.memberCount} membres)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Expérience */}
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium">Niveau d'expérience</p>
                  <p className="text-base-content/70">
                    {getExperienceLabel(artistProfile.experience || "")}
                  </p>
                </div>
              </div>

              {/* Années d'activité */}
              {artistProfile.yearsActive && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-info mt-1" />
                  <div>
                    <p className="font-medium">Années d'activité</p>
                    <p className="text-base-content/70">
                      {artistProfile.yearsActive} années
                    </p>
                  </div>
                </div>
              )}

              {/* Localisation */}
              {artistProfile.profile.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-warning mt-1" />
                  <div>
                    <p className="font-medium">Localisation</p>
                    <p className="text-base-content/70">
                      {artistProfile.profile.location}
                    </p>
                    {artistProfile.travelRadius && (
                      <p className="text-sm text-base-content/60">
                        Rayon de déplacement : {artistProfile.travelRadius}km
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Date de création */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-success mt-1" />
                <div>
                  <p className="font-medium">Membre depuis</p>
                  <p className="text-base-content/70">
                    {new Date(artistProfile.profile.user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spécialités et compétences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Briefcase className="w-5 h-5 text-secondary" />
              Spécialités et compétences
            </h3>

            <div className="space-y-6">
              {/* Genres musicaux */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Genres musicaux
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artistProfile.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="badge badge-primary badge-outline"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instruments */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  Instruments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {artistProfile.instruments.map((instrument, index) => (
                    <span
                      key={index}
                      className="badge badge-secondary badge-outline"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spécialités */}
              {artistProfile.specialties && artistProfile.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" />
                    Types d'événements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {artistProfile.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="badge badge-accent badge-outline"
                      >
                        {getSpecialtyLabel(specialty)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fourchette de prix */}
              {artistProfile.priceRange && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-info" />
                    Fourchette de prix
                  </h4>
                  <div className="badge badge-info badge-outline">
                    {artistProfile.priceRange}
                  </div>
                  <p className="text-xs text-base-content/60 mt-2">
                    * Prix indicatifs, variables selon les prestations
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Équipements (aperçu) */}
      {artistProfile.equipment && artistProfile.equipment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-4">
              <Zap className="w-5 h-5 text-warning" />
              Équipements disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artistProfile.equipment.slice(0, 6).map((equipment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm">{equipment}</span>
                </div>
              ))}
            </div>
            {artistProfile.equipment.length > 6 && (
              <p className="text-center text-sm text-base-content/60 mt-4">
                +{artistProfile.equipment.length - 6} autres équipements (détails dans l'onglet Fiche technique)
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Informations complémentaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-r from-info/10 to-success/10 border border-info/20"
      >
        <div className="card-body">
          <h3 className="card-title text-info mb-4">
            💡 Informations complémentaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-base-content mb-2">Profil vérifié</h4>
              <p className="text-base-content/70">
                Ce profil a été créé par l'artiste et contient des informations à jour.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-base-content mb-2">Disponibilité</h4>
              <p className="text-base-content/70">
                Contactez l'artiste pour connaître ses disponibilités actuelles et futures.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-base-content mb-2">Dernière mise à jour</h4>
              <p className="text-base-content/70">
                {new Date(artistProfile.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-base-content mb-2">Visibilité</h4>
              <p className="text-base-content/70">
                Profil public, accessible aux venues et au grand public.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};