import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  GlobeAltIcon,
  ShareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { SEOHead } from "../../components/seo/SEOHead";

interface FormData {
  artistName: string;
  contactName: string;
  email: string;
  phone: string;
  artistType: string;
  discipline: string;
  experience: string;
  currentPromotion: string;
  monthlyGigs: string;
  desiredPrice: string;
  mainGoal: string;
}

export const ArtistLandingPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    artistName: "",
    contactName: "",
    email: "",
    phone: "",
    artistType: "",
    discipline: "",
    experience: "",
    currentPromotion: "",
    monthlyGigs: "",
    desiredPrice: "",
    mainGoal: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Intégrer avec backend ou service d'email
      console.log("📊 [ARTIST VALIDATION] Form submitted:", formData);

      // Simuler l'envoi
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Track avec Google Analytics
      if (window.gtag) {
        window.gtag("event", "artist_validation_form_submit", {
          artist_type: formData.artistType,
          discipline: formData.discipline,
          experience: formData.experience,
          main_goal: formData.mainGoal,
        });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Bienvenue dans la communauté !
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Votre demande a été reçue. Nous allons créer votre profil et vous
            envoyer vos accès dans les <strong>24h</strong>.
          </p>
          <div className="bg-purple-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-purple-900 mb-3">
              Ce que vous allez recevoir :
            </h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Votre URL personnalisée (ex: stagecomplete.app/votre-nom)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  Portfolio professionnel avec photos/vidéos
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Partage 1-clic réseaux sociaux</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Visibilité auprès de 100+ venues partenaires</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="font-bold text-xl mb-2">🎁 Bonus Early Adopter</h3>
            <p className="text-purple-100">
              En tant que testeur beta, vous bénéficiez de <strong>6 mois gratuits</strong> de
              fonctionnalités premium (valeur 54€) !
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            📧 Surveillez votre boîte mail (et vos spams) pour l'email d'activation
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SEOHead
        title="Artistes : Créez votre vitrine professionnelle gratuite | StageComplete"
        description="Musiciens, comédiens, danseurs : portfolio en ligne gratuit avec URL personnalisée. Visible par 100+ venues. Partagez en 1 clic sur les réseaux."
        keywords="profil artiste, portfolio musicien, vitrine artiste, booking artiste, promotion artiste"
        url="/artistes/validation"
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">
                100% GRATUIT - Offre de lancement
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Votre vitrine artistique
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                professionnelle en 5 min
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Musiciens, comédiens, danseurs : créez votre profil complet avec
              <strong> URL personnalisée, portfolio, partage réseaux sociaux</strong>.
              100% gratuit, toujours.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: GlobeAltIcon,
                  text: "URL personnalisée (stagecomplete.app/votre-nom)",
                },
                {
                  icon: ShareIcon,
                  text: "Partage 1-clic Instagram, Facebook, WhatsApp",
                },
                {
                  icon: ChartBarIcon,
                  text: "Analytics : vues profil, clics, demandes venues",
                },
                {
                  icon: StarIcon,
                  text: "Visible par 100+ venues partenaires actives",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">500+ artistes actifs</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'ai reçu 3 propositions de bars en 1 semaine. Mon URL
                Instagram marche du feu !" - Jazz Quartet Paris
              </p>
            </div>
          </motion.div>

          {/* Right: Qualification Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Créer mon profil gratuit
              </h2>
              <p className="text-gray-600">
                Accès beta - Profil créé en 24h
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Artist Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'artiste / Groupe *
                </label>
                <input
                  type="text"
                  name="artistName"
                  required
                  value={formData.artistName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Jazz Quartet Paris"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom (contact) *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Sophie Martin"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              {/* Artist Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'artiste *
                </label>
                <select
                  name="artistType"
                  required
                  value={formData.artistType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="solo">Solo / Artiste individuel</option>
                  <option value="duo">Duo</option>
                  <option value="band">Groupe / Band (3-5 membres)</option>
                  <option value="ensemble">Ensemble (6+ membres)</option>
                </select>
              </div>

              {/* Discipline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discipline principale *
                </label>
                <select
                  name="discipline"
                  required
                  value={formData.discipline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="musique">Musique (tous styles)</option>
                  <option value="theatre">Théâtre / One-man show</option>
                  <option value="standup">Stand-up / Humour</option>
                  <option value="danse">Danse / Chorégraphie</option>
                  <option value="cirque">Arts du cirque</option>
                  <option value="magie">Magie / Illusionnisme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expérience professionnelle *
                </label>
                <select
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="debutant">Débutant (moins d'1 an)</option>
                  <option value="intermediaire">Intermédiaire (1-3 ans)</option>
                  <option value="confirme">Confirmé (3-5 ans)</option>
                  <option value="expert">Expert (5+ ans)</option>
                </select>
              </div>

              {/* Current Promotion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment vous faites-vous connaître actuellement ? *
                </label>
                <select
                  name="currentPromotion"
                  required
                  value={formData.currentPromotion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="social">Réseaux sociaux uniquement</option>
                  <option value="website">Site web personnel</option>
                  <option value="platforms">Autres plateformes booking</option>
                  <option value="network">Réseau / Bouche à oreille</option>
                  <option value="agent">Agence / Agent artistique</option>
                  <option value="none">Je ne fais pas de promo active</option>
                </select>
              </div>

              {/* Monthly Gigs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de dates par mois actuellement *
                </label>
                <select
                  name="monthlyGigs"
                  required
                  value={formData.monthlyGigs}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="0">0 (je recherche mes premières dates)</option>
                  <option value="1-2">1-2 par mois</option>
                  <option value="3-5">3-5 par mois</option>
                  <option value="6-10">6-10 par mois</option>
                  <option value="10+">Plus de 10 par mois</option>
                </select>
              </div>

              {/* Desired Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cachet souhaité par prestation *
                </label>
                <select
                  name="desiredPrice"
                  required
                  value={formData.desiredPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="0-200">0-200€</option>
                  <option value="200-500">200-500€</option>
                  <option value="500-1000">500-1000€</option>
                  <option value="1000-2000">1000-2000€</option>
                  <option value="2000+">Plus de 2000€</option>
                  <option value="negociable">Variable / Négociable</option>
                </select>
              </div>

              {/* Main Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre objectif principal *
                </label>
                <select
                  name="mainGoal"
                  required
                  value={formData.mainGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="visibility">
                    Gagner en visibilité / me faire connaître
                  </option>
                  <option value="bookings">
                    Obtenir plus de dates de spectacle
                  </option>
                  <option value="professionalize">
                    Professionnaliser mon image
                  </option>
                  <option value="network">
                    Élargir mon réseau professionnel
                  </option>
                  <option value="income">
                    Augmenter mes revenus artistiques
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Créer mon profil gratuit
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                🎁 Bonus early adopter : 6 mois de fonctionnalités premium offertes (valeur 54€)
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tout ce dont vous avez besoin pour briller
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Portfolio complet",
                description:
                  "Photos, vidéos, bio, genres, tarifs - tout en un seul endroit",
              },
              {
                icon: "🔗",
                title: "URL personnalisée",
                description:
                  "Votre lien unique à partager partout (stagecomplete.app/vous)",
              },
              {
                icon: "📱",
                title: "Partage 1-clic",
                description:
                  "Boutons Instagram, Facebook, WhatsApp intégrés",
              },
              {
                icon: "📊",
                title: "Analytics gratuits",
                description:
                  "Vues profil, clics, demandes venues en temps réel",
              },
              {
                icon: "🎯",
                title: "Visibilité venues",
                description:
                  "Apparaissez dans les recherches de 100+ établissements",
              },
              {
                icon: "💬",
                title: "Messagerie directe",
                description:
                  "Les venues vous contactent directement via la plateforme",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-purple-100">Artistes déjà inscrits</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-purple-100">Gratuit, toujours</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <p className="text-purple-100">Profil activé en moins de</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
