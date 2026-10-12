import { Montserrat, Playfair_Display, Space_Grotesk } from "next/font/google"

import { cn } from "@/lib/utils"

// Polices proposées dans l'éditeur uniquement (cf. lib/fonts) : les charger ici
// évite de les précharger sur la landing, où seules Inter, Poppins et Geist Mono servent.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
})

export default function EditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // `contents` : le conteneur porte les variables CSS sans toucher à la mise en page.
  return (
    <div className={cn("contents", montserrat.variable, spaceGrotesk.variable, playfair.variable)}>
      {children}
    </div>
  )
}
