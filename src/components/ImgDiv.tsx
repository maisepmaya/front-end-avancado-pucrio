import type { ReactNode } from "react";

interface ImgDivProps {
  children?: ReactNode;
  className?: string;
  src: string;
  /** Texto alternativo. Deixe vazio quando a imagem for só moldura/decoração. */
  alt?: string;
  loading?: "lazy" | "eager";
}

/**
 * Usa uma ilustração como "moldura" de um conteúdo (madeira, pergaminho,
 * coração...). A imagem é decorativa por padrão: o conteúdo de dentro continua
 * acessível para leitores de tela.
 */
const ImgDiv = ({
  children,
  className = "",
  src,
  alt = "",
  loading = "eager",
}: ImgDivProps) => {
  const isMeaningful = Boolean(alt) && !children;

  return (
    <div
      className={`${className} relative`}
      role={isMeaningful ? "img" : undefined}
      aria-label={isMeaningful ? alt : undefined}
    >
      <img
        className="pointer-events-none absolute inset-0 z-0 size-full object-fill transition-all select-none"
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={loading}
      />
      <div className="relative z-10 flex size-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ImgDiv;
