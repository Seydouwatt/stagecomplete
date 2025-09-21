import type {
  ArtistType,
  Experience,
  UpdateArtistProfileData,
} from "../../../types";
import { ImageUpload } from "../../forms/ImageUpload";
import { MultiSelect } from "../../forms/MultiSelect";
// Options prédéfinies
const GENRES_OPTIONS = [
  "Rock",
  "Pop",
  "Jazz",
  "Blues",
  "Classical",
  "Folk",
  "Country",
  "R&B",
  "Soul",
  "Funk",
  "Electronic",
  "House",
  "Techno",
  "Hip Hop",
  "Rap",
  "Reggae",
  "Ska",
  "Punk",
  "Metal",
  "Alternative",
  "Indie",
  "World Music",
  "Latin",
  "Bossa Nova",
  "Chanson Française",
];
const INSTRUMENTS_OPTIONS = [
  "Guitare",
  "Piano",
  "Chant",
  "Batterie",
  "Basse",
  "Violon",
  "Violoncelle",
  "Flûte",
  "Saxophone",
  "Trompette",
  "Trombone",
  "Accordéon",
  "Harmonica",
  "Ukulélé",
  "Mandoline",
  "Banjo",
  "Orgue",
  "Synthétiseur",
  "DJ",
  "Percussions",
  "Harmonie",
  "Direction",
];

const GeneralInfoTab: React.FC<{
  formData: UpdateArtistProfileData;
  updateFormData: (field: keyof UpdateArtistProfileData, value: any) => void;
  profileName?: string;
  updateProfileName?: (name: string) => void;
}> = ({ formData, updateFormData, profileName, updateProfileName }) => {
  console.log(formData, profileName);

  return (
    <div className="space-y-6 overflow-scroll h-[calc(100vh - 380px)] lg:h-[calc(100vh-335px)]">
      {/* ===== SECTION 1: IDENTITÉ =====  */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">
            🎭 Identité de l'artiste / groupe
          </h3>

          <div className="flex flex-col w-full gap-6">
            {/* Nom de l'artiste/groupe */}
            <div className="form-control flex flex-col ">
              <label className="label">
                <span className="label-text font-medium">
                  Nom de l'artiste ou du groupe
                </span>
                <span className="label-text-alt text-info">
                  Différent de votre nom d'utilisateur
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="ex: Les Étoiles Filantes, DJ Martin, Théâtre du Soleil..."
                value={profileName || ""}
                onChange={(e) => updateProfileName?.(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Type d'artiste */}
            {/* <div className="flex lg:flex-row gap-6"> */}
            <div className="form-control flex flex-col ">
              <label className="label">
                <span className="label-text font-medium">Type d'artiste</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.artistType || ""}
                onChange={(e) =>
                  updateFormData("artistType", e.target.value as ArtistType)
                }
              >
                <option value="">Sélectionner...</option>
                <option value="SOLO">Artiste solo</option>
                <option value="BAND">Groupe / Band / Collectif</option>
                <option value="THEATER_GROUP">Troupe de théâtre</option>
                <option value="COMEDY_GROUP">Groupe d'humour</option>
                <option value="ORCHESTRA">Orchestre</option>
                <option value="CHOIR">Chorale</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text font-medium">
                  Discipline artistique
                </span>
              </label>
              <select
                className="select select-bordered  w-full"
                value={formData.artistDiscipline || ""}
                onChange={(e) =>
                  updateFormData(
                    "artistDiscipline",
                    e.target.value as ArtistType
                  )
                }
              >
                <option value="">Sélectionner...</option>
                <option value="MUSIC">Musique</option>
                <option value="THEATER">Théâtre</option>
                <option value="ACTOR">Actrice - Acteur</option>
                <option value="COMEDIENNE">Comédienne - Comédien</option>
                <option value="COMEDY">Humour</option>
                <option value="DANCE">Danse</option>
                <option value="CIRCUS">Cirque</option>
                <option value="MAGIC">Magie</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            {/* </div> */}
            {/* et ville de base  */}
            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text font-medium">
                  Ville / Pays de base
                </span>
                <span className="label-text-alt text-info">
                  Votre lieu principal d'activité
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="ex: Lyon, France"
                value={formData.baseLocation || ""}
                onChange={(e) => updateFormData("baseLocation", e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Année de création */}
            <div className="flex-col flex form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Année de création
                </span>
                <span className="label-text-alt text-info">
                  Année de formation du groupe ou début de carrière
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="2020"
                min="1900"
                max="2030"
                value={formData.foundedYear || ""}
                onChange={(e) =>
                  updateFormData(
                    "foundedYear",
                    parseInt(e.target.value) || undefined
                  )
                }
              />
            </div>

            {/* Petite description  */}
            <div className="form-control flex flex-col ">
              <label className="label">
                <span className="label-text font-medium">A propos de vous</span>
                <span className="label-text-alt text-info">
                  Présentez votre univers artistique en une phrase ou deux
                </span>
              </label>
              <div className="flex gap-2 flex-col">
                <textarea
                  className="textarea textarea-bordered h-20 w-full"
                  placeholder="Qui etes-vous en quelques mots?"
                  value={formData.artistDescription || ""}
                  onChange={(e) =>
                    updateFormData("artistDescription", e.target.value)
                  }
                  maxLength={1000}
                />
                <div className="label">
                  <span className="label-text-alt">
                    {(formData.artisticBio || "").length}/1000 caractères
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SECTION 2: VISUELS =====  */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">📸 Visuels et identité</h3>

          {/* <div className="grid grid-cols-1 gap-6"> */}
          <div className="flex flex-col gap-4 m-4">
            {/* Photo de couverture */}

            <ImageUpload
              label="Photo de couverture - Bannière principale (format paysage recommandé)"
              value={formData.coverPhoto ? [formData.coverPhoto] : []}
              onChange={(value) => updateFormData("coverPhoto", value[0] || "")}
              maxImages={1}
              className="aspect-auto bg-base-200 w-full"
            />

            {/* Logo */}

            <ImageUpload
              label="Logo ou image d'identité (format carré recommandé)"
              value={formData.logo ? [formData.logo] : []}
              onChange={(value) => updateFormData("logo", value[0] || "")}
              maxImages={1}
              className="aspect-auto bg-base-200 w-full"
            />
          </div>
        </div>
      </div>

      {/* ===== SECTION 3: INFORMATIONS MUSICALES DE BASE ===== */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">
            🎵 Informations musicales de base
          </h3>

          <div className="space-y-6">
            <MultiSelect
              label="Genres musicaux"
              options={GENRES_OPTIONS}
              value={formData.genres || []}
              onChange={(value) => updateFormData("genres", value)}
              maxSelections={8}
              allowCustom={true}
              placeholder="Sélectionnez vos genres..."
            />

            <MultiSelect
              label="Instruments / Compétences"
              options={INSTRUMENTS_OPTIONS}
              value={formData.instruments || []}
              onChange={(value) => updateFormData("instruments", value)}
              maxSelections={10}
              allowCustom={true}
              placeholder="Vos instruments et compétences..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Niveau d'expérience
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.experience || ""}
                  onChange={(e) =>
                    updateFormData("experience", e.target.value as Experience)
                  }
                >
                  <option value="">Sélectionner...</option>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="PROFESSIONAL">Professionnel</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Années d'activité
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Ex: 5"
                  min="0"
                  max="50"
                  value={formData.yearsActive || ""}
                  onChange={(e) =>
                    updateFormData(
                      "yearsActive",
                      parseInt(e.target.value) || undefined
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
