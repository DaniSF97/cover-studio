import type { NextConfig } from "next"

// Sans URL publique, canonical, sitemap, Open Graph et JSON-LD pointeraient vers
// localhost : on préfère faire échouer le déploiement de production.
if (process.env.VERCEL_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL doit être défini pour un build de production (cf. .env.example).")
}

const nextConfig: NextConfig = {
  // Site 100 % statique : aucun backend, hébergeable sur n'importe quel CDN.
  output: "export",
  images: { unoptimized: true },
}

export default nextConfig
