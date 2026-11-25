import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "danger" | "neutral" | "ghost";

interface IButtonDefault extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Botão "de brinquedo": cor chapada + sombra deslocada sem desfoque, no mesmo
 * espírito das ilustrações (contorno firme, volume simples).
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green-500 text-brown-50 shadow-[0_4px_0_var(--color-green-700)] hover:bg-green-600",
  danger:
    "bg-blood-500 text-brown-50 shadow-[0_4px_0_var(--color-blood-600)] hover:bg-blood-600",
  neutral:
    "bg-brown-600 text-brown-100 shadow-[0_4px_0_var(--color-brown-800)] hover:bg-brown-500",
  ghost:
    "bg-transparent text-brown-200 ring-2 ring-inset ring-brown-500/70 hover:bg-brown-700/60 shadow-none",
};

// Alturas no grid de 8 px: 48 px no toque (mínimo recomendado pelo Material
// Design / Apple), 40 px (md) e 32 px (sm) quando há mouse.
const sizes = {
  sm: "h-12 sm:h-8 text-sm px-3 gap-1.5",
  md: "h-12 sm:h-10 text-base px-6 gap-2",
};

export const ButtonDefault: React.FC<IButtonDefault> = ({
  className = "",
  children,
  text,
  icon,
  variant = "primary",
  size = "md",
  type = "button",
  ref,
  ...rest
}) => {
  return (
    <button
      ref={ref}
      type={type}
      {...rest}
      className={`inline-flex items-center justify-center rounded-lg font-title font-semibold leading-none whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {text && <span className="pt-0.5">{text}</span>}
      {children}
    </button>
  );
};

export default ButtonDefault;
