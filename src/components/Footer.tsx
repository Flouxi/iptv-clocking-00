import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { PaymentLogos } from "./PaymentLogos";
import { Mail } from "lucide-react";


export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Professionella, utskrivbara PDF-verktyg för svenska företagare.
            Ladda ner. Skriv ut. Lyckas.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex max-w-md gap-2"
          >
            <div className="flex flex-1 items-center gap-2 rounded-md bg-white/10 px-3">
              <Mail className="h-4 w-4 text-white/60" />
              <input
                type="email"
                required
                placeholder="Din e-postadress"
                className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
            </div>
            <button className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground hover:opacity-90">
              Prenumerera
            </button>
          </form>
          <p className="mt-5 text-xs text-white/60">
            Support:{" "}
            <a
              href="mailto:support@ipnord4k.com"
              className="text-white hover:underline"
            >
              support@ipnord4k.com
            </a>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Butik</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/shop" className="hover:text-white">Alla produkter</Link></li>
            <li><Link to="/shop" search={{ category: "business" }} className="hover:text-white">Företag</Link></li>
            <li><Link to="/shop" search={{ category: "finance" }} className="hover:text-white">Ekonomi</Link></li>
            <li><Link to="/shop" search={{ category: "marketing" }} className="hover:text-white">Marknadsföring</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Företag</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">Om oss</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blogg</Link></li>
            <li><Link to="/contact" className="hover:text-white">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Juridik</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/legal/terms" className="hover:text-white">Köpvillkor</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-white">Integritetspolicy</Link></li>
            <li><Link to="/legal/refund" className="hover:text-white">Återbetalning</Link></li>
            <li><Link to="/legal/delivery" className="hover:text-white">Leveranspolicy</Link></li>
            <li><Link to="/legal/cookies" className="hover:text-white">Cookiepolicy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs text-white/60">
          <p className="text-center sm:text-left">
            <strong className="text-white/80">IPNORD4K</strong> — Digitala PDF-produkter för svenska företagare.<br />
            Org.nr: 559000-0000 • Momsreg.nr: SE559000000001 • Stockholm, Sverige<br />
            Kontakt: <a href="mailto:support@ipnord4k.com" className="hover:text-white">support@ipnord4k.com</a>
          </p>
        </div>
        <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-white/10 py-5 text-xs text-white/60 sm:flex-row">

          <p>© {new Date().getFullYear()} IPNORD4K.COM — Alla rättigheter förbehållna.</p>
          <PaymentLogos variant="dark" />
        </div>

      </div>
    </footer>
  );
}
