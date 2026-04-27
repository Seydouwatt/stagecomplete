import React from "react";
import {
  Eye,
  MousePointer,
  MessageSquare,
  Plus,
  Search,
  Upload,
  Settings,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import {
  StatCard,
  ChartCard,
  QuickActions,
  RecentActivity,
} from "../../components/dashboard";
import { LineChart, BarChart, DonutChart } from "../../components/charts";
import MobileStatsCarousel from "./MobileStatsCarousel";
import ProfileCompletionPrompt from "../../components/dashboard/ProfileCompletionPrompt";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";
import { getArtistMetrics } from "../../services/metricsService";
import { useUnreadMessagesCount, useConversations } from "../../hooks/useMessages";
import { artistService } from "../../services/artistService";

export const ArtistDashboard: React.FC = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const { shouldShowAssistantPrompt, completionPercentage } =
    useProfileCompletion();

  // Fetch real artist metrics
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["artist-metrics"],
    queryFn: () => getArtistMetrics(token!),
    enabled: !!token && user?.role === "ARTIST",
  });

  // Fetch artist profile pour le publicSlug
  const { data: artistProfile } = useQuery({
    queryKey: ["my-artist-profile"],
    queryFn: () => artistService.getMyArtistProfile(),
    enabled: !!token && user?.role === "ARTIST",
  });

  const { count: unreadMessagesCount } = useUnreadMessagesCount();
  const { conversations } = useConversations();

  const metrics = metricsData?.metrics;

  // Données mockées pour les charts
  const revenueData = [
    { name: "Jan", value: 400 },
    { name: "Fév", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Avr", value: 800 },
    { name: "Mai", value: 700 },
    { name: "Jun", value: 900 },
    { name: "Jul", value: 1200 },
  ];

  const genreData = [
    { name: "Jazz", value: 40, color: "#3b82f6" },
    { name: "Blues", value: 30, color: "#8b5cf6" },
    { name: "Soul", value: 20, color: "#10b981" },
    { name: "Funk", value: 10, color: "#f59e0b" },
  ];

  const performanceData = [
    { name: "Lun", value: 80 },
    { name: "Mar", value: 95 },
    { name: "Mer", value: 75 },
    { name: "Jeu", value: 90 },
    { name: "Ven", value: 100 },
    { name: "Sam", value: 85 },
    { name: "Dim", value: 70 },
  ];

  // Actions adaptées selon la complétude du profil
  const getQuickActions = () => {
    if (shouldShowAssistantPrompt) {
      // Actions prioritaires pour profil incomplet
      return [
        {
          id: "complete-profile",
          label: "Compléter le profil",
          description: "Utiliser l'assistant guidé",
          icon: Upload,
          color: "bg-purple-500",
          onClick: () => navigate("/artist/portfolio"),
        },
        {
          id: "add-photos",
          label: "Ajouter des photos",
          description: "Portfolio et galerie",
          icon: Upload,
          color: "bg-success",
          onClick: () => navigate("/artist/portfolio"),
        },
        {
          id: "edit-profile",
          label: "Éditer mon profil",
          description: "Informations de base",
          icon: Settings,
          color: "bg-info",
          onClick: () => navigate("/artist/portfolio"),
        },
        {
          id: "view-profile",
          label: "Voir ma fiche publique",
          description: "Comment les venues me voient",
          icon: Search,
          color: "bg-secondary",
          onClick: () => {
            if (artistProfile?.publicSlug) {
              window.open(`/artist/${artistProfile.publicSlug}`, "_blank");
            } else {
              navigate("/artist/portfolio");
            }
          },
        },
      ];
    } else {
      // Actions standard pour profil complet
      return [
        {
          id: "new-event",
          label: "Nouvel événement",
          description: "Créer une nouvelle performance",
          icon: Plus,
          color: "bg-primary",
          onClick: () => navigate("/artist/bookings/new"),
        },
        {
          id: "find-venues",
          label: "Trouver des venues",
          description: "Explorer de nouveaux lieux",
          icon: Search,
          color: "bg-secondary",
          onClick: () => navigate("/browse"),
        },
        {
          id: "upload-content",
          label: "Upload contenu",
          description: "Ajouter photos/vidéos",
          icon: Upload,
          color: "bg-success",
          onClick: () => navigate("/artist/portfolio"),
        },
        {
          id: "settings",
          label: "Paramètres",
          description: "Gérer votre profil",
          icon: Settings,
          color: "bg-info",
          onClick: () => navigate("/settings"),
        },
      ];
    }
  };

  const quickActions = getQuickActions();

  const recentActivities = conversations.slice(0, 5).map((conversation) => ({
    id: conversation.eventId,
    type: "message" as const,
    title:
      conversation.status === "PENDING"
        ? `Demande de ${conversation.participant.name}`
        : `Message de ${conversation.participant.name}`,
    description: conversation.lastMessage?.content
      ? conversation.lastMessage.content.slice(0, 60) +
        (conversation.lastMessage.content.length > 60 ? "..." : "")
      : conversation.title,
    timestamp: conversation.lastMessage
      ? new Date(conversation.lastMessage.createdAt)
      : new Date(conversation.createdAt),
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-cy="artist-dashboard"
    >
      {/* Welcome section */}
      {shouldShowAssistantPrompt ? (
        <>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4 artist-name"
            data-testid="artist-name"
            data-cy="artist-name"
          >
            Bienvenue, {user?.profile?.name} ! 🎭
          </motion.h1>
          <ProfileCompletionPrompt className="mb-6" />
        </>
      ) : (
        <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
          <div className="hero-content text-center py-8">
            <div className="max-w-md">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-4 artist-name"
                data-testid="artist-name"
                data-cy="artist-name"
              >
                Bienvenue, {user?.profile?.name} ! 🎭
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base-content/70 mb-6"
              >
                Votre profil est complet à {completionPercentage}% ! Prêt pour
                de nouveaux défis.
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="btn btn-primary"
              >
                Créer un nouvel événement
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6" data-cy="statistics-section">
        <h2 className="sr-only">Statistics</h2>
        <StatCard
          title="Vues de profil"
          value={isLoadingMetrics ? "..." : String(metrics?.profileViews || 0)}
          change={metrics?.trends?.views}
          icon={Eye}
          color="primary"
        />
        <StatCard
          title="Clics depuis recherche"
          value={isLoadingMetrics ? "..." : String(metrics?.searchClicks || 0)}
          change={metrics?.trends?.clicks}
          icon={MousePointer}
          color="secondary"
        />
        <StatCard
          title="Demandes reçues"
          value={isLoadingMetrics ? "..." : String(metrics?.venueRequests || 0)}
          change={metrics?.trends?.requests}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Messages non lus"
          value={String(unreadMessagesCount)}
          icon={MessageSquare}
          color="warning"
        />
      </div>

      {/* Mobile carousel */}
      <MobileStatsCarousel>
        <StatCard
          title="Vues de profil"
          value={isLoadingMetrics ? "..." : String(metrics?.profileViews || 0)}
          change={metrics?.trends?.views}
          icon={Eye}
          color="primary"
        />
        <StatCard
          title="Clics depuis recherche"
          value={isLoadingMetrics ? "..." : String(metrics?.searchClicks || 0)}
          change={metrics?.trends?.clicks}
          icon={MousePointer}
          color="secondary"
        />
        <StatCard
          title="Demandes reçues"
          value={isLoadingMetrics ? "..." : String(metrics?.venueRequests || 0)}
          change={metrics?.trends?.requests}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Messages non lus"
          value={String(unreadMessagesCount)}
          icon={MessageSquare}
          color="warning"
        />
      </MobileStatsCarousel>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-cy="charts-section">
        <h2 className="sr-only">Charts</h2>
        <ChartCard
          title="Évolution des revenus"
          subtitle="Revenue mensuel en euros"
          actions={[
            {
              label: "Exporter",
              onClick: () => console.log("Export"),
              icon: <TrendingUp className="w-4 h-4" />,
            },
          ]}
        >
          <LineChart data={revenueData} color="#3b82f6" />
        </ChartCard>

        <ChartCard
          title="Répartition par genre"
          subtitle="Performances par style musical"
        >
          <DonutChart data={genreData} />
        </ChartCard>
      </div>

      {/* Performance metrics */}
      <ChartCard
        title="Performance hebdomadaire"
        subtitle="Audience et engagement par jour"
        className="col-span-full"
      >
        <BarChart data={performanceData} color="#8b5cf6" />
      </ChartCard>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-cy="quick-actions-section">
          <h2 className="sr-only">Quick actions</h2>
          <QuickActions actions={quickActions} />
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </motion.div>
  );
};
