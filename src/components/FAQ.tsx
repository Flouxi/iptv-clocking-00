import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿Cómo recibo mi archivo?",
    a: "Tras completar el pago, accederás a una página con el enlace de descarga. También te enviaremos el enlace por correo electrónico en un plazo de 2 minutos.",
  },
  {
    q: "¿En qué formato se entrega el archivo?",
    a: "Todos los productos se entregan como archivos PDF de alta resolución en formato A4, optimizados para imprimir y compatibles con ordenadores, móviles y tabletas.",
  },
  {
    q: "¿Puedo imprimir el archivo tantas veces como quiera?",
    a: "Sí. Al comprar un PDF, obtienes acceso de por vida y puedes imprimirlo tantas veces como necesites para uso personal o interno de tu empresa.",
  },
  {
    q: "¿Es seguro el pago?",
    a: "Sí. Stripe gestiona los pagos. Nunca guardamos los datos de tu tarjeta en nuestros servidores y todas las conexiones están cifradas mediante SSL.",
  },
  {
    q: "¿Qué hago si no recibo el archivo?",
    a: "Revisa primero la carpeta de spam. Si no encuentras el archivo, escribe a support@ipnord4k.com con tu número de pedido. Lo resolveremos en un plazo de 24 horas o te devolveremos el dinero.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
          <p className="mt-2 text-muted-foreground">
            Resolvemos las dudas más habituales. Si no encuentras la respuesta, ponte en contacto con nosotros.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
