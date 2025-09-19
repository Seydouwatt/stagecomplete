import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  schemaData?: object;
  noIndex?: boolean;
  canonical?: string;
}

const DEFAULT_TITLE = "StageComplete - Découvrez des artistes exceptionnels";
const DEFAULT_DESCRIPTION = "La plus grande communauté d'artistes professionnels. Trouvez le talent idéal près de chez vous ou partagez votre passion avec le monde entier.";
const DEFAULT_IMAGE = "/images/stagecomplete-og-image.jpg";
const DEFAULT_KEYWORDS = [
  "artistes", "musique", "spectacle", "concert", "booking",
  "musicien", "groupe", "solo", "jazz", "rock", "pop"
];
const SITE_NAME = "StageComplete";
const SITE_URL = "https://stagecomplete.com";

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  schemaData,
  noIndex = false,
  canonical
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', fullImage, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', SITE_NAME, true);
    updateMetaTag('og:locale', 'fr_FR', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImage);

    // Robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Schema.org structured data
    if (schemaData) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    }

  }, [fullTitle, description, keywords, fullImage, fullUrl, type, twitterCard, canonicalUrl, noIndex, schemaData]);

  return null; // This component only manages document head, no render
};

// Hooks et utilitaires SEO
export const generateArtistSchema = (artist: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artist.artistName,
    "description": artist.artistDescription,
    "image": artist.coverPhoto || artist.portfolio?.photos?.[0],
    "genre": artist.genres,
    "url": `${SITE_URL}/artist/${artist.publicSlug}`,
    "location": {
      "@type": "Place",
      "name": artist.baseLocation
    },
    "sameAs": [
      artist.socialLinks?.spotify,
      artist.socialLinks?.youtube,
      artist.socialLinks?.instagram,
      artist.socialLinks?.soundcloud
    ].filter(Boolean)
  };
};

export const generateSearchSchema = (query: string, resultsCount: number) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `Recherche : ${query}`,
    "description": `${resultsCount} artistes trouvés pour "${query}"`,
    "url": `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "description": DEFAULT_DESCRIPTION,
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${SITE_URL}/contact`
    },
    "sameAs": [
      "https://facebook.com/stagecomplete",
      "https://twitter.com/stagecomplete",
      "https://instagram.com/stagecomplete"
    ]
  };
};

// Template pour les meta tags des pages spécifiques
export const SEO_TEMPLATES = {
  home: {
    title: "StageComplete - Plateforme de découverte d'artistes professionnels",
    description: "Découvrez des artistes exceptionnels près de chez vous. Plus de 150 musiciens et groupes professionnels vous attendent sur StageComplete.",
    keywords: ["plateforme artistes", "découverte musicale", "booking artistes", "musiciens professionnels"]
  },

  search: (query: string, location?: string) => ({
    title: `Recherche: ${query}${location ? ` à ${location}` : ''} - Artistes`,
    description: `Découvrez des artistes ${query}${location ? ` à ${location}` : ''} sur StageComplete. Profils vérifiés, photos, vidéos et tarifs.`,
    keywords: [query, location, "artistes", "musiciens", "spectacle"].filter(Boolean)
  }),

  directory: {
    title: "Annuaire des Artistes - Tous les talents sur StageComplete",
    description: "Parcourez notre annuaire complet d'artistes professionnels. Jazz, Rock, Pop, Folk... Trouvez votre style musical idéal.",
    keywords: ["annuaire artistes", "tous les musiciens", "répertoire musical", "artistes par genre"]
  },

  artist: (artist: any) => ({
    title: `${artist.artistName} - ${artist.artistType === 'SOLO' ? 'Artiste' : 'Groupe'} ${artist.genres?.[0] || 'Musical'}`,
    description: `Découvrez ${artist.artistName}, ${artist.artistType === 'SOLO' ? 'artiste' : 'groupe'} ${artist.genres?.join(', ')} ${artist.baseLocation ? `basé à ${artist.baseLocation}` : ''}. ${artist.artistDescription || 'Profil professionnel avec photos, vidéos et tarifs.'}`,
    keywords: [
      artist.artistName,
      ...(artist.genres || []),
      artist.baseLocation,
      artist.artistType === 'SOLO' ? 'solo' : 'groupe',
      'concert', 'booking'
    ].filter(Boolean)
  })
};

export default SEOHead;