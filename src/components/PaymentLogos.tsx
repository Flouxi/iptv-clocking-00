import visa from "@/assets/pay-visa.svg";
import mastercard from "@/assets/pay-mastercard.svg";
import amex from "@/assets/pay-american-express.svg";
import applePay from "@/assets/pay-apple-pay.svg";
import googlePay from "@/assets/pay-google-pay.svg";

const LOGOS = [
  { src: visa, alt: "Visa" },
  { src: mastercard, alt: "Mastercard" },
  { src: amex, alt: "American Express" },
  { src: applePay, alt: "Apple Pay" },
  { src: googlePay, alt: "Google Pay" },
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
