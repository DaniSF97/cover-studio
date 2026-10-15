import type { PageContent } from "../types"

const content: PageContent = {
  title: "GitHub social preview image generator from screenshots",
  description:
    "Make your repository's 1280 × 640 social preview from your app's screenshots: device frames, your brand colour, a PNG under 1 MB. Free, no account.",
  h1: "GitHub social preview image generator",
  label: "GitHub social preview",
  summary: "The 1280 × 640 image shown when your repository link is shared.",
  intro:
    "Without a social preview, a shared repository link shows your avatar and the repo name. Add your screenshots below and download a 1280 × 640 PNG that shows the app itself.",
  ogImage: {
    src: "/seo/github-social-preview/og.png",
    alt: "A GitHub social preview made with Cover Studio: an app screenshot in a browser frame on a purple background",
  },
  sections: [
    {
      heading: "What GitHub expects",
      blocks: [
        {
          type: "p",
          text: "The social preview is the image that appears when someone pastes your repository URL into Slack, Discord, X, LinkedIn or an issue on another site. GitHub's own guidance is short, and worth knowing before you design anything:",
        },
        {
          type: "table",
          caption: "GitHub social preview requirements",
          head: ["Rule", "Value"],
          rows: [
            ["Best display", "1280 × 640 px (a 2:1 ratio)"],
            ["Minimum", "640 × 320 px"],
            ["Weight", "under 1 MB"],
            ["Formats", "PNG, JPG or GIF (transparent PNG accepted)"],
          ],
        },
        {
          type: "p",
          text: "Cover Studio's GitHub format is exactly 1280 × 640. For reference, the social preview of [our own repository](https://github.com/roosveltkn/cover-studio), made with this tool, weighs 627 KB: comfortably under the limit. Keep the default 1× export; the 2× option doubles the pixels and can push the file past 1 MB.",
        },
      ],
    },
    {
      heading: "Examples made with Cover Studio",
      blocks: [
        {
          type: "figure",
          src: "/seo/github-social-preview/example-showcase.webp",
          alt: "Social preview with the app name, a short description, three feature chips and a desktop screenshot in a browser frame",
          caption:
            "The Showcase template: name, one-line pitch and feature chips on the left, the app on the right.",
          width: 1280,
          height: 640,
        },
        {
          type: "figure",
          src: "/seo/github-social-preview/example-spotlight.webp",
          alt: "Social preview with a large centered desktop screenshot under the app name",
          caption:
            "The Spotlight template puts a single screenshot centre stage, which reads well at thumbnail size.",
          width: 1280,
          height: 640,
        },
      ],
    },
    {
      heading: "Upload it to your repository",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Open the repository on GitHub and go to **Settings** (the tab under the repository name).",
            "In the **General** section, find **Social preview** and click **Edit**.",
            "Choose **Upload an image…** and pick the PNG you downloaded here.",
          ],
        },
        {
          type: "p",
          text: "GitHub only shares the image from a public repository. Platforms cache link previews, so a link already posted somewhere may keep its old card for a while; a fresh share picks up the new one.",
        },
      ],
    },
    {
      heading: "What makes a preview readable",
      blocks: [
        {
          type: "p",
          text: "The image is usually displayed around 500 px wide, sometimes less. What survives that size is a short name, one sentence at most, and a screenshot large enough to recognise the interface. A full paragraph or a dense dashboard turns into noise.",
        },
        {
          type: "list",
          items: [
            "Keep the text in the left or top area: some apps crop the edges of the card.",
            "Pick a brand colour with enough contrast against white text; Cover Studio derives the whole palette from it.",
            "Use your best screen, not your login page. If the app is mobile-first, a phone screenshot works just as well.",
            "Avoid transparency unless you have checked the image on both light and dark backgrounds.",
          ],
        },
        {
          type: "p",
          text: "The same image often ends up at the top of the README too. If you want a taller visual there, see the [README banner](page:readme-banner) page, which uses the larger 16:10 format.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "What size is a GitHub social preview?",
      answer:
        "1280 × 640 pixels for the best display, at least 640 × 320, and under 1 MB. That is a 2:1 ratio, which is the GitHub format in Cover Studio.",
    },
    {
      question: "Why does my shared link still show the old image?",
      answer:
        "Slack, X, LinkedIn and others cache link previews. New shares usually show the new image; for an existing post, the platform decides when it refreshes.",
    },
    {
      question: "Can I use the same image for Open Graph on my website?",
      answer:
        "You can, but the Open Graph format is 1200 × 630, a slightly different ratio. Cover Studio exports both from the same design: switch the format in the Export panel.",
    },
    {
      question: "Are my screenshots uploaded anywhere?",
      answer:
        "No. The layout and the PNG export run in your browser; the screenshots never leave your device.",
    },
  ],
}

export default content
