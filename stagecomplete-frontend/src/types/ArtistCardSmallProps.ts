export interface ArtistCardSmallProps {
  coverPhoto?: string;
  //   portfolio?: { photos?: string[] };
  artistType?:
    | "SOLO"
    | "BAND"
    | "THEATER_GROUP"
    | "COMEDY_GROUP"
    | "ORCHESTRA"
    | "CHOIR"
    | "OTHER";
  profile: { name?: string };
  publicSlug?: string;
  baseLocation?: string;
  artistDescription?: string;
  genres?: string[];
  priceRange?: string;
}
