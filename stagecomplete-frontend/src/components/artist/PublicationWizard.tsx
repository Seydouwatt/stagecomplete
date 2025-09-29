import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  MusicalNoteIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { MultiSelect } from "../forms/MultiSelect";
import { ImageUpload } from "../forms/ImageUpload";
import type {
  ArtistType,
  ArtistDiscipline,
  ArtistCardSmallProps,
} from "../../types";
import ArtistCard from "./ArtistCard";
import { useAuthStore } from "../../stores/authStore";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";

interface PublicationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: PublicationData) => void;
  initialData?: Partial<PublicationData>;
}

export interface PublicationData {
  // Étape 1 - Infos essentielles
  artistName: string;
  artistDescription: string;
  artistType: ArtistType;
  artistDiscipline: ArtistDiscipline;
  genres: string[];
  baseLocation: string;
  mainPhoto: string;

  // Étape 2 - Portfolio créatif
  portfolioPhotos: string[];
  socialLinks: {
    spotify?: string;
    youtube?: string;
    soundcloud?: string;
    instagram?: string;
    website?: string;
  };
  demoVideo?: string;
  priceRange?: string;

  // Étape 3 - Publication
  isPublic: boolean;
  qualityScore: number;
}

const ARTIST_TYPE_OPTIONS: { value: ArtistType; label: string }[] = [
  { value: "SOLO", label: "Artiste solo" },
  { value: "BAND", label: "Groupe / Band" },
  { value: "THEATER_GROUP", label: "Troupe de théâtre" },
  { value: "COMEDY_GROUP", label: "Groupe humoristique" },
  { value: "ORCHESTRA", label: "Orchestre" },
  { value: "CHOIR", label: "Chorale" },
  { value: "OTHER", label: "Autre" },
];

const ARTIST_DISCIPLINE_OPTIONS: { value: ArtistDiscipline; label: string }[] =
  [
    { value: "MUSIC", label: "Musique" },
    { value: "THEATER", label: "Théâtre" },
    { value: "ACTOR", label: "Acting" },
    { value: "COMEDIENNE", label: "Comédie/Humour" },
    { value: "COMEDIE", label: "Stand-up" },
    { value: "DANCE", label: "Danse" },
    { value: "CIRCUS", label: "Cirque" },
    { value: "MAGIE", label: "Magie" },
    { value: "OTHER", label: "Autre" },
  ];

const MUSIC_GENRES = [
  "Rock",
  "Pop",
  "Jazz",
  "Blues",
  "Funk",
  "Soul",
  "R&B",
  "Hip-Hop",
  "Rap",
  "Reggae",
  "Folk",
  "Country",
  "Classical",
  "Electronic",
  "House",
  "Techno",
  "Ambient",
  "Indie",
  "Alternative",
  "Metal",
  "Punk",
  "Reggaeton",
  "Latino",
  "World Music",
  "French Song",
  "Chanson",
];

const PRICE_RANGES = ["0-200", "200-500", "500-1000", "1000-2000", "2000+"];

