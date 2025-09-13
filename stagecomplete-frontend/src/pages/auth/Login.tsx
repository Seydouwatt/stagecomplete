import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "../../components/ui";
import LoadingButton from "../../components/ui/LoadingButton";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";
import { toast } from "../../stores/useToastStore";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Format email invalide"),
  password: z
    .string()
    .min(1, "Mot de passe requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

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

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      toast.success("Connexion réussie !");
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      // Error is handled by axios interceptor
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex items-center justify-center p-4">
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
            className="inline-block p-3 bg-primary/10 rounded-full mb-4"
          >
            <div className="text-4xl">🎭</div>
          </motion.div>

          <h1 className="text-3xl font-bold text-base-content mb-2">
            <span className="text-primary">Stage</span>Complete
          </h1>
          <p className="text-base-content/70">
            Connectez-vous à votre espace artistique
          </p>
        </div>

        {/* Login Form */}
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
                autoComplete="current-password"
              />

              {/* Submit Button */}
              <LoadingButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Connexion en cours..."
              >
                <span className="flex items-center justify-center">
                  Se connecter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </LoadingButton>
            </form>

            {/* Divider */}
            <div className="divider">OU</div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-base-content/70">
                Pas encore de compte ?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="link link-primary font-medium"
                >
                  Créer un compte
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
            © 2025 StageComplete. Connectons l'art et les lieux.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
