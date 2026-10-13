import { toast } from "sonner"

import { GithubIcon } from "@/components/github-icon"

type StarToastOptions = {
  message: string
  cta: string
  onStar: () => void
}

/**
 * Remplace le toast de succès : une seule notification, qui reste affichée
 * jusqu'à la croix, avec un bouton aux couleurs de GitHub.
 */
export function showStarToast({ message, cta, onStar }: StarToastOptions) {
  toast.success(message, {
    duration: Infinity,
    closeButton: true,
    actionButtonStyle: {
      backgroundColor: "#24292f",
      color: "#ffffff",
      border: "1px solid rgb(255 255 255 / 0.15)",
    },
    action: {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <GithubIcon className="size-3.5" aria-hidden />
          {cta}
        </span>
      ),
      onClick: onStar,
    },
  })
}
