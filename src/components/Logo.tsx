import logoAsset from "@/assets/ipnord4k-logo.png.asset.json";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <img
      src={logoAsset.url}
      alt="IPNORD4K"
      className={`h-8 w-auto md:h-9 ${light ? "brightness-0 invert" : ""}`}
    />
  );
}

