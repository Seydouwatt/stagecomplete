import React from "react";

import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon: React.ComponentType<{ className?: string }>;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  trend?: Array<{ name: string; value: number }>;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = "primary",
  trend,
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    info: "text-info bg-info/10",
  };

  const changeColor =
    change?.type === "increase"
      ? "text-success"
      : change?.type === "decrease"
      ? "text-error"
      : "text-base-content/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-300"
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-base-content/70 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-base-content">{value}</p>

            {change && (
              <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
                <span className="font-medium">
                  {change.type === "increase"
                    ? "↗"
                    : change.type === "decrease"
                    ? "↘"
                    : "→"}
                  {Math.abs(change.value)}%
                </span>
                <span className="ml-1 text-base-content/60">
                  vs mois dernier
                </span>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {trend && trend.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end justify-between h-8">
              {trend.map((point, index) => (
                <div
                  key={index}
                  className={`w-2 rounded-t ${
                    colorClasses[color].split(" ")[1]
                  } opacity-60`}
                  style={{
                    height: `${
                      (point.value / Math.max(...trend.map((p) => p.value))) *
                      100
                    }%`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
