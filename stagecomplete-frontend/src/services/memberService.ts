import axios from "axios";
import { API_URL } from "../constants";
import type { ArtistMember } from "../types";

// Configuration axios pour les services membre
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

export interface CreateArtistMemberDto {
  artistName?: string;
  firstName?: string;
  lastName?: string;
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
}

export interface UpdateArtistMemberDto extends Partial<CreateArtistMemberDto> {}

export interface ArtistMembersResponse {
  artist: {
    id: string;
    artistType:
      | "SOLO"
      | "BAND"
      | "THEATER_GROUP"
      | "COMEDY_GROUP"
      | "ORCHESTRA"
      | "CHOIR"
      | "OTHER";
    memberCount: number;
  };
  members: ArtistMember[];
}

class MemberService {
  private readonly baseUrl = "/artist/members";

  /**
   * Récupère tous les membres de l'artiste connecté
   */
  async getMembers(): Promise<ArtistMembersResponse> {
    const response = await api.get<ArtistMembersResponse>(this.baseUrl);
    return response.data;
  }

  /**
   * Récupère un membre spécifique
   */
  async getMember(memberId: string): Promise<ArtistMember> {
    const response = await api.get<ArtistMember>(`${this.baseUrl}/${memberId}`);
    return response.data;
  }

  /**
   * Crée un nouveau membre
   */
  async createMember(memberData: CreateArtistMemberDto): Promise<ArtistMember> {
    const response = await api.post<ArtistMember>(this.baseUrl, memberData);
    return response.data;
  }

  /**
   * Met à jour un membre existant
   */
  async updateMember(
    memberId: string,
    memberData: UpdateArtistMemberDto
  ): Promise<ArtistMember> {
    const response = await api.put<ArtistMember>(
      `${this.baseUrl}/${memberId}`,
      memberData
    );
    return response.data;
  }

  /**
   * Supprime un membre (soft delete)
   */
  async deleteMember(memberId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `${this.baseUrl}/${memberId}`
    );
    return response.data;
  }

  /**
   * Valide les données d'un membre avant soumission
   */
  validateMember(
    memberData: CreateArtistMemberDto | UpdateArtistMemberDto
  ): string[] {
    const errors: string[] = [];

    // Validation du nom de l'artiste (obligatoire)
    if (!memberData.artistName || memberData.artistName.trim().length === 0) {
      errors.push("Le nom de l'artiste est obligatoire");
    }

    // Validation du prenom (obligatoire)
    if (!memberData.firstName || memberData.firstName.trim().length === 0) {
      errors.push("Le prénom est obligatoire");
    } else if (memberData.firstName.length > 100) {
      errors.push("Le prénom ne peut pas dépasser 100 caractères");
    }

    // Validation du nom de famille (obligatoire)
    if (!memberData.lastName || memberData.lastName.trim().length === 0) {
      errors.push("Le nom de famille est obligatoire");
    } else if (memberData.lastName.length > 100) {
      errors.push("Le nom de famille ne peut pas dépasser 100 caractères");
    }
    // Validation du rôle
    if (memberData.role && memberData.role.length > 100) {
      errors.push("Le rôle ne peut pas dépasser 100 caractères");
    }

    // Validation de la bio
    if (memberData.bio && memberData.bio.length > 1000) {
      errors.push("La bio ne peut pas dépasser 1000 caractères");
    }

    // Validation de l'email
    if (memberData.email && memberData.email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(memberData.email)) {
        errors.push("L'adresse email n'est pas valide");
      }
    }

    // Validation du téléphone
    if (memberData.phone && memberData.phone.length > 20) {
      errors.push("Le numéro de téléphone ne peut pas dépasser 20 caractères");
    }

    // Validation des instruments
    if (memberData.instruments && memberData.instruments.length > 10) {
      errors.push("Maximum 10 instruments par membre");
    }

    // Validation des années d'expérience
    if (memberData.yearsActive !== undefined) {
      if (memberData.yearsActive < 0 || memberData.yearsActive > 80) {
        errors.push("Les années d'expérience doivent être entre 0 et 80");
      }
    }

    // Validation des liens sociaux
    if (memberData.socialLinks) {
      const urlRegex = /^https?:\/\/.+/;
      Object.entries(memberData.socialLinks).forEach(([platform, url]) => {
        if (url && url.length > 0 && !urlRegex.test(url)) {
          errors.push(`Le lien ${platform} n'est pas une URL valide`);
        }
        if (url && url.length > 200) {
          errors.push(
            `Le lien ${platform} ne peut pas dépasser 200 caractères`
          );
        }
      });
    }

    return errors;
  }

  /**
   * Formate un membre pour l'affichage
   */
  formatMemberForDisplay(member: ArtistMember) {
    return {
      ...member,
      displayName: member.artistName,
      displayRole: member.role || "Membre",
      experienceLabel: this.getExperienceLabel(member.experience),
      joinDateFormatted: member.joinDate
        ? new Date(member.joinDate).toLocaleDateString("fr-FR")
        : "",
      instrumentsText: member.instruments?.join(", ") || "",
      hasContact: !!(member.email || member.phone),
      hasSocialLinks: !!(
        member.socialLinks &&
        Object.values(member.socialLinks).some(
          (link) => link && link.length > 0
        )
      ),
    };
  }

  /**
   * Obtient le libellé d'expérience en français
   */
  private getExperienceLabel(experience?: string): string {
    const labels = {
      BEGINNER: "Débutant",
      INTERMEDIATE: "Intermédiaire",
      PROFESSIONAL: "Professionnel",
      EXPERT: "Expert",
    };
    return experience
      ? labels[experience as keyof typeof labels] || experience
      : "";
  }

  /**
   * Crée un membre par défaut pour un artiste solo
   */
  createDefaultSoloMember(
    artistName: string,
    artistEmail?: string
  ): CreateArtistMemberDto {
    return {
      artistName: artistName?.trim() || "",
      firstName: artistName?.trim() || "",
      lastName: artistName?.trim() || "",
      role: "Artiste principal",
      isFounder: true,
      isActive: true,
      email: artistEmail,
      instruments: [],
      experience: "PROFESSIONAL",
    };
  }
}

export const memberService = new MemberService();
