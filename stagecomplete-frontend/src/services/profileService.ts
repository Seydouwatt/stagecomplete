import axios from "axios";
import type {
  UpdateProfileData,
  ProfileResponse,
  ProfileCompletionResponse
} from "../types";
import { API_URL, API_ENDPOINTS } from "../constants";
import { toast } from "../stores/useToastStore";

// Configuration axios réutilisant la même instance que authService
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

// Intercepteur pour gérer les erreurs d'authentification et afficher les toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      // Token expiré ou invalide, nettoyer le store
      localStorage.removeItem("stagecomplete-auth");
      toast.error("Session expirée, veuillez vous reconnecter");
      window.location.href = "/login";
    } else if (status >= 400 && status < 500) {
      // Erreurs client (4xx)
      const message = data?.message || data?.error || "Une erreur est survenue";
      if (Array.isArray(message)) {
        message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(message);
      }
    } else if (status >= 500) {
      // Erreurs serveur (5xx)
      toast.error("Erreur serveur, veuillez réessayer plus tard");
    } else if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      // Erreurs réseau
      toast.error("Impossible de se connecter au serveur");
    }

    return Promise.reject(error);
  }
);

export const profileService = {
  // Récupérer le profil
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  // Mettre à jour le profil
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  // Obtenir le pourcentage de complétion du profil
  async getProfileCompletion(): Promise<ProfileCompletionResponse> {
    const response = await api.get(API_ENDPOINTS.PROFILE.COMPLETION);
    return response.data;
  },

  // Utilitaire pour convertir une image en base64
  async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Erreur lors de la conversion en base64'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  },

  // Valider une URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Valider un numéro de téléphone (simple validation)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Calculer le pourcentage de complétion côté client
  calculateCompletionPercentage(profile: any): number {
    const fields = [
      profile.name,
      profile.bio,
      profile.avatar,
      profile.phone,
      profile.location,
      profile.website,
      profile.socialLinks && Object.keys(profile.socialLinks).length > 0
    ];

    const filledFields = fields.filter(field => {
      if (typeof field === 'boolean') return field;
      return field && String(field).trim() !== '';
    }).length;

    return Math.round((filledFields / fields.length) * 100);
  }
};

export default profileService;