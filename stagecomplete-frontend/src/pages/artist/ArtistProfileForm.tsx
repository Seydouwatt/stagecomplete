import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  MusicalNoteIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  ShareIcon,
  ArrowLeftIcon,
  EyeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { artistService } from "../../services/artistService";
import { toast } from "../../stores/useToastStore";
import type {
  UpdateArtistProfileData,
  ArtistType,
  ArtistProfile,
} from "../../types";
import { MemberManagement } from "../../components/artist";
import { ImageUpload } from "../../components/forms/ImageUpload";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";
import ArtisticProfileTab from "../../components/artist/tabs/ArtisticProfileTab";
import GeneralInfoTab from "../../components/artist/tabs/GeneralInfoTab";

const PRICE_RANGE_OPTIONS = [
  "0-200",
  "200-500",
  "500-1000",
  "1000-2000",
  "2000+",
];

type TabType =
  | "general"
  | "artistic"
  | "members"
  | "pricing"
  | "portfolio"
  | "public";

export const ArtistProfileForm: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [_artistData, setArtistData] = useState<ArtistProfile | null>(null);
  const [, setGeneratedSlug] = useState("");

  // Form state
  const [formData, setFormData] = useState<UpdateArtistProfileData>({
    // General information (identity)
    artistName: "",
    coverPhoto: "",
    logo: "",
    baseLocation: "",
    foundedYear: undefined,
    // Basic info
    genres: [],
    instruments: [],
    specialties: [],
    equipment: [],
    requirements: [],
    artistDiscipline: undefined,
    artistDescription: "",
    socialLinks: {},
    priceDetails: {},
    portfolio: { photos: [], videos: [], audio: [] },
  });

  // Charger les données du profil artiste
  useEffect(() => {
    const loadArtistProfile = async () => {
      if (user?.role !== "ARTIST") {
        toast.error("Cette page est réservée aux artistes");
        return;
      }

      try {
        setIsLoading(true);
        const profile = await artistService.getMyArtistProfile();
        console.log({ profile });

        setArtistData(profile);
        console.log(_artistData);

        // Pré-remplir le formulaire avec les données existantes
        const artist = profile;
        if (artist) {
          setFormData({
            // General information (identity)
            artistName: artist.artistName,
            coverPhoto: artist.coverPhoto,
            logo: artist.logo,
            baseLocation: artist.baseLocation,
            foundedYear: artist.foundedYear,
            // Basic info
            genres: artist.genres || [],
            instruments: artist.instruments || [],
            priceRange: artist.priceRange,
            experience: artist.experience,
            yearsActive: artist.yearsActive,
            artisticBio: artist.artisticBio,
            specialties: artist.specialties || [],
            equipment: artist.equipment || [],
            requirements: artist.requirements || [],
            artistType: artist.artistType,
            artistDiscipline: artist.artistDiscipline,
            artistDescription: artist.artistDescription,
            memberCount: artist.memberCount,
            priceDetails: artist.priceDetails || {},
            travelRadius: artist.travelRadius,
            socialLinks: artist.socialLinks || {},
            portfolio: artist.portfolio || {
              photos: [],
              videos: [],
              audio: [],
            },
            isPublic: artist.isPublic,
            publicSlug: artist.publicSlug,
          });
        }
      } catch (error) {
        console.error("Error loading artist profile:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    loadArtistProfile();
  }, [user]);

  // Sauvegarder le profil
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await artistService.updateArtistProfile(formData);
      setArtistData(updatedProfile);
      toast.success("Profil sauvegardé avec succès !");
    } catch (error) {
      console.error("Error saving artist profile:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  // Générer un slug
  const handleGenerateSlug = async () => {
    if (!_artistData?.artistName) {
      toast.error("Veuillez renseigner votre nom dans le profil");
      return;
    }

    try {
      const slug = await artistService.generateSlug(
        _artistData.artistName.replace(/\s+/g, "-").toLowerCase()
      );
      console.log(slug);

      setGeneratedSlug(slug);
      setFormData((prev) => ({ ...prev, publicSlug: slug }));
      toast.success("Slug généré !");
    } catch (error) {
      console.error("Error generating slug:", error);
      toast.error("Erreur lors de la génération du slug");
    }
  };

  const updateFormData = (field: keyof UpdateArtistProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (
    field: string,
    subField: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...((prev[field as keyof UpdateArtistProfileData] as Record<
          string,
          any
        >) ?? {}),
        [subField]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <LoadingOverlay
        isLoading={isLoading}
        message="Chargement du profil artiste..."
      />
    );
  }

  if (user?.role !== "ARTIST") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Accès refusé</h1>
          <p className="text-base-content/70 mt-2">
            Cette page est réservée aux artistes.
          </p>
          <Link to="/dashboard" className="btn btn-primary mt-4">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "general" as TabType,
      label: "Informations générales",
      icon: UserIcon,
    },
    {
      id: "artistic" as TabType,
      label: "Profil artistique",
      icon: MusicalNoteIcon,
    },
    {
      id: "members" as TabType,
      label: "Membres",
      icon: UsersIcon,
    },
    {
      id: "pricing" as TabType,
      label: "Tarifs & Conditions",
      icon: CurrencyDollarIcon,
    },
    { id: "portfolio" as TabType, label: "Portfolio", icon: PhotoIcon },
    { id: "public" as TabType, label: "Profil public", icon: ShareIcon },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Mon Profil Artiste
          </h1>
          <p className="text-base-content/60 mt-1">
            Créez votre vitrine professionnelle complète
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/dashboard" className="btn btn-outline btn-sm gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Dashboard
          </Link>

          {formData.isPublic && formData.publicSlug && (
            <Link
              to={`/artist/${formData.publicSlug}`}
              className="btn btn-outline btn-sm gap-2"
              target="_blank"
            >
              <EyeIcon className="w-4 h-4" />
              Voir le profil public
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm gap-2"
          >
            {isSaving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sauvegarder"
            )}
          </button>
        </div>
      </motion.div>

      {/* Tabs navigation */}
      <div className="tabs tabs-boxed bg-base-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab gap-2 flex-nowrap whitespace-nowrap ${
                activeTab === tab.id ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="card bg-base-100 shadow-lg"
      >
        <div className="card-body">
          {activeTab === "general" && (
            <GeneralInfoTab
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === "artistic" && (
            <ArtisticProfileTab
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {activeTab === "members" && (
            <MembersTab formData={formData} updateFormData={updateFormData} />
          )}

          {activeTab === "pricing" && (
            <PricingTab
              formData={formData}
              updateFormData={updateFormData}
              updateNestedFormData={updateNestedFormData}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioTab
              formData={formData}
              updateFormData={updateFormData}
              updateNestedFormData={updateNestedFormData}
            />
          )}

          {activeTab === "public" && (
            <PublicProfileTab
              formData={formData}
              updateFormData={updateFormData}
              onGenerateSlug={handleGenerateSlug}
              artistData={_artistData}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Composants pour chaque onglet (à définir dans la suite...)

const ARTIST_TYPE_OPTIONS: { value: ArtistType; label: string }[] = [
  { value: "SOLO", label: "Artiste solo" },
  { value: "BAND", label: "Groupe / Band" },
  { value: "THEATER_GROUP", label: "Troupe de théâtre" },
  { value: "COMEDY_GROUP", label: "Groupe humoristique" },
  { value: "ORCHESTRA", label: "Orchestre" },
  { value: "CHOIR", label: "Chorale" },
  { value: "OTHER", label: "Autre" },
];

const MembersTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
}> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8" data-testid="members-tab">
      <div>
        <h3 className="text-xl font-semibold mb-6">Configuration du groupe</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Type d'artiste</span>
              <span className="label-text-alt">Solo ou groupe</span>
            </label>
            <select
              name="artistType"
              data-testid="artist-type-select"
              className="select select-bordered"
              value={formData.artistType || "SOLO"}
              onChange={(e) =>
                updateFormData("artistType", e.target.value as ArtistType)
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
              <span className="label-text font-medium">Nombre de membres</span>
              <span className="label-text-alt">
                {formData.artistType === "SOLO"
                  ? "Toujours 1 pour un solo"
                  : "Maximum autorisé"}
              </span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Ex: 4"
              min="1"
              max="20"
              value={
                formData.memberCount ||
                (formData.artistType === "SOLO" ? 1 : "")
              }
              onChange={(e) =>
                updateFormData("memberCount", parseInt(e.target.value) || 1)
              }
              disabled={formData.artistType === "SOLO"}
            />
          </div>
        </div>

        {formData.artistType && formData.memberCount && (
          <div className="alert alert-info mb-6">
            <div>
              <h4 className="font-medium">Configuration du groupe</h4>
              <p className="text-sm">
                {formData.artistType === "SOLO"
                  ? "En tant qu'artiste solo, vous aurez un profil personnel dans la section membres."
                  : `Votre ${ARTIST_TYPE_OPTIONS.find(
                      (opt) => opt.value === formData.artistType
                    )?.label.toLowerCase()} peut avoir jusqu'à ${
                      formData.memberCount
                    } membres.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gestion des membres */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Gestion des membres</h4>
          <span className="badge badge-primary">
            {formData.artistType === "SOLO"
              ? "Profil personnel"
              : "Profils du groupe"}
          </span>
        </div>

        <div className="bg-base-50 rounded-lg p-6">
          <MemberManagement
            className="bg-transparent shadow-none p-0"
            artistType={formData.artistType}
          />
        </div>
      </div>
    </div>
  );
};

const PricingTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
  updateNestedFormData: (field: string, subField: string, value: any) => void;
}> = ({ formData, updateFormData, updateNestedFormData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Tarifs et conditions</h3>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Fourchette de prix générale
          </span>
        </label>
        <select
          className="select select-bordered"
          value={formData.priceRange || ""}
          onChange={(e) => updateFormData("priceRange", e.target.value)}
        >
          <option value="">Sélectionner...</option>
          {PRICE_RANGE_OPTIONS.map((range) => (
            <option key={range} value={range}>
              {range}€
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Prix concert (€)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="500"
            min="0"
            value={formData.priceDetails?.concert || ""}
            onChange={(e) =>
              updateNestedFormData(
                "priceDetails",
                "concert",
                parseInt(e.target.value) || undefined
              )
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Prix mariage (€)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="800"
            min="0"
            value={formData.priceDetails?.wedding || ""}
            onChange={(e) =>
              updateNestedFormData(
                "priceDetails",
                "wedding",
                parseInt(e.target.value) || undefined
              )
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Prix privé (€)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="600"
            min="0"
            value={formData.priceDetails?.private || ""}
            onChange={(e) =>
              updateNestedFormData(
                "priceDetails",
                "private",
                parseInt(e.target.value) || undefined
              )
            }
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Conditions et détails</span>
          <span className="label-text-alt">
            Transport, matériel, conditions particulières...
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Ex: Transport inclus dans un rayon de 50km, setup 1h avant..."
          value={formData.priceDetails?.conditions || ""}
          onChange={(e) =>
            updateNestedFormData("priceDetails", "conditions", e.target.value)
          }
          maxLength={500}
        />
      </div>
    </div>
  );
};

const PortfolioTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
  updateNestedFormData: (field: string, subField: string, value: any) => void;
}> = ({ formData, updateFormData: _updateFormData, updateNestedFormData }) => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Portfolio multimédia</h3>

      {/* Photos */}
      <ImageUpload
        label="Photos"
        value={formData.portfolio?.photos || []}
        onChange={(value) => updateNestedFormData("portfolio", "photos", value)}
        maxImages={8}
      />

      {/* Liens sociaux et plateformes */}
      <div>
        <h4 className="text-lg font-medium mb-4">Liens vers vos plateformes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Spotify</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://open.spotify.com/artist/..."
              value={formData.socialLinks?.spotify || ""}
              onChange={(e) =>
                updateNestedFormData("socialLinks", "spotify", e.target.value)
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">YouTube</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://youtube.com/@..."
              value={formData.socialLinks?.youtube || ""}
              onChange={(e) =>
                updateNestedFormData("socialLinks", "youtube", e.target.value)
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">SoundCloud</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://soundcloud.com/..."
              value={formData.socialLinks?.soundcloud || ""}
              onChange={(e) =>
                updateNestedFormData(
                  "socialLinks",
                  "soundcloud",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Instagram</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://instagram.com/..."
              value={formData.socialLinks?.instagram || ""}
              onChange={(e) =>
                updateNestedFormData("socialLinks", "instagram", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicProfileTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
  onGenerateSlug: () => void;
  // artistData: ArtistProfile | null;
}> = ({
  formData,
  updateFormData,
  onGenerateSlug,
  // artistData: _artistData,
}) => {
  console.log(formData);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Profil public</h3>

      <div className="form-control">
        <label className="cursor-pointer label justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={formData?.isPublic || false}
            onChange={(e) => updateFormData("isPublic", e.target.checked)}
          />
          <div>
            <span className="label-text font-medium">
              Rendre mon profil public
            </span>
            <p className="text-sm text-base-content/60">
              Permettre aux venues de découvrir votre profil et vous contacter
            </p>
          </div>
        </label>
      </div>

      {formData?.isPublic && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">URL personnalisée</span>
              <span className="label-text-alt">Pour partager votre profil</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex">
                <span className="bg-base-200 border border-r-0 border-base-300 rounded-l-lg px-3 py-2 text-sm">
                  stagecomplete.com/artist/
                </span>
                <input
                  type="text"
                  className="input input-bordered rounded-l-none flex-1"
                  placeholder="votre-nom-artiste"
                  value={formData?.publicSlug || ""}
                  onChange={(e) => updateFormData("publicSlug", e.target.value)}
                />
              </div>

              {formData?.publicSlug === "" && (
                <button
                  type="button"
                  onClick={onGenerateSlug}
                  className="btn btn-outline"
                >
                  Générer
                </button>
              )}
            </div>
            {formData.publicSlug && (
              <label className="label">
                <span className="label-text-alt text-success">
                  ✓ Votre profil sera accessible sur: stagecomplete.com/artist/
                  {formData.publicSlug}
                </span>
              </label>
            )}
          </div>

          <div className="alert alert-info">
            <div>
              <h4 className="font-medium">Profil public activé !</h4>
              <p className="text-sm">
                Les venues pourront découvrir votre profil, voir vos
                informations artistiques et vous contacter pour des
                opportunités.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
