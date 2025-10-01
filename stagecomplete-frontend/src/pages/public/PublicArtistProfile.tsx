import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Mail,
  MapPin,
  Calendar,
  Star,
  Users,
  Music,
  Camera,
  Globe,
  FileText,
  DollarSign,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "../../stores/useToastStore";
import { artistService } from "../../services/artistService";
import { trackProfileView } from "../../services/metricsService";
import {
  SEOHead,
  SEO_TEMPLATES,
  generateArtistSchema,
} from "../../components/seo/SEOHead";
import type { PublicArtistProfile as PublicArtistProfileType } from "../../types";
import { getMainPhoto } from "../../types";

// Sous-composants des onglets
import { OverviewTab } from "../../components/public/artist/OverviewTab";
import { GeneralInfoTab } from "../../components/public/artist/GeneralInfoTab";
import { PortfolioTab } from "../../components/public/artist/PortfolioTab";
import { SocialLinksTab } from "../../components/public/artist/SocialLinksTab";
import { MembersTab } from "../../components/public/artist/MembersTab";
import { TechnicalSheetTab } from "../../components/public/artist/TechnicalSheetTab";
import { PricingTab } from "../../components/public/artist/PricingTab";
import { ContactTab } from "../../components/public/artist/ContactTab";

// Types pour les onglets
interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ artistProfile: PublicArtistProfileType }>;
  requiresAuth?: boolean;
  requiresVenue?: boolean;
  condition?: (profile: PublicArtistProfileType) => boolean;
}

