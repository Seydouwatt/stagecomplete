import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  CheckCircle,
  AlertCircle,
  MapPin,
  Zap,
  Monitor,
  Mic,
  Volume2,
  Truck,
} from "lucide-react";
import type { PublicArtistProfile } from "../../../types";

interface TechnicalSheetTabProps {
  artistProfile: PublicArtistProfile;
}

export const TechnicalSheetTab: React.FC<TechnicalSheetTabProps> = ({ artistProfile }) => {
  const hasEquipment = artistProfile.equipment && artistProfile.equipment.length > 0;
  const hasRequirements = artistProfile.requirements && artistProfile.requirements.length > 0;
  const hasTravelRadius = artistProfile.travelRadius;

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
          <h3 className="font-semibold">Accès venue uniquement</h3>
          <div className="text-sm">
            Ces informations techniques sont réservées aux venues connectées pour faciliter l'organisation d'événements.
          </div>
        </div>
      </motion.div>

      {/* Équipements disponibles */}
      {hasEquipment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <CheckCircle className="w-5 h-5 text-success" />
              Équipements disponibles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artistProfile.equipment!.map((equipment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm font-medium">{equipment}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Avantages pour la venue
              </h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Réduction des coûts de location d'équipement</li>
                <li>• Installation plus rapide et efficace</li>
                <li>• Équipement maîtrisé par l'artiste</li>
                <li>• Moins de coordination technique nécessaire</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Équipements requis */}
      {hasRequirements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Settings className="w-5 h-5 text-warning" />
              Prérequis techniques
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artistProfile.requirements!.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{requirement}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-info" />
                À prévoir par la venue
              </h4>
              <p className="text-sm text-base-content/70">
                Ces éléments techniques sont nécessaires pour assurer une prestation optimale.
                Merci de vérifier la disponibilité avant confirmation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informations de déplacement */}
      {hasTravelRadius && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-base-100 shadow-lg"
        >
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Truck className="w-5 h-5 text-info" />
              Conditions de déplacement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Rayon d'intervention
                </h4>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-primary">
                    {artistProfile.travelRadius}km
                  </div>
                  <div className="text-sm text-base-content/70">
                    depuis {artistProfile.profile.location}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Frais de déplacement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>0 - 50km :</span>
                    <span className="font-medium text-success">Inclus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50 - {artistProfile.travelRadius}km :</span>
                    <span className="font-medium">À négocier</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Au-delà de {artistProfile.travelRadius}km :</span>
                    <span className="font-medium text-warning">Sur devis</span>
                  </div>
                </div>
              </div>
            </div>

            {artistProfile.priceDetails?.conditions && (
              <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
                <h4 className="font-medium mb-2">Conditions particulières</h4>
                <p className="text-sm text-base-content/80">
                  {artistProfile.priceDetails.conditions}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recommandations techniques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
      >
        <div className="card-body">
          <h3 className="card-title mb-6">
            <Volume2 className="w-5 h-5 text-primary" />
            Recommandations générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Mic className="w-4 h-4 text-secondary" />
                Configuration audio
              </h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Système de sonorisation adapté à la taille de la salle</li>
                <li>• Micros disponibles selon le nombre de membres</li>
                <li>• Table de mixage avec retours moniteurs</li>
                <li>• Test son 30 minutes avant le début</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-accent" />
                Espace scénique
              </h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Scène ou espace de performance adapté</li>
                <li>• Éclairage de base pour mise en valeur</li>
                <li>• Accès facile pour le matériel</li>
                <li>• Vestiaire ou espace de préparation</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-base-content/60">
              💡 Pour toute question technique spécifique, n'hésitez pas à contacter directement l'artiste
              pour discuter des détails et adapter la configuration à votre venue.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contact technique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title justify-center mb-4">
              <Settings className="w-5 h-5 text-info" />
              Questions techniques ?
            </h3>
            <p className="text-base-content/70 mb-4">
              Notre équipe technique est disponible pour discuter de tous les aspects pratiques de la prestation.
            </p>
            <button className="btn btn-primary gap-2">
              <Mic className="w-4 h-4" />
              Contacter pour les détails techniques
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};