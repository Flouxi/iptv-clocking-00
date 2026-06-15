import visa from "@/assets/pay-visa.svg.asset.json";
import mastercard from "@/assets/pay-mastercard.svg.asset.json";
import amex from "@/assets/pay-american-express.svg.asset.json";
import applePay from "@/assets/pay-apple-pay.svg.asset.json";
import googlePay from "@/assets/pay-google-pay.svg.asset.json";

const LOGOS = [
  { src: visa.url, alt: "Visa" },
  { src: mastercard.url, alt: "Mastercard" },
  { src: amex.url, alt: "American Express" },
  { src: applePay.url, alt: "Apple Pay" },
  { src: googlePay.url, alt: "Google Pay" },
];

export function PaymentLogos({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      aria-label="Accepterade betalsätt"
    >
      {LOGOS.map((l) => (
        <span
          key={l.alt}
          className={`inline-flex h-8 items-center justify-center rounded-md border px-2 ${
            variant === "light"
              ? "border-border bg-white"
              : "border-white/20 bg-white"
          }`}
        >
          <img src={l.src} alt={l.alt} className="h-5 w-auto" />
        </span>
      ))}
    </div>
  );
}
