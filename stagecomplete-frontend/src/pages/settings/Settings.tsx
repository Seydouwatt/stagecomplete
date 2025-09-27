import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "../../stores/useToastStore";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, deleteAccount, isLoading } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText !== "SUPPRIMER") {
      toast.error("Veuillez taper 'SUPPRIMER' pour confirmer");
      return;
    }

    if (!currentPassword.trim()) {
      toast.error("Veuillez saisir votre mot de passe actuel");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccount(currentPassword);
      toast.success("Votre compte a été supprimé avec succès");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setConfirmationText("");
      setCurrentPassword("");
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setConfirmationText("");
    setCurrentPassword("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmationText("");
    setCurrentPassword("");
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Paramètres</h1>
            <p className="text-base-content/60">
              Gérez vos préférences de compte
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="card bg-base-200 shadow-lg mb-8">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Informations du compte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Nom d'affichage
                  </span>
                </label>
                <div className="text-base-content bg-base-100 p-3 rounded-lg">
                  {user?.profile?.name || "Non défini"}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="text-base-content bg-base-100 p-3 rounded-lg">
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Rôle</span>
                </label>
                <div className="text-base-content bg-base-100 p-3 rounded-lg">
                  {user?.role === "ARTIST" ? "Artiste" : "Venue"}
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Plan</span>
                </label>
                <div className="text-base-content bg-base-100 p-3 rounded-lg">
                  <span
                    className={`badge ${
                      user?.plan === "PREMIUM"
                        ? "badge-primary"
                        : "badge-neutral"
                    }`}
                  >
                    {user?.plan === "PREMIUM" ? "Premium" : "Gratuit"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card bg-error/5 border border-error/20 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl text-error mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Zone de danger
            </h2>
            <div className="bg-base-100 p-6 rounded-lg border border-error/20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-base-content mb-2">
                    Supprimer le compte
                  </h3>
                  <p className="text-base-content/70 mb-4 max-w-2xl">
                    Cette action supprimera définitivement votre compte et
                    toutes les données associées. Cela inclut votre profil, vos
                    membres (si vous êtes un groupe), vos médias et toutes vos
                    informations.
                    <strong className="text-error">
                      {" "}
                      Cette action est irréversible.
                    </strong>
                  </p>
                  <div className="alert alert-warning mb-4">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm">
                      Une fois supprimé, il sera impossible de récupérer votre
                      compte ou vos données.
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={openDeleteModal}
                data-cy="delete-account-button"
                disabled={isLoading}
                className="btn btn-error btn-outline gap-2 hover:btn-error"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-base-100 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-error/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">
                    Confirmer la suppression
                  </h3>
                  <p className="text-base-content/60">
                    Cette action est irréversible
                  </p>
                </div>
              </div>

              <div className="bg-error/5 border border-error/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-base-content mb-3">
                  Vous êtes sur le point de supprimer définitivement votre
                  compte <strong>{user?.profile?.name}</strong>.
                </p>
                <p className="text-sm text-base-content mb-3">
                  Cela supprimera :
                </p>
                <ul className="text-sm text-base-content/80 space-y-1 ml-4">
                  <li>• Votre profil et toutes vos informations</li>
                  <li>• Tous vos médias (photos, vidéos)</li>
                  <li>• Vos membres d'équipe (si applicable)</li>
                  <li>• Vos messages et conversations</li>
                  <li>• Toutes vos données liées au compte</li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-medium">
                    Mot de passe actuel :
                  </span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  data-cy="current-password-input"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe actuel"
                  className="input input-bordered w-full"
                  disabled={isDeleting}
                />
              </div>

              <div className="mb-6">
                <label className="label">
                  <span className="label-text font-medium">
                    Pour confirmer, tapez <strong>"SUPPRIMER"</strong>{" "}
                    ci-dessous :
                  </span>
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  data-cy="delete-account-input"
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="input input-bordered w-full"
                  disabled={isDeleting}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  data-cy="confirm-delete"
                  disabled={confirmationText !== "SUPPRIMER" || !currentPassword.trim() || isDeleting}
                  className="btn btn-error gap-2"
                >
                  {isDeleting && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  <Trash2 className="w-4 h-4" />
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;
