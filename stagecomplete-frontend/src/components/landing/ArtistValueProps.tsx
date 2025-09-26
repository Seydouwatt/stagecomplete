import React from "react";
import { motion } from "framer-motion";
import {
  GiftIcon,
  LinkIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

const ArtistValueProps: React.FC = () => {
  const benefits = [
    {
      icon: GiftIcon,
      title: "100% Gratuit",
      description: "Fiche complète sans frais cachés ni abonnement obligatoire",
      color: "from-green-400 to-green-600"
    },
    {
      icon: LinkIcon,
      title: "URL Personnalisée",
      description: "stagecomplete.fr/artist/ton-nom - Ta propre adresse web",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: ShareIcon,
      title: "Partage Facile",
      description: "Optimisé pour tous tes réseaux sociaux et WhatsApp",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: MagnifyingGlassIcon,
      title: "SEO Optimisé",
      description: "Sois trouvé facilement par tes fans sur Google",
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: CameraIcon,
      title: "Portfolio Illimité",
      description: "4 photos gratuites, liens streaming et réseaux sociaux",
      color: "from-pink-400 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Pourquoi choisir StageComplete ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Tout ce dont tu as besoin pour créer une présence professionnelle
            qui impressionne tes fans et booste ta visibilité.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                <benefit.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Section bonus - Ce que tu obtiens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            En 5 minutes, tu obtiens :
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Une fiche artiste professionnelle</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Ton URL personnalisée</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Portfolio de 4 photos</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Liens vers tous tes réseaux</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Référencement Google automatique</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Partage optimisé réseaux sociaux</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistValueProps;