export interface JwtPayload {
  sub: string; // id utilisateur
  email: string;
  iat?: number;
  exp?: number;
  // tu peux ajouter d’autres claims si besoin
  [key: string]: unknown;
}
