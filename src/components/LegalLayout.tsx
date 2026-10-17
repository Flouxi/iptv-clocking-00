import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalLayout({ title, updated, children }: Props) {
  return (
    <div className="container-page py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Última actualización: {updated}
        </p>
        <div className="legal-prose mt-10 space-y-5 text-foreground/90">
          {children}
        </div>
        <div className="mt-12 rounded-xl border border-border bg-card p-5 text-sm">
          <p className="font-semibold">¿Tienes dudas sobre esta política?</p>
          <p className="mt-1 text-muted-foreground">
            Escríbenos a{" "}
            <a href="mailto:support@ipnord4k.com" className="text-primary hover:underline">
              support@ipnord4k.com
            </a>{" "}
            y te responderemos en un plazo de 24 horas.
          </p>
        </div>
      </div>
    </div>
  );
}
