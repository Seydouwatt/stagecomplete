import { de } from "date-fns/locale";

export const PublicOverview: React.FC<{
  artistName: string;
  baseLocation: string;
  mainPhoto?: string;
  genres: string[];
  socialLinks: {
    spotify?: string;
    youtube?: string;
    soundcloud?: string;
    instagram?: string;
  };
  portfolioPhotos: string[];
  demoVideo?: string;
  priceRange?: string;
  artistDescription?: string;
}> = ({
  artistName,
  baseLocation,
  genres,
  mainPhoto,
  artistDescription,
  socialLinks,
  portfolioPhotos,
  demoVideo,
  priceRange,
}) => {
  return (
    <div className="card bg-base-100 border">
      <div className="card-body">
        <h4 className="font-semibold mb-4">Aperçu de votre profil public</h4>

        <div className="flex gap-4">
          {mainPhoto && (
            <div className="avatar">
              <img src={mainPhoto} alt="Profil" />
              <div className="w-16 h-16 rounded-full"></div>
            </div>
          )}

          <div className="flex-1">
            <h5 className="font-bold text-lg">
              {artistName || "Nom de l'artiste"}
            </h5>
            <p className="text-base-content/60">{baseLocation}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {genres.slice(0, 3).map((genre) => (
                <span key={genre} className="badge badge-primary badge-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm">
          {artistDescription || "Description de l'artiste..."}
        </p>
      </div>
    </div>
  );
};

export default PublicOverview;
