import type React from "react";
import type {
  ArtistCardSmallProps,
  UpdateArtistProfileData,
} from "../../../types";
import { useAuthStore } from "../../../stores/authStore";
import ArtistCard from "../ArtistCard";

export const PublicProfileTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
  onGenerateSlug: () => void;
}> = ({
  formData,
  updateFormData,
  onGenerateSlug,
  // artistData: _artistData,
}) => {
  const { user } = useAuthStore();

  const getDataArtist = (
    formData: UpdateArtistProfileData
  ): ArtistCardSmallProps => {
    const artist: ArtistCardSmallProps = {
      artistDescription: formData.artistDescription || "",
      baseLocation: user?.profile?.location || "Votre ville, Pays",
      genres: formData.genres || [],
      coverPhoto: formData.portfolio?.photos?.[0] || "",
      artistType: formData.artistType,
      priceRange: formData.priceRange || "",
      publicSlug: formData.publicSlug || "",
      profile: { name: user?.profile?.name || "Nom de l'artiste" },
    };
    return artist;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Profil public</h3>

      <div className="form-control">
        <label className="cursor-pointer label justify-start gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={formData?.isPublic || false}
            onChange={(e) => updateFormData("isPublic", e.target.checked)}
          />
          <div>
            <span className="label-text font-medium">
              Rendre mon profil public
            </span>
            <p className="text-sm text-base-content/60">
              Permettre aux venues de découvrir votre profil et vous contacter
            </p>
          </div>
        </label>
      </div>

      {formData?.isPublic && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">URL personnalisée</span>
              <span className="label-text-alt">Pour partager votre profil</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex">
                <span className="bg-base-200 border border-r-0 border-base-300 rounded-l-lg px-3 py-2 text-sm">
                  stagecomplete.com/artist/
                </span>
                <input
                  type="text"
                  className="input input-bordered rounded-l-none flex-1"
                  placeholder="votre-nom-artiste"
                  value={formData?.publicSlug || ""}
                  onChange={(e) => updateFormData("publicSlug", e.target.value)}
                />
              </div>

              {formData?.publicSlug === "" && (
                <button
                  type="button"
                  onClick={onGenerateSlug}
                  className="btn btn-outline"
                >
                  Générer
                </button>
              )}
            </div>
            {formData.publicSlug && (
              <label className="label">
                <span className="label-text-alt text-success">
                  ✓ Votre profil sera accessible sur: stagecomplete.com/artist/
                  {formData.publicSlug}
                </span>
              </label>
            )}
          </div>

          <div className="alert alert-info">
            <div>
              <h4 className="font-medium">Profil public activé !</h4>
              <p className="text-sm">
                Les venues pourront découvrir votre profil, voir vos
                informations artistiques et vous contacter pour des
                opportunités.
              </p>
            </div>
          </div>
          <div data-testid="profile-preview">
            <div className="divider" />
            <h4 className="text-lg font-medium mb-4">
              Aperçu du profil public
            </h4>
            <ArtistCard artist={getDataArtist(formData)} />
            {/* <AnimatePresence mode="wait">
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <PublicOverview
                  artistName={user?.profile?.name || "Nom de l'artiste"}
                  baseLocation={user?.profile?.location || "Votre ville, Pays"}
                  genres={formData.genres || []}
                  mainPhoto={formData.portfolio?.photos?.[0]}
                  artistDescription={formData.artistDescription}
                  socialLinks={formData.socialLinks || {}}
                  portfolioPhotos={formData.portfolio?.photos || []}
                  demoVideo={formData.portfolio?.videos?.[0]}
                  priceRange={formData.priceRange}
                />
              </motion.div>
            </AnimatePresence> */}
          </div>
        </>
      )}
    </div>
  );
};
