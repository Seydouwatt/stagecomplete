import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, UserCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Input, Button } from "../../components/ui";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";

// Validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nom requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().min(1, "Email requis").email("Format email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  role: z.enum(["ARTIST", "VENUE"], {
    message: "Veuillez sélectionner votre rôle",
  }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  // Détection si l'utilisateur arrive depuis la landing page artiste
  const isFromArtistLanding = searchParams.get('from') === 'artist' ||
                               searchParams.get('role') === 'artist' ||
                               document.referrer.includes('/artistes');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: isFromArtistLanding ? "ARTIST" : undefined,
    },
  });

  // Pré-sélectionner ARTIST si l'utilisateur arrive de la landing page artiste
  useEffect(() => {
    if (isFromArtistLanding) {
      setValue("role", "ARTIST");
    }
  }, [isFromArtistLanding, setValue]);

  const selectedRole = watch("role");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      // Error is handled by the store
      console.error("Register error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-base-100 to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-block p-3 rounded-full mb-4 ${
              isFromArtistLanding
                ? "bg-purple-100 text-purple-600"
                : "bg-secondary/10"
            }`}
          >
            {isFromArtistLanding ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <div className="text-4xl">🎪</div>
            )}
          </motion.div>

          <h1 className="text-3xl font-bold text-base-content mb-2">
            {isFromArtistLanding ? (
              <>
                Crée ta fiche{" "}
                <span className="text-purple-600">artiste gratuite</span>
              </>
            ) : (
              <>
                Rejoindre <span className="text-secondary">StageComplete</span>
              </>
            )}
          </h1>
          <p className="text-base-content/70">
            {isFromArtistLanding
              ? "En 5 minutes, booste ta visibilité et impressionne tes fans"
              : "Créez votre compte et révolutionnez votre art"}
          </p>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card bg-base-100 shadow-2xl border border-base-300"
        >
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Global Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="alert alert-error"
                >
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Role Selection - Masqué si utilisateur arrive de la landing artiste */}
              {!isFromArtistLanding && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Je suis :</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        data-cy="register-role-artist"
                        type="radio"
                        value="ARTIST"
                        className="radio radio-primary hidden"
                        {...register("role")}
                      />
                      <div
                        className={`
                        card card-compact bg-base-200 hover:bg-base-300 transition-all
                        ${
                          selectedRole === "ARTIST"
                            ? "ring-2 ring-primary bg-primary/10"
                            : ""
                        }
                      `}
                      >
                        <div className="card-body items-center text-center">
                          <User className="w-6 h-6 text-primary" />
                          <span className="text-sm font-medium">Artiste</span>
                        </div>
                      </div>
                    </label>

                    <label className="cursor-pointer">
                      <input
                        data-cy="register-role-venue"
                        type="radio"
                        value="VENUE"
                        className="radio radio-secondary hidden"
                        {...register("role")}
                      />
                      <div
                        className={`
                        card card-compact bg-base-200 hover:bg-base-300 transition-all
                        ${
                          selectedRole === "VENUE"
                            ? "ring-2 ring-secondary bg-secondary/10"
                            : ""
                        }
                      `}
                      >
                        <div className="card-body items-center text-center">
                          <UserCheck className="w-6 h-6 text-secondary" />
                          <span className="text-sm font-medium">Venue</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  {errors.role && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.role.message}
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Message d'information pour les artistes */}
              {isFromArtistLanding && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">
                        Créer ta fiche artiste gratuite
                      </h3>
                      <p className="text-sm text-purple-700">
                        URL personnalisée, portfolio, réseaux sociaux - tout
                        inclus !
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Name */}
              <Input
                data-cy="name"
                label={isFromArtistLanding ? "Ton nom d'artiste" : "Nom complet"}
                type="text"
                placeholder={
                  isFromArtistLanding
                    ? "Ex: Martin Dubois, Les Étoiles, DJ Mix..."
                    : "Votre nom ou nom de venue"
                }
                icon={<User />}
                error={errors.name?.message}
                {...register("name")}
                autoComplete="name"
              />

              {/* Email */}
              <Input
                data-cy="register-email"
                label="Email"
                type="email"
                placeholder="votre@email.com"
                icon={<Mail />}
                error={errors.email?.message}
                {...register("email")}
                autoComplete="email"
              />

              {/* Password */}
              <Input
                data-cy="register-password"
                label="Mot de passe"
                isPassword
                placeholder="••••••••"
                icon={<Lock />}
                error={errors.password?.message}
                {...register("password")}
                autoComplete="new-password"
              />

              {/* Submit Button */}
              <Button
                data-cy="register-submit"
                type="submit"
                variant="primary"
                size="lg"
                className={`w-full ${
                  isFromArtistLanding
                    ? "bg-purple-600 hover:bg-purple-700 border-purple-600"
                    : ""
                }`}
                isLoading={isLoading}
                rightIcon={isFromArtistLanding ? <Sparkles /> : <ArrowRight />}
              >
                {isFromArtistLanding
                  ? "Créer ma fiche artiste gratuite"
                  : "Créer mon compte"}
              </Button>
            </form>

            {/* Divider */}
            <div className="divider">OU</div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Déjà un compte ?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="link link-primary font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-base-content/50">
            © 2025 StageComplete. L'art trouve toujours sa scène.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
