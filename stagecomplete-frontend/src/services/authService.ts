import axios from "axios";
import type { LoginCredentials, RegisterData, AuthResponse } from "../types";
import { API_URL, API_ENDPOINTS } from "../constants";

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

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide, nettoyer le store
      localStorage.removeItem("stagecomplete-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  // Get current user
  async getMe() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Verify token
  async verifyToken(token: string) {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, { token });
    return response.data;
  },

  // Check if email exists
  async checkEmail(email: string) {
    const response = await api.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
    return response.data;
  },
};

export default authService;
