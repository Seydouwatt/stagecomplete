import React from "react";
import {
  Calendar,
  Music,
  TrendingUp,
  MessageSquare,
  Plus,
  Search,
  Upload,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuthStore } from "../../stores/authStore";
import {
  StatCard,
  ChartCard,
  QuickActions,
  RecentActivity,
} from "../../components/dashboard";
import { LineChart, BarChart, DonutChart } from "../../components/charts";
import MobileStatsCarousel from "./MobileStatsCarousel";

export const ArtistDashboard: React.FC = () => {
  const { user } = useAuthStore();

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

  const quickActions = [
    {
      id: "new-event",
      label: "Nouvel événement",
      description: "Créer une nouvelle performance",
      icon: Plus,
      color: "bg-primary",
      onClick: () => console.log("Nouvel événement"),
    },
    {
      id: "find-venues",
      label: "Trouver des venues",
      description: "Explorer de nouveaux lieux",
      icon: Search,
      color: "bg-secondary",
      onClick: () => console.log("Trouver venues"),
    },
    {
      id: "upload-content",
      label: "Upload contenu",
      description: "Ajouter photos/vidéos",
      icon: Upload,
      color: "bg-success",
      onClick: () => console.log("Upload contenu"),
    },
    {
      id: "settings",
      label: "Paramètres",
      description: "Gérer votre profil",
      icon: Settings,
      color: "bg-info",
      onClick: () => console.log("Paramètres"),
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "booking" as const,
      title: "Nouveau booking confirmé",
      description: "Concert au Jazz Club - 15 Décembre",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    },
    {
      id: "2",
      type: "message" as const,
      title: "Message de Le Supersonic",
      description: "Proposition pour soirée du 20 Décembre",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
    },
    {
      id: "3",
      type: "payment" as const,
      title: "Paiement reçu",
      description: "€450 pour concert du 10 Novembre",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      type: "review" as const,
      title: "Nouvelle évaluation",
      description: "5 étoiles de La Maroquinerie",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome section */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
        <div className="hero-content text-center py-8">
          <div className="max-w-md">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Bienvenue, {user?.profile?.name} ! 🎭
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base-content/70 mb-6"
            >
              Votre carrière artistique en plein essor
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

      {/* Stats cards */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        <StatCard
          title="Bookings ce mois"
          value="12"
          change={{ value: 25, type: "increase" }}
          icon={Calendar}
          color="primary"
        />
        <StatCard
          title="Venues partenaires"
          value="8"
          change={{ value: 12, type: "increase" }}
          icon={Music}
          color="secondary"
        />
        <StatCard
          title="Revenue total"
          value="€2,400"
          change={{ value: 8, type: "increase" }}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Messages non lus"
          value="3"
          icon={MessageSquare}
          color="warning"
        />
      </div>

      {/* Mobile carousel */}
      <MobileStatsCarousel>
        <StatCard
          title="Bookings ce mois"
          value="12"
          change={{ value: 25, type: "increase" }}
          icon={Calendar}
          color="primary"
        />
        <StatCard
          title="Venues partenaires"
          value="8"
          change={{ value: 12, type: "increase" }}
          icon={Music}
          color="secondary"
        />
        <StatCard
          title="Revenue total"
          value="€2,400"
          change={{ value: 8, type: "increase" }}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Messages non lus"
          value="3"
          icon={MessageSquare}
          color="warning"
        />
      </MobileStatsCarousel>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <QuickActions actions={quickActions} />
        <RecentActivity activities={recentActivities} />
      </div>
    </motion.div>
  );
};
