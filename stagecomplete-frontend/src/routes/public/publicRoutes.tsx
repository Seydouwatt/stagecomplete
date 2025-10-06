import { Route } from "react-router-dom";
import { ROUTES } from "../../constants";

// Import direct des pages publiques
import Home from "../../pages/Home";
import { Login, Register } from "../../pages";
import { PublicArtistProfile } from "../../pages/public/PublicArtistProfile";
import { DiscoveryPage } from "../../pages/public/DiscoveryPage";
import { GenreDirectory } from "../../pages/public/GenreDirectory";
import ErrorHandlingDemo from "../../pages/ErrorHandlingDemo";

export const publicRoutes = [
  // Homepage
  <Route key="home" path="/" element={<Home />} />,
  <Route key="home-alt" path="/home" element={<Home />} />,

  // Discovery page - single point of entry for finding artists
  <Route key="directory" path="/directory" element={<DiscoveryPage />} />,
  
  // Redirect /search to /directory to avoid confusion
  <Route key="search-redirect" path="/search" element={<DiscoveryPage />} />,

  // Artist landing and SEO-friendly URLs
  <Route key="artistes" path="/artistes" element={<GenreDirectory />} />,
  <Route key="artistes-genre" path="/artistes/:genre" element={<GenreDirectory />} />,
  <Route key="artistes-genre-city" path="/artistes/:genre/:city" element={<GenreDirectory />} />,
  <Route key="artistes-city" path="/artistes/:city" element={<GenreDirectory />} />,

  // Authentication
  <Route key="login" path={ROUTES.LOGIN} element={<Login />} />,
  <Route key="register" path={ROUTES.REGISTER} element={<Register />} />,
  
  // Public artist profiles
  <Route key="artist-public" path="/artist/:slug" element={<PublicArtistProfile />} />,
  
  // Demo/debug
  <Route key="demo" path="/demo" element={<ErrorHandlingDemo />} />,
];
