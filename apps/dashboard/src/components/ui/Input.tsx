"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, type, className, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={cn(
            "w-full px-4 py-2.5 bg-background border border-border rounded-full text-sm text-foreground outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground",
            isPassword ? "pr-12" : "",
            className,
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p
          style={{
            font: "var(--text-caption)",
            color: "var(--color-error)",
            marginTop: "4px",
            fontWeight: "500",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
