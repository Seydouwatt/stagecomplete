import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
} from "../types";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;

  // Utils
  getAuthHeader: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response: AuthResponse = await authService.login(credentials);

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Une erreur est survenue lors de la connexion";
          set({
            error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null });

          const response: AuthResponse = await authService.register(data);

          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Une erreur est survenue lors de la création du compte";
          set({
            error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set loading
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Update profile action
      updateProfile: async (data: UpdateProfileData) => {
        try {
          set({ isLoading: true, error: null });

          const response = await profileService.updateProfile(data);

          // Mettre à jour l'utilisateur dans le store avec le nouveau profil
          const currentState = get();
          if (currentState.user) {
            const updatedUser = {
              ...currentState.user,
              profile: response.profile
            };

            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Une erreur est survenue lors de la mise à jour du profil";
          set({
            error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Refresh user data
      refreshUser: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await authService.getMe();

          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Une erreur est survenue lors du rafraîchissement des données";
          set({
            error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Get auth header for API calls
      getAuthHeader: () => {
        const { token } = get();
        return token ? `Bearer ${token}` : null;
      },
    }),
    {
      name: "stagecomplete-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
