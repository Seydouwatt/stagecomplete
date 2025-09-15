import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  MapPin,
  Globe,
  Camera,
  Upload,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "../../stores/useToastStore";
import { useAuthStore } from "../../stores/authStore";
import { profileService } from "../../services/profileService";
import type { UpdateProfileData, Profile } from "../../types";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

interface FormData extends UpdateProfileData {
  avatar?: string;
}

interface FormErrors {
  name?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const { updateProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    name: profile.name || "",
    bio: profile.bio || "",
    avatar: profile.avatar || "",
    phone: profile.phone || "",
    location: profile.location || "",
    website: profile.website || "",
    socialLinks: {
      instagram: profile.socialLinks?.instagram || "",
      facebook: profile.socialLinks?.facebook || "",
      twitter: profile.socialLinks?.twitter || "",
      linkedin: profile.socialLinks?.linkedin || "",
      youtube: profile.socialLinks?.youtube || "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>(profile.avatar || "");

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        avatar: profile.avatar || "",
        phone: profile.phone || "",
        location: profile.location || "",
        website: profile.website || "",
        socialLinks: {
          instagram: profile.socialLinks?.instagram || "",
          facebook: profile.socialLinks?.facebook || "",
          twitter: profile.socialLinks?.twitter || "",
          linkedin: profile.socialLinks?.linkedin || "",
          youtube: profile.socialLinks?.youtube || "",
        },
      });
      setPreviewAvatar(profile.avatar || "");
      setErrors({});
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du nom
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    } else if (formData.name.length > 50) {
      newErrors.name = "Le nom ne peut pas dépasser 50 caractères";
    }

    // Validation de la bio
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "La biographie ne peut pas dépasser 500 caractères";
    }

    // Validation du téléphone
    if (formData.phone && !profileService.isValidPhone(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    // Validation du site web
    if (formData.website && !profileService.isValidUrl(formData.website)) {
      newErrors.website = "URL du site web invalide";
    }

    // Validation des réseaux sociaux
    const socialErrors: FormErrors['socialLinks'] = {};
    if (formData.socialLinks) {
      Object.entries(formData.socialLinks).forEach(([platform, url]) => {
        if (url && !profileService.isValidUrl(url)) {
          socialErrors[platform as keyof typeof socialErrors] = `URL ${platform} invalide`;
        }
      });
    }

    if (Object.keys(socialErrors).length > 0) {
      newErrors.socialLinks = socialErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSocialLinkChange = (
    platform: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));

    // Clear error for this social link
    if (errors.socialLinks?.[platform as keyof typeof errors.socialLinks]) {
      setErrors(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: undefined,
        },
      }));
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (file.size > 5 * 1024 * 1024) { // 5MB
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
      setFormData(prev => ({ ...prev, avatar: base64 }));
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
      // Nettoyer les liens sociaux vides
      const cleanedSocialLinks = Object.fromEntries(
        Object.entries(formData.socialLinks || {}).filter(([_, url]) => url && url.trim() !== "")
      );

      const updateData: UpdateProfileData = {
        name: formData.name?.trim(),
        bio: formData.bio?.trim() || undefined,
        avatar: formData.avatar || undefined,
        phone: formData.phone?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        website: formData.website?.trim() || undefined,
        socialLinks: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : undefined,
      };

      await updateProfile(updateData);
      toast.success("Profil mis à jour avec succès");
      onClose();
    } catch (error) {
      // L'erreur est déjà gérée par le service
      console.error("Profile update error:", error);
    }
  };

  const socialPlatforms = [
    { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500" },
    { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { key: "twitter", label: "Twitter", icon: Twitter, color: "text-blue-400" },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
    { key: "youtube", label: "YouTube", icon: Youtube, color: "text-red-500" },
  ];

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
                    Éditer le profil
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
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
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
                          <User className="w-8 h-8 text-base-content/40" />
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
                      Cliquez sur l'icône pour changer votre photo<br />
                      (Maximum 5MB - JPG, PNG, GIF)
                    </p>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de base</h3>

                    {/* Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Nom complet <span className="text-error">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Votre nom complet"
                          className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                          disabled={isLoading}
                          maxLength={50}
                        />
                      </div>
                      {errors.name && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Bio */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Biographie</span>
                        <span className="label-text-alt">{formData.bio?.length || 0}/500</span>
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Parlez-nous de vous..."
                        className={`textarea textarea-bordered h-24 resize-none ${errors.bio ? 'textarea-error' : ''}`}
                        disabled={isLoading}
                        maxLength={500}
                      />
                      {errors.bio && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.bio}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations de contact</h3>

                    {/* Phone */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Téléphone</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+33 1 23 45 67 89"
                          className={`input input-bordered w-full pl-10 ${errors.phone ? 'input-error' : ''}`}
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

                    {/* Location */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Localisation</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Paris, France"
                          className="input input-bordered w-full pl-10"
                          disabled={isLoading}
                          maxLength={100}
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Site web</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://monsite.com"
                          className={`input input-bordered w-full pl-10 ${errors.website ? 'input-error' : ''}`}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.website && (
                        <label className="label">
                          <span className="label-text-alt text-error flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.website}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
                        <div key={key} className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${color}`} />
                              {label}
                            </span>
                          </label>
                          <input
                            type="url"
                            value={formData.socialLinks?.[key as keyof typeof formData.socialLinks] || ""}
                            onChange={(e) => handleSocialLinkChange(key, e.target.value)}
                            placeholder={`https://${key}.com/...`}
                            className={`input input-bordered w-full ${
                              errors.socialLinks?.[key as keyof typeof errors.socialLinks] ? 'input-error' : ''
                            }`}
                            disabled={isLoading}
                          />
                          {errors.socialLinks?.[key as keyof typeof errors.socialLinks] && (
                            <label className="label">
                              <span className="label-text-alt text-error flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.socialLinks[key as keyof typeof errors.socialLinks]}
                              </span>
                            </label>
                          )}
                        </div>
                      ))}
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