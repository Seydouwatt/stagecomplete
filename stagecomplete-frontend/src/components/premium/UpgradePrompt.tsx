import React from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  MessageSquareIcon,
  CalendarIcon,
  SearchIcon,
  TrendingUpIcon,
  Crown,
} from "lucide-react";

interface UpgradePromptProps {
  onClose?: () => void;
  trigger?: "sidebar" | "feature" | "photo_limit";
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  onClose,
  trigger = "feature",
  className = "",
}) => {
  const premiumFeatures = [
    {
      icon: MessageSquareIcon,
      title: "Messages illimités",
      description: "Communiquez avec les venues sans limite",
    },
    {
      icon: CalendarIcon,
      title: "Calendrier complet",
      description: "Gérez tous vos événements et bookings",
    },
    {
      icon: SearchIcon,
      title: "Recherche avancée venues",
      description: "Trouvez les venues parfaites pour vos concerts",
    },
    {
      icon: TrendingUpIcon,
      title: "Statistiques détaillées",
      description: "Analysez votre performance et audience",
    },
  ];

  const getTriggerMessage = () => {
    switch (trigger) {
      case "photo_limit":
        return "Vous avez atteint la limite de 4 photos gratuites";
      case "sidebar":
        return "Débloquez toutes les fonctionnalités";
      default:
        return "Cette fonctionnalité est réservée aux membres Premium";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-xl ${className}`}
    >
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Passez à Premium
              </h3>
              <p className="text-purple-700 text-sm">{getTriggerMessage()}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm hover:bg-purple-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg p-4 border border-purple-100 mb-6">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-bold text-purple-600">9€</span>
              <span className="text-gray-500">/mois</span>
            </div>
            <p className="text-gray-600 text-sm">
              Sans engagement • Résiliable à tout moment
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-purple-600" />
            Fonctionnalités Premium :
          </h4>

          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{feature.title}</h5>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}

          {trigger === "photo_limit" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-200"
            >
              <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h5 className="font-medium text-purple-900">
                  10 photos de portfolio
                </h5>
                <p className="text-sm text-purple-700">
                  Montrez plus de votre talent avec 6 photos supplémentaires
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button className="btn bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Passer à Premium maintenant
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-gray-500">
            ✨ Essai gratuit de 7 jours • Sans engagement
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradePrompt;
