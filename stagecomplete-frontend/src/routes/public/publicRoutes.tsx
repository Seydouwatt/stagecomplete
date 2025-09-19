import { Route } from "react-router-dom";
import Home from "../../pages/Home";
import { Login, Register } from "../../pages";
import { ROUTES } from "../../constants";
import { PublicArtistProfile } from "../../pages/public/PublicArtistProfile";
import { SearchResults } from "../../pages/public/SearchResults";
import ErrorHandlingDemo from "../../pages/ErrorHandlingDemo";

export const publicRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="home-alt" path="/home" element={<Home />} />,
  <Route key="search" path="/search" element={<SearchResults />} />,
  <Route key="directory" path="/directory" element={<SearchResults />} />,
  <Route key="login" path={ROUTES.LOGIN} element={<Login />} />,
  <Route key="register" path={ROUTES.REGISTER} element={<Register />} />,
  <Route
    key="artist-public"
    path="/artist/:slug"
    element={<PublicArtistProfile />}
  />,
  <Route key="demo" path="/demo" element={<ErrorHandlingDemo />} />,
];
