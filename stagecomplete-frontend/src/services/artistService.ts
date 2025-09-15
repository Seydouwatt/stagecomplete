import axios from "axios";
import type {
  ExtendedUser,
  UpdateArtistProfileData,
  PublicArtistProfile,
  ArtistSearchFilters,
  ArtistSearchResponse,
} from "../types";
import { API_URL } from "../constants";
import { toast } from "../stores/useToastStore";

// Configuration axios pour les services artiste
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("stagecomplete-auth");
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Une erreur est survenue";

    if (error.response?.status === 401) {
      toast.error("Session expirée, veuillez vous reconnecter");
      // Redirection vers login pourrait être gérée ici
    } else if (error.response?.status === 403) {
      toast.error("Accès non autorisé");
    } else if (error.response?.status >= 500) {
      toast.error("Erreur serveur, veuillez réessayer plus tard");
    } else {
      toast.error(Array.isArray(message) ? message[0] : message);
    }

    return Promise.reject(error);
  }
);

export const artistService = {
  // ========== PROFIL ARTISTE AUTHENTIFIÉ ==========

  /**
   * Récupère le profil artiste de l'utilisateur connecté
   */
  async getMyArtistProfile(): Promise<ExtendedUser> {
    try {
      const response = await api.get("/artist/profile");
      return response.data.artist;
    } catch (error) {
      console.error("Error fetching artist profile:", error);
      throw error;
    }
  },

  /**
   * Met à jour le profil artiste de l'utilisateur connecté
   */
  async updateArtistProfile(
    data: UpdateArtistProfileData
  ): Promise<ExtendedUser> {
    try {
      const response = await api.put("/artist/profile", data);
      toast.success("Profil artiste mis à jour avec succès !");
      return response.data.artist;
    } catch (error) {
      console.error("Error updating artist profile:", error);
      throw error;
    }
  },

  /**
   * Génère un slug unique pour l'URL publique
   */
  async generateSlug(name: string): Promise<string> {
    try {
      const response = await api.post("/artist/generate-slug", { name });
      return response.data.slug;
    } catch (error) {
      console.error("Error generating slug:", error);
      throw error;
    }
  },

  // ========== PROFILS PUBLICS ==========

  /**
   * Récupère un profil artiste public par ID ou slug
   */
  async getPublicArtistProfile(
    identifier: string
  ): Promise<PublicArtistProfile> {
    try {
      // Utiliser axios sans intercepteur d'auth pour les endpoints publics
      const publicApi = axios.create({ baseURL: API_URL });
      const response = await publicApi.get(`/public/artist/${identifier}`);
      return response.data.artist;
    } catch (error) {
      console.error("Error fetching public artist profile:", error);
      throw error;
    }
  },

  /**
   * Recherche d'artistes publics avec filtres
   */
  async searchArtists(
    filters: ArtistSearchFilters
  ): Promise<ArtistSearchResponse> {
    try {
      const publicApi = axios.create({ baseURL: API_URL });

      // Construire les paramètres de requête
      const params = new URLSearchParams();

      if (filters.genres?.length) {
        params.append("genres", filters.genres.join(","));
      }
      if (filters.experience) {
        params.append("experience", filters.experience);
      }
      if (filters.priceRange) {
        params.append("priceRange", filters.priceRange);
      }
      if (filters.location) {
        params.append("location", filters.location);
      }
      if (filters.instruments?.length) {
        params.append("instruments", filters.instruments.join(","));
      }
      if (filters.limit) {
        params.append("limit", filters.limit.toString());
      }
      if (filters.offset) {
        params.append("offset", filters.offset.toString());
      }

      const response = await publicApi.get(
        `/public/search/artists?${params.toString()}`
      );
      return response.data.results;
    } catch (error) {
      console.error("Error searching artists:", error);
      throw error;
    }
  },

  /**
   * Récupère les artistes mis en avant
   */
  async getFeaturedArtists(): Promise<PublicArtistProfile[]> {
    try {
      const publicApi = axios.create({ baseURL: API_URL });
      const response = await publicApi.get("/public/artists/featured");
      return response.data.artists;
    } catch (error) {
      console.error("Error fetching featured artists:", error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques publiques de la plateforme
   */
  async getPublicStats(): Promise<{
    totalArtists: number;
    totalVenues: number;
    publicProfiles: number;
  }> {
    try {
      const publicApi = axios.create({ baseURL: API_URL });
      const response = await publicApi.get("/public/stats");
      return response.data.stats;
    } catch (error) {
      console.error("Error fetching public stats:", error);
      throw error;
    }
  },

  // ========== UTILITAIRES ==========

  /**
   * Convertit un fichier en base64 pour l'upload
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Valide les formats de fichiers autorisés
   */
  validateImageFile(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format d'image non supporté. Utilisez JPG, PNG ou WebP.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("L'image est trop volumineuse. Maximum 5MB.");
      return false;
    }

    return true;
  },

  /**
   * Valide les formats audio autorisés
   */
  validateAudioFile(file: File): boolean {
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format audio non supporté. Utilisez MP3 ou WAV.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Le fichier audio est trop volumineux. Maximum 10MB.");
      return false;
    }

    return true;
  },

  /**
   * Redimensionne une image avant upload (prépare pour AWS S3)
   */
  async resizeImage(file: File, maxWidth: number = 800): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };

      img.src = URL.createObjectURL(file);
    });
  },
};

export default artistService;
