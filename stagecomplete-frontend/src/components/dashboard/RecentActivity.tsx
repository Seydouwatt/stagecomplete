import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface Activity {
  id: string;
  type: "booking" | "message" | "payment" | "review";
  title: string;
  description: string;
  timestamp: Date;
  avatar?: string;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: Activity[];
  title?: string;
  maxItems?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  title = "Activité récente",
  maxItems = 5,
}) => {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "booking":
        return "📅";
      case "message":
        return "💬";
      case "payment":
        return "💰";
      case "review":
        return "⭐";
      default:
        return "📋";
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "booking":
        return "bg-primary/10 text-primary";
      case "message":
        return "bg-info/10 text-info";
      case "payment":
        return "bg-success/10 text-success";
      case "review":
        return "bg-warning/10 text-warning";
      default:
        return "bg-base-300 text-base-content";
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn btn-ghost btn-sm">Voir tout</button>
        </div>

        <div className="space-y-4">
          {displayedActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors duration-200"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getActivityColor(
                  activity.type
                )}`}
              >
                {activity.avatar ? (
                  <img
                    src={activity.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  getActivityIcon(activity.type)
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-base-content">
                  {activity.title}
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-base-content/50 mt-2">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-base-content/60">Aucune activité récente</p>
          </div>
        )}
      </div>
    </div>
  );
};
