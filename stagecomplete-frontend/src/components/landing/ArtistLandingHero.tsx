import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  GlobeAltIcon,
  ShareIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

const ArtistLandingHero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPHBvbHlnb24gcG9pbnRzPSIwIDQwIDQwIDQwIDQwIDAgMCAwIi8+CjwvZz4KPHN2Zz4=')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8"
          >
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              100% gratuit pour les artistes
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Ta fiche artiste.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Ton style. Tes fans.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Crée ta vitrine artistique professionnelle en 5 minutes.
            Partage ton univers, booste ta visibilité, impressionne tes fans.
          </motion.p>

          {/* Value propositions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { icon: GlobeAltIcon, text: "URL personnalisée" },
              { icon: ShareIcon, text: "Partage facile" },
              { icon: CameraIcon, text: "Portfolio illimité" },
              { icon: SparklesIcon, text: "SEO optimisé" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80">
                <item.icon className="w-5 h-5 text-purple-300" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/register?from=artist"
              className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Créer ma fiche gratuite
            </Link>

            <Link
              to="/artistes/jazz" // Lien vers exemple d'artiste existant
              className="text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
              <GlobeAltIcon className="w-5 h-5" />
              Voir des exemples
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ArtistLandingHero;