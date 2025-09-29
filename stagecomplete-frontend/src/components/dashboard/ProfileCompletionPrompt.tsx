import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  WandIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CircleIcon,
  UserIcon,
  MusicIcon,
  CameraIcon,
  MapPinIcon,
} from "lucide-react";
import { useProfileCompletion } from "../../hooks/useProfileCompletion";

interface ProfileCompletionPromptProps {
  className?: string;
}

export const ProfileCompletionPrompt: React.FC<ProfileCompletionPromptProps> = ({
  className = "",
}) => {
  const {
    completionPercentage,
    missingItems,
    shouldShowAssistantPrompt
  } = useProfileCompletion();

  if (!shouldShowAssistantPrompt) {
    return null;
  }

  const getItemIcon = (key: string) => {
    const iconMap: Record<string, React.ElementType> = {
      basic_info: UserIcon,
      genres: MusicIcon,
      instruments: MusicIcon,
      portfolio_photos: CameraIcon,
      location: MapPinIcon,
    };
    const IconComponent = iconMap[key] || CircleIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-200 shadow-xl ${className}`}
    >
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <WandIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Complétez votre profil avec l'assistant
            </h3>
            <p className="text-gray-600">
              Votre profil est à <strong>{completionPercentage}%</strong>.
              Utilisez notre assistant pour attirer plus de venues !
            </p>
          </div>
        </div>

        {/* Completion Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression du profil
            </span>
            <span className="text-sm text-purple-600 font-semibold">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Missing Items Preview */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>Éléments manquants :</span>
          </h4>
          <div className="space-y-2">
            {missingItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100"
              >
                <div className="w-6 h-6 text-gray-400">
                  {getItemIcon(item.key)}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <CircleIcon className="w-4 h-4 text-gray-300" />
              </motion.div>
            ))}
            {missingItems.length > 4 && (
              <p className="text-xs text-gray-500 pl-9">
                ... et {missingItems.length - 4} autre{missingItems.length - 4 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Why Complete */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-purple-900 mb-2">
            Pourquoi compléter votre profil ?
          </h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-purple-600" />
              Apparaître en priorité dans les recherches
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-purple-600" />
              Recevoir 3x plus de demandes de venues
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-purple-600" />
              Crédibilité professionnelle renforcée
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/artist/portfolio?openWizard=true"
            className="btn bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700 flex-1 flex items-center justify-center gap-2"
          >
            <WandIcon className="w-5 h-5" />
            Utiliser l'assistant
            <ArrowRightIcon className="w-4 h-4" />
          </Link>

          <Link
            to="/artist/portfolio"
            className="btn btn-outline btn-primary flex items-center gap-2"
          >
            Compléter manuellement
          </Link>
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          ✨ L'assistant vous guide étape par étape en 5 minutes
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionPrompt;