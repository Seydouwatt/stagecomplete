import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Play,
  Music,
  ExternalLink,
  X,
  ZoomIn,
  Volume2,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface PortfolioTabProps {
  artistProfile: PublicArtistProfile;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({ artistProfile }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "photos" | "videos" | "audio">("all");

  // Composant Lightbox pour les images
  const Lightbox = ({ src, onClose }: { src: string; onClose: () => void }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        data-cy="lightbox"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-4xl max-h-[90vh] w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn btn-circle btn-ghost text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={src}
            alt="Portfolio"
            className="w-full h-full object-contain rounded-lg"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Fonction pour extraire l'ID YouTube
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Fonction pour extraire l'ID SoundCloud
  const getSoundCloudEmbed = (url: string) => {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
  };

  const categories = [
    { id: "all", label: "Tout", icon: <Camera className="w-4 h-4" /> },
    { id: "photos", label: "Photos", icon: <Camera className="w-4 h-4" /> },
    { id: "videos", label: "Vidéos", icon: <Play className="w-4 h-4" /> },
    { id: "audio", label: "Audio", icon: <Music className="w-4 h-4" /> },
  ];

  const hasContent =
    (artistProfile.portfolio?.photos && artistProfile.portfolio.photos.length > 0) ||
    (artistProfile.portfolio?.videos && artistProfile.portfolio.videos.length > 0) ||
    (artistProfile.portfolio?.audio && artistProfile.portfolio.audio.length > 0) ||
    (artistProfile.socialLinks && Object.values(artistProfile.socialLinks).some(link => link));

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Camera className="w-16 h-16 text-base-content/30 mb-4" />
        <h3 className="text-xl font-semibold text-base-content/70 mb-2">
          Portfolio en cours de construction
        </h3>
        <p className="text-base-content/50 max-w-md">
          L'artiste n'a pas encore ajouté de contenu à son portfolio.
          Revenez bientôt pour découvrir ses créations !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-cy="portfolio-section">
      {/* Filtres de catégorie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`btn btn-sm gap-2 ${
              selectedCategory === category.id ? "btn-primary" : "btn-outline"
            }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Galerie photos */}
      {artistProfile.portfolio?.photos && artistProfile.portfolio.photos.length > 0 &&
       (selectedCategory === "all" || selectedCategory === "photos") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Camera className="w-5 h-5 text-primary" />
              Galerie photos ({artistProfile.portfolio.photos.length})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-cy="portfolio-photos">
              {artistProfile.portfolio.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(photo)}
                  data-cy="portfolio-photo"
                >
                  <img
                    src={photo}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Vidéos */}
      {artistProfile.portfolio?.videos && artistProfile.portfolio.videos.length > 0 &&
       (selectedCategory === "all" || selectedCategory === "videos") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Play className="w-5 h-5 text-secondary" />
              Vidéos ({artistProfile.portfolio.videos.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artistProfile.portfolio.videos.map((video, index) => {
                const youtubeId = getYouTubeId(video);
                return (
                  <div key={index} className="space-y-2">
                    {youtubeId ? (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title={`Vidéo ${index + 1}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg bg-base-200 flex items-center justify-center">
                        <a
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Voir la vidéo
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Audio */}
      {artistProfile.portfolio?.audio && artistProfile.portfolio.audio.length > 0 &&
       (selectedCategory === "all" || selectedCategory === "audio") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Music className="w-5 h-5 text-accent" />
              Pistes audio ({artistProfile.portfolio.audio.length})
            </h3>

            <div className="space-y-4">
              {artistProfile.portfolio.audio.map((audio, index) => {
                if (audio.includes('soundcloud.com')) {
                  return (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <iframe
                        src={getSoundCloudEmbed(audio)}
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        title={`Audio ${index + 1}`}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-accent" />
                        <span>Piste audio {index + 1}</span>
                      </div>
                      <a
                        href={audio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-accent gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Écouter
                      </a>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Liens vers plateformes */}
      {artistProfile.socialLinks && Object.values(artistProfile.socialLinks).some(link => link) &&
       (selectedCategory === "all" || selectedCategory === "videos" || selectedCategory === "audio") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <ExternalLink className="w-5 h-5 text-info" />
              Plateformes musicales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artistProfile.socialLinks.spotify && (
                <a
                  href={artistProfile.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2 justify-start"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Music className="w-3 h-3 text-white" />
                  </div>
                  Spotify
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              )}

              {artistProfile.socialLinks.soundcloud && (
                <a
                  href={artistProfile.socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2 justify-start"
                >
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Volume2 className="w-3 h-3 text-white" />
                  </div>
                  SoundCloud
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              )}

              {artistProfile.socialLinks.youtube && (
                <a
                  href={artistProfile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2 justify-start"
                >
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white" />
                  </div>
                  YouTube
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              )}

              {artistProfile.socialLinks.website && (
                <a
                  href={artistProfile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2 justify-start"
                >
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 text-white" />
                  </div>
                  Site web
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Message si pas de contenu pour la catégorie sélectionnée */}
      {selectedCategory !== "all" && (
        <div className="text-center py-8">
          <div className="text-base-content/50">
            {selectedCategory === "photos" && (!artistProfile.portfolio?.photos || artistProfile.portfolio.photos.length === 0) && (
              "Aucune photo dans le portfolio pour le moment."
            )}
            {selectedCategory === "videos" && (!artistProfile.portfolio?.videos || artistProfile.portfolio.videos.length === 0) && (
              "Aucune vidéo dans le portfolio pour le moment."
            )}
            {selectedCategory === "audio" && (!artistProfile.portfolio?.audio || artistProfile.portfolio.audio.length === 0) && (
              "Aucune piste audio dans le portfolio pour le moment."
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};