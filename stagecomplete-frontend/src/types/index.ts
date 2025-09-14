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

// ========== ARTIST PROFILE TYPES ==========

export type Experience = 'BEGINNER' | 'INTERMEDIATE' | 'PROFESSIONAL';
export type ArtistSpecialty = 'CONCERT' | 'STUDIO' | 'TEACHING' | 'WEDDING' | 'CORPORATE' | 'PRIVATE';
export type ArtistType = 'SOLO' | 'BAND' | 'THEATER_GROUP' | 'COMEDY_GROUP' | 'ORCHESTRA' | 'CHOIR' | 'OTHER';

export interface PriceDetails {
  concert?: number;
  private?: number;
  wedding?: number;
  conditions?: string;
}

export interface SocialLinks {
  spotify?: string;
  soundcloud?: string;
  youtube?: string;
  instagram?: string;
  website?: string;
}

export interface Portfolio {
  photos?: string[];
  videos?: string[];
  audio?: string[];
}

export interface ArtistProfile {
  id: string;
  profileId: string;
  
  // Basic info
  genres: string[];
  instruments: string[];
  priceRange?: string;
  experience?: Experience;
  yearsActive?: number;
  
  // Extended profile fields
  artisticBio?: string;
  specialties?: ArtistSpecialty[];
  equipment?: string[];
  requirements?: string[];
  
  // Member management
  artistType?: ArtistType;
  memberCount?: number;
  
  // Pricing & Conditions
  priceDetails?: PriceDetails;
  travelRadius?: number;
  
  // Media & Portfolio
  portfolio?: Portfolio;
  socialLinks?: SocialLinks;
  
  // Availability & Settings
  availability?: any; // JSON data
  isPublic: boolean;
  publicSlug?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ExtendedUser extends User {
  profile: Profile & {
    artist?: ArtistProfile;
    venue?: any; // To be defined later
  };
}

export interface UpdateArtistProfileData {
  genres?: string[];
  instruments?: string[];
  priceRange?: string;
  experience?: Experience;
  yearsActive?: number;
  artisticBio?: string;
  specialties?: ArtistSpecialty[];
  equipment?: string[];
  requirements?: string[];
  artistType?: ArtistType;
  memberCount?: number;
  priceDetails?: PriceDetails;
  travelRadius?: number;
  socialLinks?: SocialLinks;
  portfolio?: Portfolio;
  isPublic?: boolean;
  publicSlug?: string;
}

export interface PublicArtistProfile extends ArtistProfile {
  profile: Profile & {
    user: {
      id: string;
      role: string;
      createdAt: string;
    };
  };
}

export interface ArtistSearchFilters {
  genres?: string[];
  experience?: Experience;
  priceRange?: string;
  location?: string;
  instruments?: string[];
  limit?: number;
  offset?: number;
}

export interface ArtistSearchResponse {
  artists: PublicArtistProfile[];
  total: number;
  hasMore: boolean;
}
