import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  ClockIcon,
  GiftIcon
} from "@heroicons/react/24/outline";

const QuickSignup: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge urgence/exclusivité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6"
          >
            <GiftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              Rejoins les premiers artistes de la communauté
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Prêt à booster ta visibilité ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-purple-100 text-xl mb-12 max-w-2xl mx-auto"
          >
            Rejoins des centaines d'artistes qui utilisent déjà StageComplete
            pour développer leur présence artistique et toucher plus de fans.
          </motion.p>

          {/* Avantages rapides */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">5 minutes</div>
                <div className="text-purple-200 text-sm">pour créer ta fiche</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <GiftIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">100% gratuit</div>
                <div className="text-purple-200 text-sm">sans frais cachés</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Résultat immédiat</div>
                <div className="text-purple-200 text-sm">fiche prête à partager</div>
              </div>
            </div>
          </motion.div>

          {/* CTA final */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/register?from=artist"
              className="bg-white text-purple-600 px-10 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
            >
              <SparklesIcon className="w-6 h-6" />
              Créer ma fiche artiste maintenant
            </Link>
          </motion.div>

          {/* Social proof simple */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-200 mt-8 text-sm"
          >
            ⭐ Déjà 500+ artistes nous font confiance
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default QuickSignup;