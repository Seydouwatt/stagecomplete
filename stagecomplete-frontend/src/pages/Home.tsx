import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { PublicSearchBar } from '../components/public/PublicSearchBar';
import { FeaturedArtists } from '../components/public/FeaturedArtists';
import { PublicStats } from '../components/public/PublicStats';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/api/placeholder/100/100')] bg-repeat opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8"
            >
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">La plateforme de découverte d'artistes</span>
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Découvrez l'artiste
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                parfait pour vous
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              La plus grande communauté d'artistes professionnels.
              Trouvez le talent idéal près de chez vous ou partagez votre passion avec le monde entier.
            </motion.p>

            {/* Barre de recherche */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <PublicSearchBar
                className="max-w-2xl mx-auto"
                placeholder="Jazz, Rock, Paris, Lyon..."
                size="lg"
              />
            </motion.div>

            {/* Suggestions populaires */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <p className="text-gray-300 mb-4">Recherches populaires :</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Jazz Paris', 'Rock Lyon', 'Solo Marseille', 'Groupe Toulouse', 'Folk Nice'].map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="bg-white text-purple-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                <UserGroupIcon className="w-5 h-5" />
                Créer mon profil d'artiste
              </Link>

              <Link
                to="/directory"
                className="bg-purple-600/20 backdrop-blur-sm border border-purple-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600/30 transition-all duration-200 flex items-center gap-2"
              >
                <GlobeAltIcon className="w-5 h-5" />
                Découvrir les artistes
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <PublicStats />
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FeaturedArtists />
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trois étapes simples pour commencer votre aventure musicale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Créez votre profil",
                description: "Renseignez vos informations artistiques, ajoutez vos photos et décrivez votre univers musical",
                icon: UserGroupIcon,
                color: "from-blue-400 to-blue-600"
              },
              {
                step: "2",
                title: "Publiez votre vitrine",
                description: "Obtenez une URL personnalisée et partagez votre profil sur les réseaux sociaux",
                icon: GlobeAltIcon,
                color: "from-purple-400 to-purple-600"
              },
              {
                step: "3",
                title: "Soyez découvert",
                description: "Apparaissez dans les recherches publiques et connectez-vous avec de nouveaux fans",
                icon: SparklesIcon,
                color: "from-green-400 to-green-600"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Étape {item.step} : {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à partager votre talent ?
          </h2>
          <p className="text-purple-100 text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'artistes qui utilisent déjà StageComplete
            pour développer leur carrière musicale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Créer mon profil gratuitement
            </Link>

            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200 flex items-center justify-center gap-2">
              <PlayCircleIcon className="w-5 h-5" />
              Voir la démo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;