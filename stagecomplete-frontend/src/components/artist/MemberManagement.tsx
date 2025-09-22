import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Music,
  Crown,
  ExternalLink,
} from "lucide-react";
import {
  memberService,
  type ArtistMembersResponse,
} from "../../services/memberService";
import type { ArtistMember } from "../../types";
import { useToastStore, type ToastType } from "../../stores/useToastStore";
import { MemberForm } from "./MemberForm";
import LoadingButton from "../ui/LoadingButton";

interface MemberManagementProps {
  className?: string;
  artistType?: string;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  className = "",
  artistType,
}) => {
  const [membersData, setMembersData] = useState<ArtistMembersResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<ArtistMember | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const { addToast } = useToastStore();

  // Charger les membres au montage et quand le type d'artiste change
  useEffect(() => {
    console.log(
      "MemberManagement useEffect triggered, artistType:",
      artistType
    );
    loadMembers();
  }, [artistType]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await memberService.getMembers();
      setMembersData(data);
    } catch (error: any) {
      console.error("Erreur lors du chargement des membres:", error);
      addToast(
        "Impossible de charger les membres du groupe",
        "error" as ToastType
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (deletingMemberId) return;

    setDeletingMemberId(memberId);
    try {
      await memberService.deleteMember(memberId);
      addToast("Membre supprimé", "success" as ToastType);
      await loadMembers(); // Recharger la liste
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      addToast("Impossible de supprimer ce membre", "error" as ToastType);
    } finally {
      setDeletingMemberId(null);
    }
  };

  const formatMember = (member: ArtistMember) => {
    return memberService.formatMemberForDisplay(member);
  };

  const canAddMember = membersData
    ? membersData.members.length < membersData.artist.memberCount
    : true; // Permettre l'ajout par défaut quand les données ne sont pas chargées

  const isSoloArtist =
    membersData?.artist.artistType === "SOLO" || artistType === "SOLO";

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (!membersData) {
    return (
      <div className={`${className}`}>
        <div className="alert alert-error">
          <span>Impossible de charger les données des membres</span>
        </div>
      </div>
    );
  }

  const { artist, members } = membersData || {
    artist: { memberCount: 5 },
    members: [],
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              {isSoloArtist ? "Profil Artiste" : "Membres du Groupe"}
            </h2>
            <p className="text-sm text-base-content/70">
              {isSoloArtist
                ? "Gérez vos informations personnelles"
                : `${members.length}/${artist.memberCount} membres actifs`}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {((isSoloArtist && members.length === 0) ||
            (!isSoloArtist && canAddMember)) && (
            <motion.button
              className="btn btn-primary"
              data-testid="create-add-member-btn"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              {members.length === 0 ? "Créer un membre" : "Ajouter un membre"}
            </motion.button>
          )}

          {/* Bouton de rechargement pour contourner les problèmes API */}
          {!membersData && (
            <motion.button
              className="btn btn-primary"
              data-testid="add-member-btn"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Créer un membre
            </motion.button>
          )}
        </div>
      </div>

      {/* Grille des membres */}
      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        data-testid="member-list"
      >
        <AnimatePresence>
          {members.map((member, index) => {
            const formattedMember = formatMember(member);
            return (
              <motion.div
                key={member.id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow member-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div className="card-body p-4">
                  {/* Avatar et nom */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.artistName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="bg-primary/10 w-full h-full rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {member.artistName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base-content truncate">
                          {member.artistName}
                        </h3>
                        {member.isFounder && (
                          <Crown className="w-4 h-4 text-warning">
                            Membre fondateur
                          </Crown>
                        )}
                      </div>
                      {member.role && (
                        <p className="text-sm text-base-content/70 truncate">
                          {member.role}
                        </p>
                      )}
                      {formattedMember.experienceLabel && (
                        <span className="badge badge-sm badge-outline mt-1">
                          {formattedMember.experienceLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Instruments */}
                  {member.instruments && member.instruments.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-primary" />
                      <span className="text-sm text-base-content/70 truncate">
                        {formattedMember.instrumentsText}
                      </span>
                    </div>
                  )}

                  {/* Contact */}
                  {formattedMember.hasContact && (
                    <div className="flex gap-2 mb-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="btn btn-ghost btn-xs"
                          title={member.email}
                        >
                          <Mail className="w-3 h-3" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="btn btn-ghost btn-xs"
                          title={member.phone}
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Liens sociaux */}
                  {formattedMember.hasSocialLinks && (
                    <div className="flex gap-1 mb-3">
                      {Object.entries(member.socialLinks || {}).map(
                        ([platform, url]) => {
                          if (!url) return null;
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-ghost btn-xs"
                              title={`${platform} - ${url}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Date d'adhésion */}
                  {formattedMember.joinDateFormatted && (
                    <div className="flex items-center gap-2 text-xs text-base-content/50 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Membre depuis {formattedMember.joinDateFormatted}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="card-actions justify-end">
                    <button
                      data-testid="edit-member-btn"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingMember(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {!isSoloArtist && (
                      <LoadingButton
                        data-testid="delete-member-btn"
                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                        onClick={() => handleDeleteMember(member.id)}
                        loadingText="Suppression en cours..."
                        disabled={deletingMemberId !== null}
                      >
                        <Trash2 className="w-4 h-4" />
                      </LoadingButton>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Message si aucun membre */}
      {members.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Users className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-base-content/70 mb-2">
            {isSoloArtist ? "Profil non créé" : "Aucun membre dans le groupe"}
          </h3>
          <p className="text-base-content/50 mb-4">
            {isSoloArtist
              ? "Créez votre profil de membre pour compléter vos informations"
              : "Commencez par ajouter les membres de votre groupe"}
          </p>
          {((isSoloArtist && members.length === 0) ||
            (!isSoloArtist && canAddMember)) && (
            <button
              className="btn btn-primary"
              data-testid="add-member-btn"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4" />
              Créer un membre
            </button>
          )}
        </motion.div>
      )}

      {/* Message si limite atteinte */}
      {!canAddMember && !isSoloArtist && members.length > 0 && (
        <div className="alert alert-info mt-6">
          <span>
            Vous avez atteint la limite de {artist.memberCount} membres pour ce
            groupe. Modifiez votre profil pour augmenter cette limite si
            nécessaire.
          </span>
        </div>
      )}

      {/* Formulaires */}
      <MemberForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={loadMembers}
        isSoloArtist={isSoloArtist}
      />

      <MemberForm
        member={editingMember || undefined}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSuccess={loadMembers}
        isSoloArtist={isSoloArtist}
      />
    </motion.div>
  );
};
