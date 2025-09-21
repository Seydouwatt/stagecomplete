// Artist Member types
export interface ArtistMember {
  id: string;
  artistId: string;
  artistName: string; // Nom de scène du membre
  firstName?: string; // Prénom civil
  lastName?: string;  // Nom civil
  role?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
  instruments?: string[];
  experience?: "BEGINNER" | "INTERMEDIATE" | "PROFESSIONAL" | "EXPERT";
  yearsActive?: number;
  isFounder?: boolean;
  joinDate?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// User & Auth types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isFounder: boolean;
  role: "ARTIST" | "VENUE" | "MEMBER" | "ADMIN";
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string; // Nom d'affichage universel (source unique de vérité)
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
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

export interface UpdateProfileData {
  name?: string; // Nom d'affichage universel
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface ProfileResponse {
  message: string;
  profile: Profile;
}

export interface ProfileCompletionResponse {
  completion: number;
  missingFields: string[];
  totalFields: number;
  filledFields: number;
}

// User management types
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isFounder?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  message: string;
  user: User;
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

export type Experience = "BEGINNER" | "INTERMEDIATE" | "PROFESSIONAL";
export type ArtistSpecialty =
  | "CONCERT"
  | "STUDIO"
  | "TEACHING"
  | "WEDDING"
  | "CORPORATE"
  | "PRIVATE";
export type ArtistType =
  | "SOLO"
  | "BAND"
  | "THEATER_GROUP"
  | "COMEDY_GROUP"
  | "ORCHESTRA"
  | "CHOIR"
  | "OTHER";

export type ArtistDiscipline =
  | "MUSIC"
  | "THEATER"
  | "ACTOR"
  | "COMEDIENNE"
  | "COMEDIE"
  | "DANCE"
  | "CIRCUS"
  | "MAGIE"
  | "OTHER";

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

  // General information (identity) - artistName synchronisé avec Profile.name
  coverPhoto?: string;
  logo?: string;
  baseLocation?: string;
  foundedYear?: number;

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
  artistDiscipline?: ArtistDiscipline;
  artistDescription?: string;
  memberCount?: number;
  members?: ArtistMember[];

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
  // General information (identity) - artistName géré via Profile.name
  coverPhoto?: string;
  logo?: string;
  baseLocation?: string;
  foundedYear?: number;

  // Basic info
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
  artistDiscipline?: ArtistDiscipline;
  artistDescription?: string;
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
