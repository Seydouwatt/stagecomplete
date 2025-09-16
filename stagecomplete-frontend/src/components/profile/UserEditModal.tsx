import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User as UserIcon,
  Phone,
  Camera,
  Upload,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { toast } from "../../stores/useToastStore";
import { useAuthStore } from "../../stores/authStore";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";
import type { UpdateProfileData, UpdateUserData, User } from "../../types";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface FormData {
  // User personal data only
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isFounder?: boolean;
  avatar?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { updateProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    // User personal data only
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    isFounder: user.isFounder || false,
    avatar: user.profile.avatar || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    user.profile.avatar || ""
  );

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        // User personal data only
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        isFounder: user.isFounder || false,
        avatar: user.profile.avatar || "",
      });
      setPreviewAvatar(user.profile.avatar || "");
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation de l'email
    if (!formData.email || formData.email.trim().length === 0) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du prénom (optionnel)
    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = "Le prénom ne peut pas dépasser 50 caractères";
    }

    // Validation du nom (optionnel)
    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "Le nom ne peut pas dépasser 50 caractères";
    }

    // Validation du téléphone
    if (formData.phone && !profileService.isValidPhone(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field (only for fields that can have errors)
    if (field !== "isFounder" && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("L'image ne peut pas dépasser 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    try {
      // Créer un aperçu
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
      setAvatarFile(file);

      // Convertir en base64 pour l'upload
      const base64 = await profileService.convertImageToBase64(file);
      setFormData((prev) => ({ ...prev, avatar: base64 }));
    } catch (error) {
      toast.error("Erreur lors du traitement de l'image");
      console.error("Avatar upload error:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    try {
      // Préparer les données utilisateur
      const userData: UpdateUserData = {
        firstName: formData.firstName?.trim() || undefined,
        lastName: formData.lastName?.trim() || undefined,
        email: formData.email?.trim(),
        phone: formData.phone?.trim() || undefined,
        isFounder: formData.isFounder,
      };

      // Préparer les données de profil (seulement l'avatar)
      const profileData: UpdateProfileData = {
        avatar: formData.avatar || undefined,
      };

      // Mettre à jour les données utilisateur
      await userService.updateUser(userData);
      // Re-fetch fresh user from API and sync auth store so UI reflects updates
      const freshUser = await userService.getUserInfo();
      // If your store exposes a setter, prefer it; otherwise setState is fine
      // const { setUser } = useAuthStore.getState();
      // setUser(freshUser);
      useAuthStore.setState({ user: freshUser });

      // Mettre à jour l'avatar si nécessaire
      if (profileData.avatar !== undefined) {
        await updateProfile(profileData);
      }

      toast.success("Informations mises à jour avec succès");
      onClose();
    } catch (error) {
      // L'erreur est déjà gérée par le service
      console.error("Profile update error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-300">
                <div>
                  <h2 className="text-2xl font-bold text-base-content">
                    Mes informations
                  </h2>
                  <p className="text-base-content/60 mt-1">
                    Modifiez vos informations personnelles
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-circle"
                  disabled={isLoading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto max-h-[calc(90vh-140px)]"
              >
                <div className="p-6 space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {previewAvatar ? (
                        <img
                          src={previewAvatar}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-base-300"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-base-300 ring-4 ring-base-300 flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-base-content/40" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary cursor-pointer">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-base-content/60 text-center">
                      Cliquez sur l'icône pour changer votre photo
                      <br />
                      (Maximum 5MB - JPG, PNG, GIF)
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Informations personnelles
                    </h3>

                    {/* Email */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Email <span className="text-error">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="votre@email.com"
                          className={`input input-bordered w-full pl-10 ${
                            errors.email ? "input-error" : ""
                          }`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Prénom</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="Votre prénom"
                          className={`input input-bordered w-full ${
                            errors.firstName ? "input-error" : ""
                          }`}
                          disabled={isLoading}
                          maxLength={50}
                        />
                        {errors.firstName && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.firstName}
                            </span>
                          </label>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Nom</span>
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Votre nom"
                          className={`input input-bordered w-full ${
                            errors.lastName ? "input-error" : ""
                          }`}
                          disabled={isLoading}
                          maxLength={50}
                        />
                        {errors.lastName && (
                          <label className="label">
                            <span className="label-text-alt text-error flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.lastName}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Téléphone
                        </span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+33 1 23 45 67 89"
                          className={`input input-bordered w-full pl-10 ${
                            errors.phone ? "input-error" : ""
                          }`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.phone}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Founder Status */}
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          Membre fondateur
                        </span>
                        <input
                          type="checkbox"
                          checked={formData.isFounder}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              isFounder: e.target.checked,
                            }))
                          }
                          className="checkbox checkbox-primary"
                          disabled={isLoading}
                        />
                      </label>
                      <p className="text-xs text-base-content/60 mt-1">
                        Cochez cette case si vous êtes membre fondateur de la
                        plateforme
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-base-300">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-ghost"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
