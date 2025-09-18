import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Clock,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface PricingTabProps {
  artistProfile: PublicArtistProfile;
}

export const PricingTab: React.FC<PricingTabProps> = ({ artistProfile }) => {
  const hasPriceDetails =
    artistProfile.priceDetails &&
    Object.values(artistProfile.priceDetails).some((v) => v);
  const hasPriceRange = artistProfile.priceRange;

  const eventTypes = [
    {
      key: "concert",
      label: "Concert public",
      icon: <Star className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      description: "Événements publics, festivals, salles de concert",
      price: artistProfile.priceDetails?.concert,
    },
    {
      key: "private",
      label: "Événement privé",
      icon: <Users className="w-5 h-5" />,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
      description: "Soirées privées, anniversaires, réceptions",
      price: artistProfile.priceDetails?.private,
    },
    {
      key: "wedding",
      label: "Mariage",
      icon: <Calendar className="w-5 h-5" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
      description: "Cérémonies, vin d'honneur, soirées de mariage",
      price: artistProfile.priceDetails?.wedding,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Avertissement accès restreint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="alert alert-info"
      >
        <AlertCircle className="w-5 h-5" />
        <div>
          <h3 className="font-semibold">Informations confidentielles</h3>
          <div className="text-sm">
            Les tarifs sont réservés aux venues connectées. Ces prix sont
            indicatifs et peuvent varier selon les spécificités de votre
            événement.
          </div>
        </div>
      </motion.div>

      {/* Fourchette de prix générale */}
      {hasPriceRange && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="card-body text-center">
            <h3 className="card-title justify-center text-2xl mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
              Fourchette de prix
            </h3>
            <div className="text-4xl font-bold text-primary mb-2">
              {artistProfile.priceRange}
            </div>
            <p className="text-base-content/70">
              Prix indicatifs variables selon le type d'événement, la durée et
              les conditions
            </p>
          </div>
        </motion.div>
      )}

      {/* Tarifs détaillés par type d'événement */}
      {hasPriceDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-center mb-6">
            Tarifs par type d'événement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventTypes.map((eventType, index) => (
              <motion.div
                key={eventType.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`card ${eventType.bgColor} border ${eventType.borderColor} shadow-lg`}
              >
                <div className="card-body p-6 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 ${eventType.bgColor.replace(
                      "/10",
                      "/20"
                    )} rounded-full flex items-center justify-center`}
                  >
                    <span className={eventType.color}>{eventType.icon}</span>
                  </div>

                  <h4 className="font-bold text-lg mb-2">{eventType.label}</h4>

                  <p className="text-sm text-base-content/70 mb-4">
                    {eventType.description}
                  </p>

                  {eventType.price ? (
                    <div className="text-2xl font-bold mb-2">
                      {eventType.price}€
                    </div>
                  ) : (
                    <div className="text-lg font-medium text-base-content/70 mb-2">
                      Sur devis
                    </div>
                  )}

                  <div className="text-xs text-base-content/50">
                    Prix indicatif hors options
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conditions et inclus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Ce qui est inclus */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <CheckCircle className="w-5 h-5 text-success" />
              Inclus dans la prestation
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">Performance artistique complète</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Équipements personnels de l'artiste
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">Installation et configuration</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">Répétition et test son</span>
              </li>
              {artistProfile.travelRadius && (
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Déplacement jusqu'à 50km inclus
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Options et suppléments */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <Info className="w-5 h-5 text-info" />
              Options supplémentaires
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Prolongation</div>
                  <div className="text-base-content/70">
                    +150€/heure supplémentaire
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Déplacement longue distance</div>
                  <div className="text-base-content/70">
                    0,50€/km au-delà de 50km
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Musiciens supplémentaires</div>
                  <div className="text-base-content/70">
                    Sur demande selon formation
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Dates particulières</div>
                  <div className="text-base-content/70">
                    Majorations weekend/jours fériés
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Conditions particulières */}
      {artistProfile.priceDetails?.conditions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-4">
              <AlertCircle className="w-5 h-5 text-warning" />
              Conditions particulières
            </h3>
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-base-content/80">
                {artistProfile.priceDetails.conditions}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informations de facturation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body">
          <h3 className="card-title mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            Modalités de paiement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Conditions de règlement</h4>
              <ul className="text-sm text-base-content/70 space-y-2">
                <li>• Acompte de 30% à la réservation</li>
                <li>• Solde le jour de la prestation</li>
                <li>• Paiement par virement ou chèque</li>
                <li>• TVA applicable selon statut</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Politique d'annulation</h4>
              <ul className="text-sm text-base-content/70 space-y-2">
                <li>• Gratuite jusqu'à 30 jours avant</li>
                <li>• 50% de pénalité entre 30 et 7 jours</li>
                <li>• 100% en dessous de 7 jours</li>
                <li>• Cas de force majeure examinés</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="card bg-gradient-to-r from-primary to-secondary text-white">
          <div className="card-body">
            <h3 className="card-title justify-center text-xl mb-4">
              Prêt à réserver {artistProfile.profile.displayName} ?
            </h3>
            <p className="mb-6 opacity-90">
              Contactez-nous pour discuter de votre projet et obtenir un devis
              personnalisé adapté à vos besoins spécifiques.
            </p>
            <button className="btn btn-white gap-2">
              <DollarSign className="w-4 h-4" />
              Demander un devis personnalisé
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
