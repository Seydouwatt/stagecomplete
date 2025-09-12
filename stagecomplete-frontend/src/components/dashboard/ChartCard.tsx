import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-base-100 shadow-lg border border-base-300 ${className}`}
    >
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-base-content">{title}</h3>
            {subtitle && (
              <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
            )}
          </div>

          {actions && actions.length > 0 && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MoreHorizontal className="w-4 h-4" />
              </label>
              {isMenuOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
                >
                  {actions.map((action, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          action.onClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        {action.icon}
                        {action.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Chart Content */}
        <div className="w-full">{children}</div>
      </div>
    </motion.div>
  );
};
