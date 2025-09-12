import React from "react";
// import { Anchor } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = "Actions rapides",
}) => {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className="flex items-center gap-3 p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-200 text-left"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base-content">
                    {action.label}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {action.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
