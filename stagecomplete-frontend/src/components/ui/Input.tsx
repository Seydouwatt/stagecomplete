import React, { forwardRef } from "react";
import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isPassword, icon, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : props.type;

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-5 h-5 text-base-content/50">{icon}</div>
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "input input-bordered w-full",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "input-error",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-base-content/50 hover:text-base-content" />
              ) : (
                <Eye className="w-5 h-5 text-base-content/50 hover:text-base-content" />
              )}
            </button>
          )}
        </div>

        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
