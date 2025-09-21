import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ROUTES } from "../../constants";

// Lazy loading des pages publiques
const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages").then(module => ({ default: module.Login })));
const Register = lazy(() => import("../../pages").then(module => ({ default: module.Register })));
const PublicArtistProfile = lazy(() => import("../../pages/public/PublicArtistProfile").then(module => ({ default: module.PublicArtistProfile })));
const SearchResults = lazy(() => import("../../pages/public/SearchResults").then(module => ({ default: module.SearchResults })));
const GenreDirectory = lazy(() => import("../../pages/public/GenreDirectory").then(module => ({ default: module.GenreDirectory })));
const ErrorHandlingDemo = lazy(() => import("../../pages/ErrorHandlingDemo"));

// Composant de loading pour les pages publiques
const PublicPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="text-center">
      <div className="loading loading-spinner loading-lg text-white mb-4"></div>
      <p className="text-white/70">Chargement...</p>
    </div>
  </div>
);

export const publicRoutes = [
  <Route key="home" path="/" element={<Suspense fallback={<PublicPageLoader />}><Home /></Suspense>} />,
  <Route key="home-alt" path="/home" element={<Suspense fallback={<PublicPageLoader />}><Home /></Suspense>} />,
  <Route key="search" path="/search" element={<Suspense fallback={<PublicPageLoader />}><SearchResults /></Suspense>} />,
  <Route key="directory" path="/directory" element={<Suspense fallback={<PublicPageLoader />}><SearchResults /></Suspense>} />,

  // SEO-friendly URLs for genres and cities
  <Route key="artistes-genre-city" path="/artistes/:genre/:city" element={<Suspense fallback={<PublicPageLoader />}><GenreDirectory /></Suspense>} />,
  <Route key="artistes-genre" path="/artistes/:genre" element={<Suspense fallback={<PublicPageLoader />}><GenreDirectory /></Suspense>} />,
  <Route key="artistes-city" path="/artistes/:city" element={<Suspense fallback={<PublicPageLoader />}><GenreDirectory /></Suspense>} />,
  <Route key="artistes" path="/artistes" element={<Suspense fallback={<PublicPageLoader />}><GenreDirectory /></Suspense>} />,

  <Route key="login" path={ROUTES.LOGIN} element={<Suspense fallback={<PublicPageLoader />}><Login /></Suspense>} />,
  <Route key="register" path={ROUTES.REGISTER} element={<Suspense fallback={<PublicPageLoader />}><Register /></Suspense>} />,
  <Route
    key="artist-public"
    path="/artist/:slug"
    element={<Suspense fallback={<PublicPageLoader />}><PublicArtistProfile /></Suspense>}
  />,
  <Route key="demo" path="/demo" element={<Suspense fallback={<PublicPageLoader />}><ErrorHandlingDemo /></Suspense>} />,
];
