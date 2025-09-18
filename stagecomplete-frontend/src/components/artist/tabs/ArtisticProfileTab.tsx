import type { ArtistSpecialty, UpdateArtistProfileData } from "../../../types";
import { MultiSelect } from "../../forms/MultiSelect";

const REQUIREMENTS_OPTIONS = [
  "Scène",
  "Système son",
  "Éclairage",
  "Micro sans fil",
  "Piano acoustique",
  "Batterie acoustique",
  "Loges",
  "Parking",
  "Sécurité",
  "Catering",
  "Technicien son",
];

const SPECIALTY_OPTIONS: ArtistSpecialty[] = [
  "CONCERT",
  "STUDIO",
  "TEACHING",
  "WEDDING",
  "CORPORATE",
  "PRIVATE",
];

const EQUIPMENT_OPTIONS = [
  "Micro",
  "Amplificateur",
  "Guitare électrique",
  "Clavier",
  "Batterie électronique",
  "Pédales d'effet",
  "Table de mixage",
  "Enceintes",
  "Câbles",
  "Stands",
  "Éclairage",
];

const ArtisticProfileTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
}> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Profil artistique</h3>

      <div className="form-control flex flex-col">
        <label className="label">
          <span className="label-text font-medium">Biographie</span>
          <span className="label-text-alt text-base-content/60">
            {formData.artisticBio?.length}/10000 caractères
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          placeholder="Présentez-vous en quelques mots..."
          value={formData.artisticBio || ""}
          onChange={(e) => updateFormData("artisticBio", e.target.value)}
          maxLength={10000}
        />
      </div>

      <MultiSelect
        label="Spécialités"
        options={SPECIALTY_OPTIONS}
        value={formData.specialties || []}
        onChange={(value) => updateFormData("specialties", value)}
        maxSelections={6}
        placeholder="Types de prestations..."
      />

      <MultiSelect
        label="Équipements possédés"
        options={EQUIPMENT_OPTIONS}
        value={formData.equipment || []}
        onChange={(value) => updateFormData("equipment", value)}
        allowCustom={true}
        placeholder="Votre matériel..."
      />

      <MultiSelect
        label="Équipements requis de la venue"
        options={REQUIREMENTS_OPTIONS}
        value={formData.requirements || []}
        onChange={(value) => updateFormData("requirements", value)}
        allowCustom={true}
        placeholder="Ce dont vous avez besoin..."
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">
            Rayon de déplacement (km)
          </span>
          <span className="label-text-alt">
            Distance maximale depuis votre base
          </span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Ex: 50"
          min="0"
          max="500"
          value={formData.travelRadius || ""}
          onChange={(e) =>
            updateFormData(
              "travelRadius",
              parseInt(e.target.value) || undefined
            )
          }
        />
      </div>
    </div>
  );
};

export default ArtisticProfileTab;
