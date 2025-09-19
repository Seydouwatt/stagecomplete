import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PublicSearchBar } from '../../components/public/PublicSearchBar';
import { SEOHead } from '../../components/seo/SEOHead';
import { artistService } from '../../services/artistService';
import type { PublicArtistProfile, ArtistSearchFilters } from '../../types';
import { MapPinIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

// Mapping des genres pour URLs SEO-friendly
const GENRE_MAPPING: Record<string, { name: string; description: string; keywords: string[] }> = {
  'jazz': {
    name: 'Jazz',
    description: 'Découvrez les meilleurs artistes de jazz, du jazz moderne au jazz classique, près de chez vous.',
    keywords: ['jazz', 'swing', 'bebop', 'jazz moderne', 'jazz manouche']
  },
  'rock': {
    name: 'Rock',
    description: 'Trouvez des groupes de rock et artistes rock pour vos événements. Rock alternatif, classic rock et plus.',
    keywords: ['rock', 'rock alternatif', 'classic rock', 'hard rock', 'indie rock']
  },
  'pop': {
    name: 'Pop',
    description: 'Artistes pop et groupes pop pour tous vos événements. De la pop française à la pop internationale.',
    keywords: ['pop', 'pop française', 'variété', 'chanson française', 'pop rock']
  },
  'folk': {
    name: 'Folk',
    description: 'Musiciens folk et chanteurs folk authentiques. Folk traditionnel et folk moderne.',
    keywords: ['folk', 'folk traditionnel', 'acoustique', 'chanson', 'world music']
  },
  'blues': {
    name: 'Blues',
    description: 'Les meilleurs artistes de blues pour vos soirées. Blues traditionnel, blues rock et plus.',
    keywords: ['blues', 'blues rock', 'harmonica', 'guitare blues', 'chicago blues']
  },
  'electronic': {
    name: 'Électronique',
    description: 'DJs et producteurs électroniques pour vos événements. House, techno, ambient et plus.',
    keywords: ['électronique', 'house', 'techno', 'DJ', 'musique électronique']
  },
  'classical': {
    name: 'Classique',
    description: 'Musiciens classiques professionnels. Orchestres, quatuors à cordes, pianistes et plus.',
    keywords: ['classique', 'orchestre', 'piano', 'violon', 'musique de chambre']
  }
};

const CITY_MAPPING: Record<string, { name: string; region: string }> = {
  'paris': { name: 'Paris', region: 'Île-de-France' },
  'lyon': { name: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
  'marseille': { name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur' },
  'toulouse': { name: 'Toulouse', region: 'Occitanie' },
  'nice': { name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur' },
  'nantes': { name: 'Nantes', region: 'Pays de la Loire' },
  'bordeaux': { name: 'Bordeaux', region: 'Nouvelle-Aquitaine' },
  'lille': { name: 'Lille', region: 'Hauts-de-France' },
  'strasbourg': { name: 'Strasbourg', region: 'Grand Est' },
  'montpellier': { name: 'Montpellier', region: 'Occitanie' }
};

export const GenreDirectory: React.FC = () => {
  const { genre, city } = useParams<{ genre?: string; city?: string }>();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<PublicArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const genreInfo = genre ? GENRE_MAPPING[genre.toLowerCase()] : null;
  const cityInfo = city ? CITY_MAPPING[city.toLowerCase()] : null;

  // Rediriger si le genre/ville n'existe pas dans notre mapping
  useEffect(() => {
    if (genre && !genreInfo) {
      navigate('/directory', { replace: true });
      return;
    }
    if (city && !cityInfo) {
      navigate('/directory', { replace: true });
      return;
    }
  }, [genre, city, genreInfo, cityInfo, navigate]);

  useEffect(() => {
    loadArtists();
  }, [genre, city, currentPage]);

  const loadArtists = async () => {
    try {
      setLoading(true);

      const filters: ArtistSearchFilters = {
        limit: 12,
        offset: (currentPage - 1) * 12,
      };

      if (genreInfo) {
        filters.genres = [genreInfo.name];
      }

      if (cityInfo) {
        filters.location = cityInfo.name;
      }

      const response = await artistService.searchArtists(filters);

      if (currentPage === 1) {
        setArtists(response.artists);
      } else {
        setArtists(prev => [...prev, ...response.artists]);
      }

      setTotalResults(response.total);
      setHasMore(response.hasMore);

    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Generate SEO data
  const generateSEOData = () => {
    let title = "Annuaire des Artistes";
    let description = "Découvrez des artistes professionnels";
    let keywords = ["artistes", "musiciens"];

    if (genreInfo && cityInfo) {
      title = `Artistes ${genreInfo.name} à ${cityInfo.name}`;
      description = `Trouvez les meilleurs artistes ${genreInfo.name} à ${cityInfo.name}. ${totalResults} profils vérifiés disponibles.`;
      keywords = [...genreInfo.keywords, cityInfo.name, cityInfo.region];
    } else if (genreInfo) {
      title = `Artistes ${genreInfo.name}`;
      description = genreInfo.description + ` ${totalResults} artistes disponibles.`;
      keywords = genreInfo.keywords;
    } else if (cityInfo) {
      title = `Artistes à ${cityInfo.name}`;
      description = `Découvrez tous les artistes professionnels à ${cityInfo.name}, ${cityInfo.region}. ${totalResults} profils disponibles.`;
      keywords = [cityInfo.name, cityInfo.region, "artistes", "musiciens"];
    }

    return { title, description, keywords };
  };

  const seoData = generateSEOData();
  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Artistes', href: '/directory' },
    ...(genreInfo ? [{ label: genreInfo.name, href: `/artistes/${genre}` }] : []),
    ...(cityInfo ? [{ label: cityInfo.name, href: `/artistes/${genre ? `${genre}/` : ''}${city}` }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`/artistes${genre ? `/${genre}` : ''}${city ? `/${city}` : ''}`}
      />

      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-600 font-medium">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.href} className="text-primary hover:text-primary-focus">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {genreInfo && cityInfo && `Artistes ${genreInfo.name} à ${cityInfo.name}`}
              {genreInfo && !cityInfo && `Artistes ${genreInfo.name}`}
              {!genreInfo && cityInfo && `Artistes à ${cityInfo.name}`}
              {!genreInfo && !cityInfo && 'Tous les artistes'}
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              {seoData.description}
            </p>

            {!loading && totalResults > 0 && (
              <p className="text-gray-500">
                {totalResults} artiste{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <PublicSearchBar
              placeholder={`Rechercher ${genreInfo ? `des artistes ${genreInfo.name}` : 'des artistes'}${cityInfo ? ` à ${cityInfo.name}` : ''}...`}
              size="md"
            />
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-4">Filtres rapides :</span>

            {/* Genre filters */}
            {!genreInfo && Object.entries(GENRE_MAPPING).map(([slug, info]) => (
              <Link
                key={slug}
                to={`/artistes/${slug}${city ? `/${city}` : ''}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
              >
                <MusicalNoteIcon className="w-3 h-3" />
                {info.name}
              </Link>
            ))}

            {/* City filters */}
            {!cityInfo && Object.entries(CITY_MAPPING).slice(0, 6).map(([slug, info]) => (
              <Link
                key={slug}
                to={`/artistes${genre ? `/${genre}` : ''}/${slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
              >
                <MapPinIcon className="w-3 h-3" />
                {info.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading && currentPage === 1 ? (
            <div className="flex justify-center py-12">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : artists.length > 0 ? (
            <>
              {/* Artists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {artists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ArtistCard artist={artist} />
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="btn btn-outline btn-lg"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      'Charger plus d\'artistes'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun artiste trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Aucun artiste ne correspond à ces critères pour le moment.
              </p>
              <Link to="/directory" className="btn btn-primary">
                Voir tous les artistes
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Artist Card Component
const ArtistCard: React.FC<{ artist: PublicArtistProfile }> = ({ artist }) => {
  const profilePhoto = artist.coverPhoto || artist.portfolio?.photos?.[0];

  return (
    <Link to={`/artist/${artist.publicSlug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={artist.artistName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {artist.artistName?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
              {artist.artistType === 'SOLO' ? 'Solo' : 'Groupe'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
            {artist.artistName}
          </h3>

          {artist.baseLocation && (
            <div className="flex items-center gap-1 text-gray-500 mb-2">
              <MapPinIcon className="w-3 h-3" />
              <span className="text-sm">{artist.baseLocation}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {artist.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
              >
                {genre}
              </span>
            ))}
            {(artist.genres?.length || 0) > 2 && (
              <span className="text-gray-400 text-xs">
                +{(artist.genres?.length || 0) - 2}
              </span>
            )}
          </div>

          {artist.priceRange && (
            <div className="text-right">
              <span className="text-primary font-semibold text-sm">
                {artist.priceRange}€
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};