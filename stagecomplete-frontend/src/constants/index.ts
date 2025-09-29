export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "StageComplete";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "0.1.0";

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USER: "/user",
  BROWSE: "/browse",
  MESSAGES: "/messages",
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "stagecomplete_auth_token",
  USER_DATA: "stagecomplete_user_data",
  THEME: "stagecomplete_theme",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    VERIFY_TOKEN: "/auth/verify-token",
    CHECK_EMAIL: "/auth/check-email",
    USER: "/auth/user",
    USER_PASSWORD: "/auth/user/password",
    DELETE_ACCOUNT: "/auth/user",
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    COMPLETION: "/profile/completion",
  },
  USERS: {
    PROFILE: "/users/profile",
  },
} as const;
