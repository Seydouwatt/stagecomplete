// User & Auth types
export interface User {
  id: string;
  email: string;
  role: "ARTIST" | "VENUE" | "ADMIN";
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: "ARTIST" | "VENUE";
}

// API Response types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// Component props
export interface ChildrenProps {
  children: React.ReactNode;
}
