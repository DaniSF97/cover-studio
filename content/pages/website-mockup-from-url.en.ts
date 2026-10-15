import type { PageContent } from "../types"

const content: PageContent = {
  title: "Website mockup generator from a URL, desktop and mobile",
  description:
    "Paste your website's address: Cover Studio captures its pages on desktop and mobile and frames them in a browser and a phone. Free PNG export.",
  h1: "Website mockup generator from a URL",
  label: "Website mockup from a URL",
  summary:
    "Paste your site's address: its pages are captured on desktop and mobile.",
  intro:
    "No screenshots at hand? Paste your site's address below. Cover Studio finds its pages, captures the ones you pick on desktop and mobile, and frames them for you.",
  ogImage: {
    src: "/seo/website-mockup-from-url/og.png",
    alt: "A website mockup made from a URL with Cover Studio: the same page in a browser frame and in a phone frame",
  },
  sections: [
    {
      heading: "From an address to a mockup",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**Analyze.** Cover Studio reads the home page, its navigation links and the sitemap to list the site's pages, grouped as navigation, pages, blog and legal.",
            "**Pick.** Check up to 2 pages captured on both desktop and mobile, or up to 4 pages on a single device. A preview shows a page before you commit.",
            "**Capture.** Each page is rendered in a real Chrome browser and lands in the gallery as a screenshot, exactly as if you had imported it.",
            "**Frame and export.** Choose a template and a colour, then download the PNG in the size you need.",
          ],
        },
        {
          type: "figure",
          src: "/seo/website-mockup-from-url/example-devices.webp",
          alt: "Mockup of one website shown in a desktop browser frame with the same page in a phone frame in front of it",
          caption:
            "Desktop and mobile captures of the same page, placed by the Showcase template.",
          width: 2400,
          height: 1500,
        },
      ],
    },
    {
      heading: "What gets sent, and what stays in your browser",
      blocks: [
        {
          type: "p",
          text: "Capturing a site is the one feature that uses a server: the address you type is sent to the Cover Studio capture service, which returns the images. Nothing else is sent. Screenshots you import yourself never leave your device, and the layout and the export always run in your browser.",
        },
        {
          type: "p",
          text: "The capture service is open source like the rest of the project; its contract is documented in [the repository](https://github.com/roosveltkn/cover-studio/blob/main/docs/CAPTURE.md).",
        },
      ],
    },
    {
      heading: "Sites it can't capture",
      blocks: [
        {
          type: "p",
          text: "The service sees your site the way a logged-out visitor does. A few cases need screenshots imported by hand instead:",
        },
        {
          type: "list",
          items: [
            "pages behind a login (dashboards, admin areas);",
            "sites that block automated browsers;",
            "local addresses such as `localhost` or a private network.",
          ],
        },
        {
          type: "p",
          text: "Switch the source back to **Files** and drop your own screenshots: the rest of the flow is identical.",
        },
      ],
    },
    {
      heading: "Where the mockup goes next",
      blocks: [
        {
          type: "p",
          text: "The same captures can become a [GitHub social preview](page:github-social-preview) for your repository or a [README banner](page:readme-banner); only the export format changes.",
        },
        {
          type: "figure",
          src: "/seo/website-mockup-from-url/example-mobile.webp",
          alt: "Three mobile captures of a website side by side in phone frames",
          caption: "Mobile-only captures go to the Mobile trio template.",
          width: 2400,
          height: 1500,
        },
      ],
    },
  ],
  faq: [
    {
      question: "How many pages can I capture at once?",
      answer:
        "Four screenshots per run: 2 pages on both desktop and mobile, or 4 pages on a single device. The gallery holds 4 images.",
    },
    {
      question: "How long does a capture take?",
      answer: "About ten seconds per page, two pages at a time.",
    },
    {
      question: "Can I mix captured pages and my own screenshots?",
      answer:
        "Yes. Captures land in the same gallery as imported files; reorder them by drag and drop to choose which frame each one goes in.",
    },
    {
      question: "Is it free?",
      answer:
        "Yes, with no account and no watermark. Cover Studio is open source under the MIT license.",
    },
  ],
}

export default content
