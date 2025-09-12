import React from "react";
import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export const VenueDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      label: "Événements ce mois",
      value: "24",
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Artistes bookés",
      value: "16",
      icon: Users,
      color: "text-secondary",
    },
    {
      label: "Taux d'occupation",
      value: "87%",
      icon: TrendingUp,
      color: "text-success",
    },
    { label: "Capacité venue", value: "300", icon: MapPin, color: "text-info" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="hero bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">
              Bienvenue, {user?.profile?.name} ! 🎪
            </h1>
            <p className="py-4 text-base-content/70">
              Votre espace venue pour gérer vos événements et découvrir de
              nouveaux talents.
            </p>
            <button className="btn btn-secondary">
              Programmer un événement
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

      {/* Management sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Planning cette semaine</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <p className="font-medium">Concert Jazz Trio</p>
                  <p className="text-sm text-base-content/60">
                    Aujourd'hui, 20h30
                  </p>
                </div>
                <span className="badge badge-success">Live</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div>
                  <p className="font-medium">Soirée Stand-up</p>
                  <p className="text-sm text-base-content/60">Demain, 21h</p>
                </div>
                <span className="badge badge-info">Préparation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Demandes de booking</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-secondary/20">
                      <span className="text-sm">🎭</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Marie Dubois</p>
                    <p className="text-sm text-base-content/60">
                      Concert acoustique
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-success btn-sm">✓</button>
                  <button className="btn btn-error btn-sm">✗</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
