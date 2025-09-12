import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserCheck, ArrowRight } from "lucide-react";
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
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

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
            className="inline-block p-3 bg-secondary/10 rounded-full mb-4"
          >
            <div className="text-4xl">🎪</div>
          </motion.div>

          <h1 className="text-3xl font-bold text-base-content mb-2">
            Rejoindre <span className="text-secondary">StageComplete</span>
          </h1>
          <p className="text-base-content/70">
            Créez votre compte et révolutionnez votre art
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

              {/* Role Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Je suis :</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
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

              {/* Name */}
              <Input
                label="Nom complet"
                type="text"
                placeholder="Votre nom ou nom de venue"
                icon={<User />}
                error={errors.name?.message}
                {...register("name")}
                autoComplete="name"
              />

              {/* Email */}
              <Input
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
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight />}
              >
                Créer mon compte
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
