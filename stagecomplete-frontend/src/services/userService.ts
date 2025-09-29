import axios from "axios";
import type { UpdateUserData, ChangePasswordData, UserResponse, User } from "../types";
import { API_URL, API_ENDPOINTS } from "../constants";
import { toast } from "../stores/useToastStore";

// Configuration axios
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

// Intercepteur pour gérer les erreurs et afficher les toasts
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

export const userService = {
  // Get user info
  async getUserInfo(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.AUTH.USER);
    return response.data;
  },

  // Update user
  async updateUser(data: UpdateUserData): Promise<UserResponse> {
    const response = await api.put(API_ENDPOINTS.AUTH.USER, data);
    return response.data;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.put(API_ENDPOINTS.AUTH.USER_PASSWORD, data);
    return response.data;
  },

  // Delete account (soft delete with cascade)
  async deleteAccount(currentPassword: string): Promise<{ message: string; deletedAt: string }> {
    const response = await api.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT, {
      data: { currentPassword }
    });
    return response.data;
  },
};

export default userService;