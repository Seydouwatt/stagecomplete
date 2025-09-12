import React from "react";
import { Calendar, Music, TrendingUp, MessageSquare } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export const ArtistDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      label: "Bookings ce mois",
      value: "12",
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Venues partenaires",
      value: "8",
      icon: Music,
      color: "text-secondary",
    },
    {
      label: "Revenue total",
      value: "€2,400",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Messages non lus",
      value: "3",
      icon: MessageSquare,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">
              Bienvenue, {user?.profile?.name} ! 🎭
            </h1>
            <p className="py-4 text-base-content/70">
              Votre espace artiste pour gérer vos performances et développer
              votre carrière.
            </p>
            <button className="btn btn-primary">
              Créer un nouvel événement
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat bg-base-200 rounded-2xl">
              <div className="stat-figure">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value text-2xl">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Prochains événements</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <p className="font-medium">Concert au Supersonic</p>
                  <p className="text-sm text-base-content/60">
                    15 Nov 2025, 20h
                  </p>
                </div>
                <span className="badge badge-primary">Confirmé</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <p className="font-medium">Showcase Festival</p>
                  <p className="text-sm text-base-content/60">
                    22 Nov 2025, 18h
                  </p>
                </div>
                <span className="badge badge-warning">En attente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Messages récents</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full bg-primary/20">
                    <span className="text-sm">🎪</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Le Bataclan</p>
                  <p className="text-sm text-base-content/60">
                    Nouvelle proposition de concert...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
