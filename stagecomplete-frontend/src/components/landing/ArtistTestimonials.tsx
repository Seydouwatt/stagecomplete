import React from "react";
import { motion } from "framer-motion";
import { StarIcon, MusicalNoteIcon, MicrophoneIcon, SparklesIcon } from "@heroicons/react/24/solid";

const ArtistTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Marie L.",
      role: "Chanteuse Folk",
      avatar: "👩‍🎤",
      quote: "Ma fiche StageComplete cartonne sur mes réseaux ! Mes fans adorent avoir toutes mes infos au même endroit.",
      rating: 5,
      genre: "Folk",
      icon: MusicalNoteIcon
    },
    {
      name: "Alex B.",
      role: "Beatboxer",
      avatar: "🎤",
      quote: "Enfin un profil à la hauteur de ma musique ! L'URL personnalisée fait vraiment pro.",
      rating: 5,
      genre: "Hip-Hop",
      icon: MicrophoneIcon
    },
    {
      name: "Troupe Luna",
      role: "Théâtre",
      avatar: "🎭",
      quote: "Super facile à créer, et maintenant nos spectateurs nous trouvent sur Google grâce au SEO !",
      rating: 5,
      genre: "Théâtre",
      icon: SparklesIcon
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Ils ont créé leur fiche et adorent !
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Découvre ce que disent les artistes qui utilisent déjà StageComplete
            pour booster leur visibilité.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Icône genre */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <testimonial.icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex gap-1 mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {testimonial.role} • {testimonial.genre}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Artistes inscrits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                <div className="text-gray-600">Genres artistiques</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">5 min</div>
                <div className="text-gray-600">Temps moyen de création</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtistTestimonials;