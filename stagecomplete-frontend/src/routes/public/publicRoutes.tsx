import { Route } from "react-router-dom";
import Home from "../../pages/Home";
import { Login, Register } from "../../pages";
import { ROUTES } from "../../constants";
import { PublicArtistProfile } from "../../pages/public/PublicArtistProfile";
import { SearchResults } from "../../pages/public/SearchResults";
import { GenreDirectory } from "../../pages/public/GenreDirectory";
import ErrorHandlingDemo from "../../pages/ErrorHandlingDemo";

export const publicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="home-alt" path="/home" element={<Home />} />,
  <Route key="search" path="/search" element={<SearchResults />} />,
  <Route key="directory" path="/directory" element={<SearchResults />} />,

  // SEO-friendly URLs for genres and cities
  <Route key="artistes-genre-city" path="/artistes/:genre/:city" element={<GenreDirectory />} />,
  <Route key="artistes-genre" path="/artistes/:genre" element={<GenreDirectory />} />,
  <Route key="artistes-city" path="/artistes/:city" element={<GenreDirectory />} />,
  <Route key="artistes" path="/artistes" element={<GenreDirectory />} />,

  <Route key="login" path={ROUTES.LOGIN} element={<Login />} />,
  <Route key="register" path={ROUTES.REGISTER} element={<Register />} />,
  <Route
    key="artist-public"
    path="/artist/:slug"
    element={<PublicArtistProfile />}
  />,
  <Route key="demo" path="/demo" element={<ErrorHandlingDemo />} />,
];
