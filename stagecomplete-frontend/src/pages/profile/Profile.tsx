import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Edit, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import { ProfileCard } from "../../components/profile";

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Erreur</h1>
          <p className="text-base-content/70 mt-2">
            Impossible de charger les informations du profil.
          </p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditing(true);
    // TODO: Implémenter la modal/page d'édition du profil
    console.log("Édition du profil - À implémenter");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* En-tête de page */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-base-content">Mon Profil</h1>
          <p className="text-base-content/60 mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="flex gap-3">
          {/* Bouton retour dashboard */}
          <Link
            to="/dashboard"
            className="btn btn-outline btn-sm gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Bouton paramètres */}
          <Link
            to="/settings"
            className="btn btn-outline btn-sm gap-2"
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil principal */}
        <div className="lg:col-span-2">
          <ProfileCard
            user={user}
            onEdit={handleEditProfile}
            showEditButton={true}
          />
        </div>

        {/* Sidebar avec actions rapides */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body p-6">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleEditProfile}
                  className="btn btn-primary btn-sm w-full gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Éditer le profil
                </button>

                {user.role === "ARTIST" && (
                  <Link
                    to="/artist/portfolio"
                    className="btn btn-outline btn-sm w-full"
                  >
                    Gérer le portfolio
                  </Link>
                )}

                {user.role === "VENUE" && (
                  <Link
                    to="/venue/profile"
                    className="btn btn-outline btn-sm w-full"
                  >
                    Profil venue
                  </Link>
                )}

                <Link
                  to="/settings"
                  className="btn btn-ghost btn-sm w-full"
                >
                  Paramètres
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Statistiques profil */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-lg"
          >
            <div className="card-body p-6">
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Vues du profil</span>
                  <span className="font-semibold">-</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Messages reçus</span>
                  <span className="font-semibold">-</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">
                    {user.role === "ARTIST" ? "Bookings" : "Événements"}
                  </span>
                  <span className="font-semibold">-</span>
                </div>

                <div className="text-xs text-base-content/50 text-center pt-2 border-t border-base-300">
                  Statistiques bientôt disponibles
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badge profil */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20"
          >
            <div className="card-body p-6 text-center">
              <div className="text-4xl mb-2">
                {user.role === "ARTIST" ? "🎭" : "🎪"}
              </div>
              <h3 className="font-semibold">
                {user.role === "ARTIST" ? "Artiste" : "Venue"} Premium
              </h3>
              <p className="text-sm text-base-content/60 mt-1">
                Accès complet à toutes les fonctionnalités
              </p>
              <div className="badge badge-primary mt-3">Actif</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section aide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-base-200 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-2">💡 Conseils pour optimiser votre profil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/70">
          <div>
            <h4 className="font-medium text-base-content mb-1">Photo de profil</h4>
            <p>Utilisez une photo professionnelle et récente pour augmenter votre crédibilité.</p>
          </div>
          <div>
            <h4 className="font-medium text-base-content mb-1">Biographie</h4>
            <p>Rédigez une bio engageante qui met en valeur votre expérience et votre style.</p>
          </div>
          <div>
            <h4 className="font-medium text-base-content mb-1">Informations de contact</h4>
            <p>Assurez-vous que vos informations de contact sont à jour et accessibles.</p>
          </div>
          <div>
            <h4 className="font-medium text-base-content mb-1">Complétion</h4>
            <p>Un profil complété à 100% améliore considérablement votre visibilité.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};