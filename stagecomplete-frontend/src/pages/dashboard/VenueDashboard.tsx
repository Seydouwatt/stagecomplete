import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Plus,
  Search,
  BarChart3,
  Clock,
  MessageSquare,
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
import { useBookingRequestStats } from "../../hooks/useBookingRequests";
import { useUnreadMessagesCount, useConversations } from "../../hooks/useMessages";

export const VenueDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Récupérer les stats réelles
  const { stats: bookingStats } = useBookingRequestStats();
  const { count: unreadMessagesCount } = useUnreadMessagesCount();
  const { conversations } = useConversations();

  // Données mockées pour les charts
  const occupancyData = [
    { name: "Jan", value: 65 },
    { name: "Fév", value: 70 },
    { name: "Mar", value: 80 },
    { name: "Avr", value: 85 },
    { name: "Mai", value: 90 },
    { name: "Jun", value: 95 },
    { name: "Jul", value: 87 },
  ];

  const eventTypeData = [
    { name: "Concerts", value: 45, color: "#3b82f6" },
    { name: "Stand-up", value: 25, color: "#8b5cf6" },
    { name: "Théâtre", value: 20, color: "#10b981" },
    { name: "Autres", value: 10, color: "#f59e0b" },
  ];

  const weeklyRevenueData = [
    { name: "Lun", value: 1200 },
    { name: "Mar", value: 1800 },
    { name: "Mer", value: 1500 },
    { name: "Jeu", value: 2200 },
    { name: "Ven", value: 3500 },
    { name: "Sam", value: 4200 },
    { name: "Dim", value: 2800 },
  ];

  const quickActions = [
    {
      id: "schedule-event",
      label: "Programmer événement",
      description: "Ajouter un nouvel événement",
      icon: Plus,
      color: "bg-primary",
      onClick: () => console.log("Programmer événement"),
    },
    {
      id: "find-artists",
      label: "Trouver des artistes",
      description: "Explorer de nouveaux talents",
      icon: Search,
      color: "bg-secondary",
      onClick: () => navigate("/browse"),
    },
    {
      id: "messages",
      label: "Messages",
      description: `${unreadMessagesCount} non lus`,
      icon: MessageSquare,
      color: "bg-success",
      onClick: () => navigate("/messages"),
    },
    {
      id: "schedule",
      label: "Planning",
      description: "Gérer les créneaux",
      icon: Clock,
      color: "bg-info",
      onClick: () => console.log("Planning"),
    },
  ];

  // Convertir les conversations récentes en activités
  const recentActivities = conversations
    .slice(0, 5) // Prendre les 5 dernières
    .map((conversation) => ({
      id: conversation.eventId,
      type: "message" as const,
      title: conversation.status === 'PENDING'
        ? `Nouvelle demande de ${conversation.participant.name}`
        : `Message de ${conversation.participant.name}`,
      description: conversation.lastMessage?.content
        ? conversation.lastMessage.content.slice(0, 60) + (conversation.lastMessage.content.length > 60 ? '...' : '')
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
    >
      {/* Welcome section */}
      <div className="hero bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl">
        <div className="hero-content text-center py-8">
          <div className="max-w-md">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Bienvenue, {user?.profile?.name} ! 🎪
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base-content/70 mb-6"
            >
              Votre venue, centre de la scène artistique locale
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="btn btn-secondary"
            >
              Programmer un événement
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Demandes en attente"
          value={String(bookingStats.pending)}
          icon={Calendar}
          color="warning"
        />
        <StatCard
          title="Bookings acceptés"
          value={String(bookingStats.accepted)}
          icon={Users}
          color="success"
        />
        <StatCard
          title="Messages non lus"
          value={String(unreadMessagesCount)}
          icon={MessageSquare}
          color="primary"
        />
        <StatCard
          title="Conversations actives"
          value={String(conversations.length)}
          icon={TrendingUp}
          color="info"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Taux d'occupation"
          subtitle="Évolution mensuelle du remplissage"
          actions={[
            {
              label: "Exporter",
              onClick: () => console.log("Export"),
              icon: <TrendingUp className="w-4 h-4" />,
            },
          ]}
        >
          <LineChart data={occupancyData} color="#8b5cf6" />
        </ChartCard>

        <ChartCard
          title="Types d'événements"
          subtitle="Répartition par catégorie"
        >
          <DonutChart data={eventTypeData} />
        </ChartCard>
      </div>

      {/* Revenue chart */}
      <ChartCard
        title="Revenus hebdomadaires"
        subtitle="Chiffre d'affaires par jour"
        className="col-span-full"
      >
        <BarChart data={weeklyRevenueData} color="#10b981" />
      </ChartCard>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions actions={quickActions} title="Actions rapides" />
        <RecentActivity
          activities={recentActivities}
          title="Activité récente"
        />
      </div>
    </motion.div>
  );
};