export const PublicArtistProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [artistProfile, setArtistProfile] =
    useState<PublicArtistProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Configuration des onglets
  const tabsConfig: TabConfig[] = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <Star className="w-4 h-4" />,
      component: OverviewTab,
    },
    {
      id: "general",
      label: "Informations",
      icon: <FileText className="w-4 h-4" />,
      component: GeneralInfoTab,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: <Camera className="w-4 h-4" />,
      component: PortfolioTab,
    },
    {
      id: "social",
      label: "Réseaux sociaux",
      icon: <Globe className="w-4 h-4" />,
      component: SocialLinksTab,
    },
    {
      id: "members",
      label: "Membres",
      icon: <Users className="w-4 h-4" />,
      component: MembersTab,
      condition: (profile) => (profile.memberCount || 0) > 1,
    },
    {
      id: "technical",
      label: "Fiche technique",
      icon: <Music className="w-4 h-4" />,
      component: TechnicalSheetTab,
      requiresAuth: true,
      requiresVenue: true,
    },
    {
      id: "pricing",
      label: "Tarifs",
      icon: <DollarSign className="w-4 h-4" />,
      component: PricingTab,
      requiresAuth: true,
      requiresVenue: true,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Mail className="w-4 h-4" />,
      component: ContactTab,
      requiresAuth: true,
      requiresVenue: true,
    },
  ];

  // Filtrer les onglets selon les permissions et conditions
  const availableTabs = tabsConfig.filter((tab) => {
    // Vérifier les conditions spécifiques
    if (tab.condition && artistProfile && !tab.condition(artistProfile)) {
      return false;
    }

    // Vérifier les permissions d'authentification
    if (tab.requiresAuth && !isAuthenticated) {
      return false;
    }

    // Vérifier les permissions venue
    if (tab.requiresVenue && (!isAuthenticated || user?.role !== "VENUE")) {
      return false;
    }

    return true;
  });

  // Charger le profil artiste
  useEffect(() => {
    const loadArtistProfile = async () => {
      if (!slug) {
        setError("Slug manquant dans l'URL");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Utiliser l'API réelle
        const profile = await artistService.getPublicArtistProfile(slug);
        setArtistProfile(profile);

        // Mise à jour des meta tags pour SEO
        updateMetaTags(profile);
      } catch (err: any) {
        console.error("Erreur lors du chargement du profil:", err);
        setError(err.message || "Erreur lors du chargement du profil");
        toast.error("Impossible de charger le profil artiste");
      } finally {
        setIsLoading(false);
      }
    };

    loadArtistProfile();
  }, [slug]);

  // Track profile view
  useEffect(() => {
    if (slug && artistProfile) {
      trackProfileView(slug);
    }
  }, [slug, artistProfile]);

  // Mise à jour des meta tags pour SEO
  const updateMetaTags = (profile: PublicArtistProfileType) => {
    const artistName = artistProfile?.profile?.name || "Artiste";
    document.title = `${artistName} - Artiste ${profile.genres.join(
      ", "
    )} | StageComplete`;

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Découvrez ${artistName}, artiste ${profile.genres.join(", ")} ${
          profile.profile.location ? `basé à ${profile.profile.location}` : ""
        }. ${profile.artisticBio?.substring(0, 120)}...`
      );
    }

    // OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        "content",
        `${artistName} - Artiste ${profile.genres.join(", ")}`
      );
    }

    // OpenGraph type
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute("content", "profile");
    }
  };

  // Partage du profil
  const handleShare = async () => {
    const url = window.location.href;
    const artistName = artistProfile?.profile?.name || "Artiste";
    const title = `${artistName} - Artiste sur StageComplete`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // Fallback: copier dans le presse-papier
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papier");
      }
    } else {
      // Fallback: copier dans le presse-papier
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  // Contact direct
  const handleContact = () => {
    if (artistProfile?.profile.user.id && user?.role === "VENUE") {
      const email = `contact@stagecomplete.com`; // TODO: email réel de l'artiste
      const artistName = artistProfile?.profile?.name || "Artiste";
      const subject = `Demande de contact via StageComplete - ${artistName}`;
      const body = `Bonjour,\n\nJe suis intéressé(e) par vos services pour un événement.\n\nCordialement`;

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    } else {
      toast.error(
        "Vous devez être connecté en tant que venue pour contacter cet artiste"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p className="text-base-content/70">
            Chargement du profil artiste...
          </p>
        </div>
      </div>
    );
  }

  if (error || !artistProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-error mb-4">
            Profil introuvable
          </h1>
          <p className="text-base-content/70 mb-6">
            {error ||
              "Ce profil artiste n'existe pas ou n'est plus accessible."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const ActiveTabComponent =
    availableTabs.find((tab) => tab.id === activeTab)?.component || OverviewTab;

  // SEO Data
  const seoData = SEO_TEMPLATES.artist(artistProfile);

  return (
    <div className="min-h-screen bg-base-200" data-cy="public-artist-profile">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`/artist/${artistProfile.publicSlug}`}
        type="profile"
        image={getMainPhoto(artistProfile) || undefined}
        schemaData={generateArtistSchema(artistProfile)}
      />
      {/* Header avec photo de couverture */}
      <div
        className="relative h-64 bg-gradient-to-r from-primary to-secondary overflow-hidden"
        data-cy="profile-header"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
            >
              {/* Avatar */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 bg-gradient-to-br from-purple-400 to-blue-500">
                  {getMainPhoto(artistProfile) ? (
                    <img
                      src={getMainPhoto(artistProfile)!}
                      alt={artistProfile.profile.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {artistProfile.profile.name?.[0]?.toUpperCase() || "A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Infos principales */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2" data-cy="artist-name">
                  {artistProfile.profile.name || "Artiste"}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                  <div
                    className="flex items-center gap-1"
                    data-cy="artist-genres"
                  >
                    <Music className="w-4 h-4" />
                    {artistProfile.genres.join(", ")}
                  </div>
                  {artistProfile.profile.location && (
                    <div
                      className="flex items-center gap-1"
                      data-cy="artist-location"
                    >
                      <MapPin className="w-4 h-4" />
                      {artistProfile.profile.location}
                    </div>
                  )}
                  <div
                    className="flex items-center gap-1"
                    data-cy="artist-experience"
                  >
                    <Calendar className="w-4 h-4" />
                    {artistProfile.yearsActive} ans d'expérience
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2" data-cy="social-sharing">
                <button
                  onClick={handleShare}
                  className="btn btn-outline btn-sm text-white border-white/50 hover:bg-white hover:text-primary"
                  data-cy="share-button"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
                {isAuthenticated && user?.role === "VENUE" && (
                  <button
                    onClick={handleContact}
                    className="btn btn-primary btn-sm"
                    data-cy="contact-cta"
                  >
                    <Mail className="w-4 h-4" />
                    Contacter
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="tabs tabs-bordered flex overflow-x-auto">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab tab-bordered gap-2 flex-shrink-0 ${
                  activeTab === tab.id ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ActiveTabComponent artistProfile={artistProfile} />
        </motion.div>
      </div>

      {/* Bouton retour flottant */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 left-6 btn btn-circle btn-primary shadow-lg z-20"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
};