export const PublicationWizard: React.FC<PublicationWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PublicationData>({
    artistName: "",
    artistDescription: "",
    artistType: "SOLO",
    artistDiscipline: "MUSIC",
    genres: [],
    baseLocation: "",
    mainPhoto: "",
    portfolioPhotos: [],
    socialLinks: {},
    isPublic: false,
    qualityScore: 0,
    ...initialData,
  });
  const { user } = useAuthStore();
  const { completionPercentage, missingItems, completedItems } =
    useProfileCompletion();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialCompletionPercentage] = useState(completionPercentage);

  // Calculer l'impact des modifications du wizard sur le score de complétion
  useEffect(() => {
    const estimatedScore = estimateCompletionAfterWizard(
      formData,
      missingItems
    );
    setFormData((prev) => ({ ...prev, qualityScore: estimatedScore }));
  }, [
    formData.artistName,
    formData.artistDescription,
    formData.genres,
    formData.baseLocation,
    formData.mainPhoto,
    formData.portfolioPhotos,
    formData.socialLinks,
    formData.demoVideo,
    formData.priceRange,
    missingItems,
    completionPercentage,
  ]);

  // Helper pour afficher un badge si le champ correspond à un élément manquant
  const getMissingItemBadge = (itemKey: string) => {
    const missingItem = missingItems.find((item) => item.key === itemKey);
    if (!missingItem) return null;

    return <span className="badge badge-warning badge-sm ml-2">Manquant</span>;
  };

  // Estimer le pourcentage de complétion après les modifications du wizard
  const estimateCompletionAfterWizard = (
    data: PublicationData,
    missing: typeof missingItems
  ): number => {
    // Calculer combien d'éléments manquants seraient complétés par les données du wizard
    const totalItems = missing.length + completedItems.length;
    if (totalItems === 0) return 100;

    let itemsWillBeCompleted = 0;

    missing.forEach((item) => {
      switch (item.key) {
        case "basic_info":
          if (data.artistName && data.artistDescription) {
            itemsWillBeCompleted++;
          }
          break;
        case "cover_photo":
          if (data.mainPhoto) {
            itemsWillBeCompleted++;
          }
          break;
        case "genres":
          if (data.genres.length > 0) {
            itemsWillBeCompleted++;
          }
          break;
        case "portfolio_photos":
          if (data.portfolioPhotos.length >= 2) {
            itemsWillBeCompleted++;
          }
          break;
        case "location":
          if (data.baseLocation) {
            itemsWillBeCompleted++;
          }
          break;
        case "artist_type":
          if (data.artistType) {
            itemsWillBeCompleted++;
          }
          break;
        case "pricing":
          if (data.priceRange) {
            itemsWillBeCompleted++;
          }
          break;
        // Les autres éléments (instruments) ne sont pas dans ce wizard
        default:
          break;
      }
    });

    // Calculer le nouveau pourcentage estimé
    const itemsCompleted = completedItems.length + itemsWillBeCompleted;
    return Math.round((itemsCompleted / totalItems) * 100);
  };

  const updateFormData = (field: keyof PublicationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur si le champ est maintenant valide
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const updateSocialLinks = (platform: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.artistName.trim()) {
        newErrors.artistName = "Le nom artistique est requis";
      }
      if (!formData.artistDescription.trim()) {
        newErrors.artistDescription = "La description est requise";
      } else if (formData.artistDescription.length < 20) {
        newErrors.artistDescription =
          "La description doit faire au moins 20 caractères";
      }
      if (formData.genres.length === 0) {
        newErrors.genres = "Sélectionnez au moins un genre";
      }
      if (!formData.baseLocation.trim()) {
        newErrors.baseLocation = "La localisation est requise";
      }
      if (!formData.mainPhoto) {
        newErrors.mainPhoto = "Une photo de profil est requise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getQualityMessage = (score: number) => {
    if (score >= 80) return "Excellent profil !";
    if (score >= 60) return "Bon profil, quelques améliorations possibles";
    return "Profil à compléter pour une meilleure visibilité";
  };

  // Génération de données pour l'artiste
  const getArtistData = (data: PublicationData): ArtistCardSmallProps => {
    if (!user) return {} as ArtistCardSmallProps;
    const artistData: ArtistCardSmallProps = {
      // id: user.id,
      // artistDescription: data.artistDescription,
      // baseLocation: data.baseLocation,
      // genres: data.genres,

      // artistType: data.artistType,
      // artistDiscipline: data.artistDiscipline,
      // profileId: user.profile.id,
      // updatedAt: user.updatedAt,
      // createdAt: user.createdAt,

      coverPhoto: data.portfolioPhotos[0] || "",
      // portfolio: data.portfolioPhotos
      artistType: data.artistType || "",
      profile: { name: data.artistName },
      publicSlug: "Non généré",
      baseLocation: data.baseLocation,
      artistDescription: data.artistDescription,
      genres: data.genres,
      priceRange: data?.priceRange || "Non renseigné",
    };

    return artistData;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary text-primary-content p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Assistant de Publication</h2>
              <p className="opacity-90">
                Créez votre profil public en 3 étapes
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost text-primary-content"
            >
              ✕
            </button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mt-6">
            {[1, 2, 3].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const icons = [UserIcon, MusicalNoteIcon, EyeIcon];
              const Icon = icons[step - 1];

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    ${isActive ? "bg-primary-content text-primary" : ""}
                    ${isCompleted ? "bg-success text-success-content" : ""}
                    ${
                      !isActive && !isCompleted
                        ? "bg-primary-content/20 text-primary-content"
                        : ""
                    }
                  `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        step < currentStep
                          ? "bg-success"
                          : "bg-primary-content/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Global Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-content/90">
                Complétion du profil
              </span>
              <span className="text-sm font-bold text-primary-content">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-primary-content/20 rounded-full h-2">
              <motion.div
                className="bg-primary-content h-2 rounded-full"
                initial={{ width: `${completionPercentage}%` }}
                animate={{ width: `${formData.qualityScore}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Missing Items Alert */}
        {missingItems.length > 0 && currentStep === 1 && (
          <div className="px-6 pt-4 pb-0">
            <div className="alert alert-info bg-blue-50 border-blue-200">
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  {missingItems.length} élément
                  {missingItems.length > 1 ? "s" : ""} manquant
                  {missingItems.length > 1 ? "s" : ""} dans votre profil
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Cet assistant va vous aider à les compléter pour améliorer
                  votre visibilité
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-200px)]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Informations essentielles
                  </h3>
                  <p className="text-base-content/60">
                    Renseignez vos informations de base
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center">
                        Nom artistique *{getMissingItemBadge("basic_info")}
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered ${
                        errors.artistName ? "input-error" : ""
                      }`}
                      placeholder="Ex: The Rolling Stones"
                      value={formData.artistName}
                      onChange={(e) =>
                        updateFormData("artistName", e.target.value)
                      }
                      maxLength={100}
                    />
                    {errors.artistName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.artistName}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center">
                        Localisation *{getMissingItemBadge("location")}
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered ${
                        errors.baseLocation ? "input-error" : ""
                      }`}
                      placeholder="Ex: Paris, France"
                      value={formData.baseLocation}
                      onChange={(e) =>
                        updateFormData("baseLocation", e.target.value)
                      }
                    />
                    {errors.baseLocation && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.baseLocation}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center">
                        Type d'artiste *{getMissingItemBadge("artist_type")}
                      </span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.artistType}
                      onChange={(e) =>
                        updateFormData(
                          "artistType",
                          e.target.value as ArtistType
                        )
                      }
                    >
                      {ARTIST_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Discipline artistique *
                      </span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={formData.artistDiscipline}
                      onChange={(e) =>
                        updateFormData(
                          "artistDiscipline",
                          e.target.value as ArtistDiscipline
                        )
                      }
                    >
                      {ARTIST_DISCIPLINE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center">
                      Genres / Styles *{getMissingItemBadge("genres")}
                    </span>
                  </label>
                  <MultiSelect
                    label=""
                    options={MUSIC_GENRES}
                    value={formData.genres}
                    onChange={(value) => updateFormData("genres", value)}
                    placeholder="Sélectionnez vos genres"
                    maxSelections={5}
                    allowCustom={true}
                    error={errors.genres}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Description artistique * (250 caractères)
                    </span>
                    <span className="label-text-alt">
                      {formData.artistDescription.length}/250
                    </span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered h-24 ${
                      errors.artistDescription ? "textarea-error" : ""
                    }`}
                    placeholder="Décrivez votre style, votre univers artistique, votre expérience..."
                    value={formData.artistDescription}
                    onChange={(e) =>
                      updateFormData("artistDescription", e.target.value)
                    }
                    maxLength={250}
                  />
                  {errors.artistDescription && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.artistDescription}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center">
                      Photo de profil principale *
                      {getMissingItemBadge("cover_photo")}
                    </span>
                  </label>
                  <ImageUpload
                    label=""
                    value={formData.mainPhoto ? [formData.mainPhoto] : []}
                    onChange={(value) =>
                      updateFormData("mainPhoto", value[0] || "")
                    }
                    maxImages={1}
                    error={errors.mainPhoto}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Portfolio créatif
                  </h3>
                  <p className="text-base-content/60">
                    Enrichissez votre profil avec vos créations
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center">
                      Photos du portfolio (3-5 recommandées)
                      {getMissingItemBadge("portfolio_photos")}
                    </span>
                  </label>
                  <ImageUpload
                    label=""
                    value={formData.portfolioPhotos}
                    onChange={(value) =>
                      updateFormData("portfolioPhotos", value)
                    }
                    maxImages={8}
                    isPremiumFeature={true}
                    freeLimit={4}
                    premiumLimit={10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Spotify</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      placeholder="https://open.spotify.com/artist/..."
                      value={formData.socialLinks.spotify || ""}
                      onChange={(e) =>
                        updateSocialLinks("spotify", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">YouTube</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      placeholder="https://youtube.com/@..."
                      value={formData.socialLinks.youtube || ""}
                      onChange={(e) =>
                        updateSocialLinks("youtube", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">SoundCloud</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      placeholder="https://soundcloud.com/..."
                      value={formData.socialLinks.soundcloud || ""}
                      onChange={(e) =>
                        updateSocialLinks("soundcloud", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Instagram</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      placeholder="https://instagram.com/..."
                      value={formData.socialLinks.instagram || ""}
                      onChange={(e) =>
                        updateSocialLinks("instagram", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Vidéo démo</span>
                    <span className="label-text-alt">YouTube ou Vimeo</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.demoVideo || ""}
                    onChange={(e) =>
                      updateFormData("demoVideo", e.target.value)
                    }
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center">
                      Fourchette de tarifs
                      {getMissingItemBadge("pricing")}
                    </span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.priceRange || ""}
                    onChange={(e) =>
                      updateFormData("priceRange", e.target.value)
                    }
                  >
                    <option value="">Non spécifié</option>
                    {PRICE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}€
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Prêt pour la publication
                  </h3>
                  <p className="text-base-content/60">
                    Vérifiez et publiez votre profil
                  </p>
                </div>

                {/* Progress Comparison */}
                <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
                  <div className="card-body">
                    <h4 className="font-semibold text-lg mb-4">
                      Progression de votre profil
                    </h4>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Before */}
                      <div className="text-center">
                        <p className="text-sm text-base-content/60 mb-2">
                          Avant
                        </p>
                        <div
                          className="radial-progress text-base-content/60"
                          style={
                            {
                              "--value": initialCompletionPercentage,
                              "--size": "6rem",
                              "--thickness": "4px",
                            } as React.CSSProperties
                          }
                        >
                          {initialCompletionPercentage}%
                        </div>
                        <p className="text-xs text-base-content/60 mt-2">
                          Profil actuel
                        </p>
                      </div>

                      {/* After */}
                      <div className="text-center">
                        <p className="text-sm text-success font-medium mb-2">
                          Après
                        </p>
                        <div
                          className={`radial-progress ${getQualityColor(
                            formData.qualityScore
                          )}`}
                          style={
                            {
                              "--value": formData.qualityScore,
                              "--size": "6rem",
                              "--thickness": "4px",
                            } as React.CSSProperties
                          }
                        >
                          {formData.qualityScore}%
                        </div>
                        <p className="text-xs text-success font-medium mt-2">
                          Profil amélioré (+
                          {formData.qualityScore - initialCompletionPercentage}
                          %)
                        </p>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div className="text-center">
                      <p
                        className={`text-lg font-bold ${getQualityColor(
                          formData.qualityScore
                        )}`}
                      >
                        {getQualityMessage(formData.qualityScore)}
                      </p>
                    </div>

                    {/* Éléments encore manquants */}
                    {missingItems.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">
                          Éléments encore à compléter pour atteindre 100% :
                        </p>
                        <div className="space-y-2">
                          {missingItems.map((item) => {
                            const canBeCompleted =
                              (item.key === "basic_info" &&
                                (!formData.artistName ||
                                  !formData.artistDescription)) ||
                              (item.key === "cover_photo" &&
                                !formData.mainPhoto) ||
                              (item.key === "genres" &&
                                formData.genres.length === 0) ||
                              (item.key === "portfolio_photos" &&
                                formData.portfolioPhotos.length < 2) ||
                              (item.key === "location" &&
                                !formData.baseLocation) ||
                              (item.key === "artist_type" &&
                                !formData.artistType) ||
                              (item.key === "pricing" &&
                                !formData.priceRange) ||
                              item.key === "instruments";

                            return (
                              <div
                                key={item.key}
                                className={`flex items-start gap-2 p-2 rounded ${
                                  canBeCompleted
                                    ? "bg-warning/10 border border-warning/30"
                                    : "bg-base-200"
                                }`}
                              >
                                <span
                                  className={
                                    canBeCompleted
                                      ? "text-warning"
                                      : "text-base-content/60"
                                  }
                                >
                                  {canBeCompleted ? "⚠" : "•"}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {item.label}
                                  </p>
                                  <p className="text-xs text-base-content/60">
                                    {item.description}
                                  </p>
                                  {item.key === "instruments" && (
                                    <p className="text-xs text-info mt-1">
                                      À compléter dans Mon Portfolio →
                                      Informations générales
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aperçu du profil */}
                {/* <PublicOverview
                  artistName={formData.artistName}
                  baseLocation={formData.baseLocation}
                  genres={formData.genres}
                  mainPhoto={formData.mainPhoto}
                  artistDescription={formData.artistDescription}
                  socialLinks={formData.socialLinks}
                  portfolioPhotos={formData.portfolioPhotos}
                  demoVideo={formData.demoVideo}
                  priceRange={formData.priceRange}
                /> */}
                {/* <div className="card bg-base-100 border">
                  <div className="card-body">
                    <h4 className="font-semibold mb-4">
                      Aperçu de votre profil public
                    </h4>

                    <div className="flex gap-4">
                      {formData.mainPhoto && (
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full">
                            <img src={formData.mainPhoto} alt="Profil" />
                          </div>
                        </div>
                      )}

                      <div className="flex-1">
                        <h5 className="font-bold text-lg">
                          {formData.artistName || "Nom de l'artiste"}
                        </h5>
                        <p className="text-base-content/60">
                          {formData.baseLocation}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="badge badge-primary badge-sm"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm">
                      {formData.artistDescription ||
                        "Description de l'artiste..."}
                    </p>
                  </div>
                </div> */}
                <motion.div>
                  <ArtistCard artist={getArtistData(formData)} />
                </motion.div>

                {/* Options de publication */}
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formData.isPublic}
                      onChange={(e) =>
                        updateFormData("isPublic", e.target.checked)
                      }
                    />
                    <div>
                      <span className="label-text font-medium">
                        Publier mon profil maintenant
                      </span>
                      <p className="text-sm text-base-content/60">
                        Votre profil sera visible par les venues et le public
                      </p>
                    </div>
                  </label>
                </div>

                {formData.qualityScore < 60 && (
                  <div className="alert alert-warning">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Profil incomplet</p>
                      <p className="text-sm">
                        Un score plus élevé améliore votre visibilité. Revenez
                        aux étapes précédentes pour compléter votre profil.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t bg-base-50 px-6 py-4 flex justify-between">
          <button
            onClick={currentStep === 1 ? onClose : prevStep}
            className="btn btn-outline gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {currentStep === 1 ? "Annuler" : "Précédent"}
          </button>

          {currentStep < 3 ? (
            <button onClick={nextStep} className="btn btn-primary gap-2">
              Suivant
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleComplete} className="btn btn-primary gap-2">
              <CheckIcon className="w-4 h-4" />
              {formData.isPublic
                ? "Publier le profil"
                : "Sauvegarder en brouillon"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
