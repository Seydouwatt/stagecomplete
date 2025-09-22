import { ARTIST_TYPE_OPTIONS } from "../../../pages/artist/ArtistProfileForm";
import type { ArtistType, UpdateArtistProfileData } from "../../../types";
import { MemberManagement } from "../MemberManagement";

export const MembersTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
}> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8" data-testid="members-tab">
      <div>
        <h3 className="text-xl font-semibold mb-6">Configuration du groupe</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Type d'artiste</span>
              <span className="label-text-alt">Solo ou groupe</span>
            </label>
            <select
              name="artistType"
              data-testid="artist-type-select"
              className="select select-bordered"
              value={formData.artistType || "SOLO"}
              onChange={(e) =>
                updateFormData("artistType", e.target.value as ArtistType)
              }
            >
              {ARTIST_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Nombre de membres</span>
              <span className="label-text-alt">
                {formData.artistType === "SOLO"
                  ? "Toujours 1 pour un solo"
                  : "Maximum autorisé"}
              </span>
            </label>
            <input
              type="number"
              name="memberCount"
              className="input input-bordered w-full"
              placeholder="Ex: 4"
              min="1"
              value={formData.memberCount || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  updateFormData("memberCount", "");
                } else {
                  const parsed = parseInt(value);
                  updateFormData(
                    "memberCount",
                    isNaN(parsed) ? "" : Math.max(1, parsed)
                  );
                }
              }}
              disabled={formData.artistType === "SOLO"}
            />
          </div>
        </div>

        {formData.artistType && formData.memberCount && (
          <div className="alert alert-info mb-6">
            <div>
              <h4 className="font-medium">Configuration du groupe</h4>
              <p className="text-sm">
                {formData.artistType === "SOLO"
                  ? "En tant qu'artiste solo, vous aurez un profil personnel dans la section membres."
                  : `Votre ${ARTIST_TYPE_OPTIONS.find(
                      (opt) => opt.value === formData.artistType
                    )?.label.toLowerCase()} peut avoir jusqu'à ${
                      formData.memberCount
                    } membres.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gestion des membres */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium">Gestion des membres</h4>
          <span className="badge badge-primary">
            {formData.artistType === "SOLO"
              ? "Profil personnel"
              : "Profils du groupe"}
          </span>
        </div>

        <div className="bg-base-50 rounded-lg p-6">
          <MemberManagement
            className="bg-transparent shadow-none p-0"
            artistType={formData.artistType}
          />
        </div>
      </div>
    </div>
  );
};
