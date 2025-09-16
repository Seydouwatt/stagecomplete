import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
  Music,
  Volume2,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface SocialLinksTabProps {
  artistProfile: PublicArtistProfile;
}

export const SocialLinksTab: React.FC<SocialLinksTabProps> = ({ artistProfile }) => {
  const profileSocialLinks = artistProfile.profile.socialLinks || {};
  const artistSocialLinks = artistProfile.socialLinks || {};

  // Combiner les liens sociaux du profil et de l'artiste
  const allSocialLinks = {
    website: artistProfile.profile.website || artistSocialLinks.website,
    instagram: profileSocialLinks.instagram || artistSocialLinks.instagram,
    facebook: profileSocialLinks.facebook,
    twitter: profileSocialLinks.twitter,
    linkedin: profileSocialLinks.linkedin,
    youtube: profileSocialLinks.youtube || artistSocialLinks.youtube,
    spotify: artistSocialLinks.spotify,
    soundcloud: artistSocialLinks.soundcloud,
  };

  const socialPlatforms = [
    {
      key: "website",
      label: "Site web",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-primary",
      url: allSocialLinks.website,
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      url: allSocialLinks.instagram,
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "bg-blue-600",
      url: allSocialLinks.facebook,
    },
    {
      key: "twitter",
      label: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      color: "bg-sky-500",
      url: allSocialLinks.twitter,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-blue-700",
      url: allSocialLinks.linkedin,
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      color: "bg-red-600",
      url: allSocialLinks.youtube,
    },
    {
      key: "spotify",
      label: "Spotify",
      icon: <Music className="w-5 h-5" />,
      color: "bg-green-500",
      url: allSocialLinks.spotify,
    },
    {
      key: "soundcloud",
      label: "SoundCloud",
      icon: <Volume2 className="w-5 h-5" />,
      color: "bg-orange-500",
      url: allSocialLinks.soundcloud,
    },
  ];

  const activePlatforms = socialPlatforms.filter(platform => platform.url);

  if (activePlatforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Globe className="w-16 h-16 text-base-content/30 mb-4" />
        <h3 className="text-xl font-semibold text-base-content/70 mb-2">
          Aucun réseau social configuré
        </h3>
        <p className="text-base-content/50 max-w-md">
          L'artiste n'a pas encore ajouté de liens vers ses réseaux sociaux ou plateformes musicales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-2xl mb-4">
            <Globe className="w-6 h-6 text-primary" />
            Suivez {artistProfile.profile.name}
          </h2>
          <p className="text-base-content/70">
            Découvrez l'univers de {artistProfile.profile.name} sur ses plateformes préférées.
            Restez connecté pour ne rien manquer de son actualité musicale !
          </p>
        </div>
      </motion.div>

      {/* Grille des réseaux sociaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activePlatforms.map((platform, index) => (
          <motion.a
            key={platform.key}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="card-body p-6 text-center">
              <div className={`w-16 h-16 rounded-full ${platform.color} flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                {platform.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{platform.label}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/60 group-hover:text-primary transition-colors duration-300">
                <span>Visiter</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* Statistiques et engagement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="card-body">
          <h3 className="card-title mb-4">
            <ExternalLink className="w-5 h-5 text-primary" />
            Engagement et communauté
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {activePlatforms.length}
              </div>
              <div className="text-sm text-base-content/70">
                Plateformes actives
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                🌟
              </div>
              <div className="text-sm text-base-content/70">
                Présence vérifiée
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                ⚡
              </div>
              <div className="text-sm text-base-content/70">
                Actif régulièrement
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-base-content/60">
              Suivez {artistProfile.profile.name} pour découvrir ses dernières créations,
              concerts à venir et moments forts de sa carrière artistique.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Plateformes musicales spécifiques */}
      {(allSocialLinks.spotify || allSocialLinks.soundcloud || allSocialLinks.youtube) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Music className="w-5 h-5 text-accent" />
              Écoutez la musique de {artistProfile.profile.name}
            </h3>

            <div className="space-y-4">
              {allSocialLinks.spotify && (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Spotify</p>
                      <p className="text-sm text-base-content/60">Écoutez les morceaux et playlists</p>
                    </div>
                  </div>
                  <a
                    href={allSocialLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-success gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Écouter
                  </a>
                </div>
              )}

              {allSocialLinks.soundcloud && (
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">SoundCloud</p>
                      <p className="text-sm text-base-content/60">Découvrez les créations originales</p>
                    </div>
                  </div>
                  <a
                    href={allSocialLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-warning gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Découvrir
                  </a>
                </div>
              )}

              {allSocialLinks.youtube && (
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">YouTube</p>
                      <p className="text-sm text-base-content/60">Regardez les clips et performances live</p>
                    </div>
                  </div>
                  <a
                    href={allSocialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-error gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Regarder
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};