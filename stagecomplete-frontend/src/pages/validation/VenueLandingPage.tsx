import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { SEOHead } from "../../components/seo/SEOHead";

interface FormData {
  venueName: string;
  contactName: string;
  email: string;
  phone: string;
  venueType: string;
  currentBookingMethod: string;
  averageBookingsPerMonth: string;
  mainPainPoint: string;
  maxBudget: string;
}

export const VenueLandingPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    venueName: "",
    contactName: "",
    email: "",
    phone: "",
    venueType: "",
    currentBookingMethod: "",
    averageBookingsPerMonth: "",
    mainPainPoint: "",
    maxBudget: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Intégrer avec votre backend ou service d'email
      console.log("📊 [VENUE VALIDATION] Form submitted:", formData);

      // Simuler l'envoi (remplacer par vrai API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Track avec Google Analytics si configuré
      if (window.gtag) {
        window.gtag("event", "venue_validation_form_submit", {
          venue_type: formData.venueType,
          bookings_per_month: formData.averageBookingsPerMonth,
          pain_point: formData.mainPainPoint,
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Merci pour votre intérêt !
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Nous avons bien reçu vos informations. Un membre de notre équipe
            vous contactera dans les <strong>24-48h</strong> pour discuter de
            vos besoins spécifiques.
          </p>
          <div className="bg-purple-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-purple-900 mb-3">
              En attendant, découvrez :
            </h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Plus de 500 artistes vérifiés disponibles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  Tous styles : Jazz, Rock, Théâtre, Stand-up, Danse, etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Réservation en 3 clics sans intermédiaire</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            📧 Vérifiez votre boîte mail (et vos spams) pour notre email de
            confirmation
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <SEOHead
        title="Venues : Trouvez des artistes vérifiés en 5 minutes | StageComplete"
        description="Bars, théâtres, clubs : réservez des artistes professionnels sans commission. Accès à +500 profils vérifiés. Essai gratuit 30 jours."
        keywords="booking artistes, réservation spectacles, programmation culturelle, artistes bars, booking théâtre"
        url="/venues/validation"
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
                Offre de lancement - 30 jours gratuits
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Trouvez l'artiste parfait
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                en 5 minutes chrono
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bars, théâtres, clubs : accédez à +500 artistes vérifiés (musique,
              théâtre, stand-up, danse). <strong>0% de commission</strong> sur
              les réservations.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: UserGroupIcon,
                  text: "500+ artistes professionnels vérifiés",
                },
                {
                  icon: CurrencyEuroIcon,
                  text: "Économisez 15-30% vs agences traditionnelles",
                },
                {
                  icon: ClockIcon,
                  text: "Réponse moyenne en moins de 2 heures",
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
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white"
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
                  <p className="text-sm text-gray-600">Note moyenne 4.8/5</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Nous avons trouvé 3 super groupes en 2 jours. Fini les mails
                sans réponse !" - Le Sunset, Paris 75001
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
              <BuildingOfficeIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Accès prioritaire beta
              </h2>
              <p className="text-gray-600">
                Remplissez ce formulaire pour être parmi les premiers testeurs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Venue Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de votre établissement *
                </label>
                <input
                  type="text"
                  name="venueName"
                  required
                  value={formData.venueName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Le Jazz Club"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom *
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Marie Dupont"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email professionnel *
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

              {/* Venue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'établissement *
                </label>
                <select
                  name="venueType"
                  required
                  value={formData.venueType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="bar">Bar / Café-concert</option>
                  <option value="theatre">Théâtre</option>
                  <option value="club">Club / Discothèque</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="salle-spectacle">Salle de spectacle</option>
                  <option value="hotel">Hôtel</option>
                  <option value="evenementiel">Agence événementielle</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Current Booking Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment trouvez-vous des artistes actuellement ? *
                </label>
                <select
                  name="currentBookingMethod"
                  required
                  value={formData.currentBookingMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="agency">Agences de booking</option>
                  <option value="network">Réseau personnel</option>
                  <option value="social">Réseaux sociaux</option>
                  <option value="email">Emails directs aux artistes</option>
                  <option value="platform">Autres plateformes</option>
                  <option value="none">
                    Je ne programme pas régulièrement
                  </option>
                </select>
              </div>

              {/* Average Bookings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de spectacles/concerts par mois *
                </label>
                <select
                  name="averageBookingsPerMonth"
                  required
                  value={formData.averageBookingsPerMonth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="0">Pas encore de programmation régulière</option>
                  <option value="1-2">1-2 par mois</option>
                  <option value="3-5">3-5 par mois</option>
                  <option value="6-10">6-10 par mois</option>
                  <option value="10+">Plus de 10 par mois</option>
                </select>
              </div>

              {/* Main Pain Point */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre plus grosse difficulté ? *
                </label>
                <select
                  name="mainPainPoint"
                  required
                  value={formData.mainPainPoint}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="finding">
                    Trouver des artistes disponibles
                  </option>
                  <option value="quality">
                    Vérifier la qualité/professionnalisme
                  </option>
                  <option value="communication">
                    Communication lente (emails sans réponse)
                  </option>
                  <option value="pricing">
                    Négocier les tarifs / commissions élevées
                  </option>
                  <option value="contracts">Gestion administrative/contrats</option>
                  <option value="variety">
                    Manque de diversité dans les styles
                  </option>
                </select>
              </div>

              {/* Max Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget mensuel pour une plateforme de booking *
                </label>
                <select
                  name="maxBudget"
                  required
                  value={formData.maxBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="0">0€ (uniquement gratuit)</option>
                  <option value="1-29">1-29€</option>
                  <option value="30-49">30-49€</option>
                  <option value="50-79">50-79€</option>
                  <option value="80-99">80-99€</option>
                  <option value="100+">100€ et plus</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Obtenir mon accès prioritaire
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                En soumettant ce formulaire, vous acceptez d'être contacté par
                notre équipe. Aucune carte bancaire requise.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <p className="text-gray-600">Artistes vérifiés disponibles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">0%</div>
              <p className="text-gray-600">Commission sur les réservations</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                &lt;2h
              </div>
              <p className="text-gray-600">Temps de réponse moyen</p>
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
