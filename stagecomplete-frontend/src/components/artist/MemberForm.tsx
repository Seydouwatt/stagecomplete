import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Music, Crown, Link } from "lucide-react";
import {
  memberService,
  type ArtistMember,
  type CreateArtistMemberDto,
  type UpdateArtistMemberDto,
} from "../../services/memberService";
import { useToastStore } from "../../stores/useToastStore";

import { MultiSelect } from "../forms/MultiSelect";
import { ImageUpload } from "../forms/ImageUpload";
import LoadingButton from "../ui/LoadingButton";

interface MemberFormProps {
  member?: ArtistMember; // Si défini, on est en mode édition
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isSoloArtist?: boolean;
}

const EXPERIENCE_OPTIONS = [
  { value: "BEGINNER", label: "Débutant" },
  { value: "INTERMEDIATE", label: "Intermédiaire" },
  { value: "PROFESSIONAL", label: "Professionnel" },
  { value: "EXPERT", label: "Expert" },
];

const COMMON_INSTRUMENTS = [
  "Guitare",
  "Basse",
  "Batterie",
  "Piano",
  "Clavier",
  "Violon",
  "Saxophone",
  "Trompette",
  "Flûte",
  "Chant",
  "Harmonica",
  "Accordéon",
  "Violoncelle",
  "Contrebasse",
  "Trombone",
  "Clarinette",
  "Harpe",
  "Orgue",
];

export const MemberForm: React.FC<MemberFormProps> = ({
  member,
  isOpen,
  onClose,
  onSuccess,
  isSoloArtist = false,
}) => {
  const [formData, setFormData] = useState<
    CreateArtistMemberDto | UpdateArtistMemberDto
  >({
    name: "",
    role: "",
    bio: "",
    avatar: "",
    email: "",
    phone: "",
    socialLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
    },
    instruments: [],
    experience: "PROFESSIONAL",
    yearsActive: undefined,
    isFounder: false,
    isActive: true,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToastStore();

  // Initialiser le formulaire avec les données du membre si en édition
  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        role: member.role || "",
        bio: member.bio || "",
        avatar: member.avatar || "",
        email: member.email || "",
        phone: member.phone || "",
        socialLinks: {
          instagram: member.socialLinks?.instagram || "",
          facebook: member.socialLinks?.facebook || "",
          twitter: member.socialLinks?.twitter || "",
          youtube: member.socialLinks?.youtube || "",
        },
        instruments: member.instruments || [],
        experience: member.experience,
        yearsActive: member.yearsActive,
        isFounder: member.isFounder,
        isActive: member.isActive,
      });
    } else {
      // Réinitialiser pour création
      setFormData({
        name: "",
        role: isSoloArtist ? "Artiste principal" : "",
        bio: "",
        avatar: "",
        email: "",
        phone: "",
        socialLinks: {
          instagram: "",
          facebook: "",
          twitter: "",
          youtube: "",
        },
        instruments: [],
        experience: "PROFESSIONAL",
        yearsActive: undefined,
        isFounder: isSoloArtist,
        isActive: true,
      });
    }
    setErrors([]);
  }, [member, isOpen, isSoloArtist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validationErrors = memberService.validateMember(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      // Nettoyer les données (supprimer les champs vides)
      const cleanData = {
        ...formData,
        role: formData.role?.trim() || undefined,
        bio: formData.bio?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        socialLinks: Object.entries(formData.socialLinks || {}).reduce(
          (acc, [key, value]) => {
            if (value?.trim()) {
              acc[key] = value.trim();
            }
            return acc;
          },
          {} as any
        ),
      };

      if (member) {
        // Mode édition
        await memberService.updateMember(member.id, cleanData);
        addToast(`${cleanData.name} a été modifié avec succès`, "success");
      } else {
        // Mode création
        await memberService.createMember(cleanData as CreateArtistMemberDto);
        addToast(
          `${cleanData.name} a été ajouté au groupe avec succès`,
          "success"
        );
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Effacer les erreurs quand l'utilisateur modifie
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <motion.div
        className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl">
            {member
              ? `Modifier ${member.name}`
              : `${isSoloArtist ? "Profil Artiste" : "Nouveau Membre"}`}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="alert alert-error">
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Photo de profil */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Photo de profil
              </span>
            </label>
            <ImageUpload
              label="Photo de profil"
              value={formData.avatar ? [formData.avatar] : []}
              onChange={(images) => updateFormData("avatar", images[0] || "")}
              maxImages={1}
              className="w-32 h-32 mx-auto"
            />
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom complet *</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Nom et prénom"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Rôle dans le groupe
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.role || ""}
                onChange={(e) => updateFormData("role", e.target.value)}
                placeholder={
                  isSoloArtist
                    ? "Artiste principal"
                    : "Ex: Guitariste, Chanteur..."
                }
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Bio / Présentation</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              value={formData.bio || ""}
              onChange={(e) => updateFormData("bio", e.target.value)}
              placeholder="Présentez-vous en quelques lignes..."
              maxLength={1000}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/50">
                {(formData.bio || "").length}/1000 caractères
              </span>
            </label>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="email@exemple.com"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full"
                value={formData.phone || ""}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          {/* Instruments */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <Music className="w-4 h-4" />
                Instruments
              </span>
            </label>
            <MultiSelect
              label="Instruments"
              options={COMMON_INSTRUMENTS}
              value={formData.instruments || []}
              onChange={(instruments) =>
                updateFormData("instruments", instruments)
              }
              placeholder="Sélectionnez vos instruments"
              allowCustom={true}
              maxSelections={10}
            />
          </div>

          {/* Expérience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Niveau d'expérience
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.experience || ""}
                onChange={(e) => updateFormData("experience", e.target.value)}
              >
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Années d'expérience
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={formData.yearsActive || ""}
                onChange={(e) =>
                  updateFormData(
                    "yearsActive",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="Ex: 5"
                min="0"
                max="80"
              />
            </div>
          </div>

          {/* Liens sociaux */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <Link className="w-4 h-4" />
                Réseaux sociaux
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries({
                instagram: "Instagram",
                facebook: "Facebook",
                twitter: "Twitter",
                youtube: "YouTube",
              }).map(([platform, label]) => (
                <div key={platform}>
                  <input
                    type="url"
                    className="input input-bordered input-sm w-full"
                    value={formData.socialLinks?.[platform] || ""}
                    onChange={(e) => updateSocialLink(platform, e.target.value)}
                    placeholder={`https://${platform}.com/...`}
                  />
                  <label className="label">
                    <span className="label-text-alt">{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Options avancées */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.isFounder || false}
                onChange={(e) => updateFormData("isFounder", e.target.checked)}
                disabled={isSoloArtist} // Pour un artiste solo, toujours fondateur
              />
              <span className="label-text flex items-center gap-2">
                <Crown className="w-4 h-4 text-warning" />
                Membre fondateur du groupe
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <LoadingButton
              type="submit"
              className="btn btn-primary"
              isLoading={loading}
            >
              {member ? "Modifier" : "Ajouter"}{" "}
              {isSoloArtist ? "" : "le membre"}
            </LoadingButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
