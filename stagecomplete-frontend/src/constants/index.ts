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
  MESSAGES: {
    LIST: "/messages",
    CREATE: "/messages",
    MARK_READ: (id: string) => `/messages/${id}/read`,
    UNREAD_COUNT: "/messages/unread-count",
    CONVERSATIONS: "/messages/conversations",
  },
  BOOKING_REQUESTS: {
    LIST: "/booking-requests",
    CREATE: "/booking-requests",
    STATS: "/booking-requests/stats",
    GET_ONE: (id: string) => `/booking-requests/${id}`,
    RESPOND: (id: string) => `/booking-requests/${id}/respond`,
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    DELETE: (id: string) => `/notifications/${id}`,
  },
  VALIDATION_LEADS: {
    CREATE: "/validation-leads",
    LIST: "/validation-leads",
    STATS: "/validation-leads/stats",
    GET_ONE: (id: string) => `/validation-leads/${id}`,
    UPDATE_STATUS: (id: string) => `/validation-leads/${id}/status`,
    UPDATE_SCORE: (id: string) => `/validation-leads/${id}/score`,
  },
} as const;
