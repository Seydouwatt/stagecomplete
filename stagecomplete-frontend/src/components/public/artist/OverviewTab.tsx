import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Calendar,
  Music,
  Users,
  Award,
  Clock,
  Palette,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface OverviewTabProps {
  artistProfile: PublicArtistProfile;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ artistProfile }) => {
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
      {/* Bio artistique principale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            <Palette className="w-6 h-6 text-primary" />
            À propos de {artistProfile.profile.name}
          </h2>
          <p className="text-base-content/80 text-lg leading-relaxed">
            {artistProfile.artisticBio || artistProfile.profile.bio ||
             "Aucune bio artistique disponible pour le moment."}
          </p>
        </div>
      </motion.div>

      {/* Informations clés en grille */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Genres musicaux */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Genres musicaux</h3>
            </div>
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
        </div>

        {/* Instruments */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold">Instruments</h3>
            </div>
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
        </div>

        {/* Expérience */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Expérience</h3>
            </div>
            <div className="space-y-2">
              <div className="badge badge-accent badge-outline">
                {getExperienceLabel(artistProfile.experience || "")}
              </div>
              {artistProfile.yearsActive && (
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <Clock className="w-4 h-4" />
                  {artistProfile.yearsActive} années d'activité
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Type d'artiste */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-info" />
              <h3 className="font-semibold">Type d'artiste</h3>
            </div>
            <div className="space-y-2">
              <div className="badge badge-info badge-outline">
                {getArtistTypeLabel(artistProfile.artistType || "SOLO")}
              </div>
              {artistProfile.memberCount && artistProfile.memberCount > 1 && (
                <div className="text-sm text-base-content/70">
                  {artistProfile.memberCount} membres
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Localisation */}
        {artistProfile.profile.location && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-warning" />
                <h3 className="font-semibold">Localisation</h3>
              </div>
              <p className="text-base-content/80">
                {artistProfile.profile.location}
              </p>
              {artistProfile.travelRadius && (
                <p className="text-sm text-base-content/60 mt-1">
                  Rayon de déplacement : {artistProfile.travelRadius}km
                </p>
              )}
            </div>
          </div>
        )}

        {/* Spécialités */}
        {artistProfile.specialties && artistProfile.specialties.length > 0 && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-success" />
                <h3 className="font-semibold">Spécialités</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {artistProfile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="badge badge-success badge-outline"
                  >
                    {getSpecialtyLabel(specialty)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Galerie photos aperçu */}
      {artistProfile.portfolio?.photos && artistProfile.portfolio.photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-4">Aperçu du portfolio</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artistProfile.portfolio.photos.slice(0, 4).map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
            {artistProfile.portfolio.photos.length > 4 && (
              <p className="text-center text-sm text-base-content/60 mt-4">
                +{artistProfile.portfolio.photos.length - 4} autres photos dans l'onglet Portfolio
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Call to action pour venues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20"
      >
        <div className="card-body text-center">
          <h3 className="text-xl font-semibold mb-2">
            Intéressé(e) par cet artiste ?
          </h3>
          <p className="text-base-content/70 mb-4">
            Découvrez plus d'informations dans les onglets ci-dessus, ou contactez directement l'artiste.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <div className="badge badge-outline">Professionnel</div>
            <div className="badge badge-outline">Disponible</div>
            <div className="badge badge-outline">Expérimenté</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};