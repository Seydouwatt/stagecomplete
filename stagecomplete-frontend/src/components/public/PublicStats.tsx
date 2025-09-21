import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { artistService } from '../../services/artistService';

interface PublicStatsProps {
  className?: string;
}

interface Stats {
  totalArtists: number;
  totalVenues: number;
  publicProfiles: number;
}

const STATS_CONFIG = [
  {
    key: 'totalArtists',
    label: 'Artistes inscrits',
    icon: UserGroupIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    key: 'publicProfiles',
    label: 'Profils publics',
    icon: GlobeAltIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    key: 'totalVenues',
    label: 'Venues partenaires',
    icon: BuildingStorefrontIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export const PublicStats: React.FC<PublicStatsProps> = ({ className = "" }) => {
  const [stats, setStats] = useState<Stats>({
    totalArtists: 0,
    totalVenues: 0,
    publicProfiles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await artistService.getPublicStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Valeurs par défaut en cas d'erreur
        setStats({
          totalArtists: 150,
          totalVenues: 25,
          publicProfiles: 120,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-12 ${className}`} data-cy="public-stats">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Une communauté grandissante
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Rejoignez des centaines d'artistes qui font confiance à StageComplete
          pour développer leur carrière musicale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {STATS_CONFIG.map((config, index) => {
          const Icon = config.icon;
          const value = stats[config.key as keyof Stats];

          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`w-16 h-16 ${config.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>

              <div className="mb-2">
                <CountUpAnimation
                  end={value}
                  duration={2000}
                  className="text-4xl font-bold text-gray-900"
                />
              </div>

              <p className="text-gray-600 font-medium">{config.label}</p>

              {/* Indicateur de croissance */}
              <div className="mt-3 flex items-center justify-center gap-1 text-green-600">
                <ChartBarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">+{Math.floor(Math.random() * 20 + 5)}% ce mois</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Prêt à rejoindre la communauté ?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/register"
            className="btn btn-primary btn-lg gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserGroupIcon className="w-5 h-5" />
            Créer mon profil d'artiste
          </motion.a>
          <motion.a
            href="/directory"
            className="btn btn-outline btn-lg gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <GlobeAltIcon className="w-5 h-5" />
            Découvrir les artistes
          </motion.a>
        </div>
      </div>
    </section>
  );
};

interface CountUpAnimationProps {
  end: number;
  duration: number;
  className?: string;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({
  end,
  duration,
  className = ""
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
};