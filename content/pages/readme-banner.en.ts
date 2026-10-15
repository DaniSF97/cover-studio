import type { PageContent } from "../types"

const content: PageContent = {
  title: "GitHub README banner generator from your screenshots",
  description:
    "Turn your screenshots into the banner at the top of your GitHub README: device frames, your colours, a sharp PNG and the Markdown to embed it. Free.",
  h1: "GitHub README banner generator",
  intro:
    "Visitors decide in a few seconds whether a project is for them. A banner built from your real screenshots answers before they read a line. Add them below, download the PNG, paste two lines of Markdown.",
  ogImage: {
    src: "/seo/readme-banner/og.png",
    alt: "A README banner made with Cover Studio: an app shown in a browser frame and a phone frame",
  },
  sections: [
    {
      heading: "A banner that shows the product",
      blocks: [
        {
          type: "p",
          text: "Most README headers are a logo on a gradient. That says nothing about what the software does. A banner with the actual interface, framed in a browser or a phone, does the job of the first paragraph and the first screenshot at once.",
        },
        {
          type: "figure",
          src: "/seo/readme-banner/example-bento.webp",
          alt: "README banner with the project name and three screenshots arranged in a grid",
          caption:
            "The Bento template fits several screens of the same app in one banner.",
          width: 2400,
          height: 1500,
        },
        {
          type: "p",
          text: "This page opens the editor in the **Cover** format, 2400 × 1500 (16:10). The README column on github.com is under 1,000 px wide, so the image stays sharp on high-density screens while GitHub scales it down.",
        },
      ],
    },
    {
      heading: "Add it to your README",
      blocks: [
        {
          type: "p",
          text: "Commit the PNG to the repository (a `docs/assets/` folder is a common choice) and reference it with a relative path, so the image follows forks and branches:",
        },
        {
          type: "code",
          label: "Markdown",
          code: "![My app: screenshots of the dashboard and the mobile view](docs/assets/cover.png)",
        },
        {
          type: "p",
          text: "To control the width or centre it, GitHub also accepts plain HTML in a README:",
        },
        {
          type: "code",
          label: "HTML",
          code: '<p align="center">\n  <img src="docs/assets/cover.png" alt="My app: dashboard and mobile view" width="800">\n</p>',
        },
        {
          type: "p",
          text: "GitHub supports the `<picture>` element too, so you can export a light and a dark version of the same banner and let the reader's theme pick one.",
        },
        {
          type: "code",
          label: "HTML, light and dark versions",
          code: '<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/cover-dark.png">\n  <img src="docs/assets/cover.png" alt="My app: dashboard and mobile view">\n</picture>',
        },
      ],
    },
    {
      heading: "Banner or social preview?",
      blocks: [
        {
          type: "p",
          text: "They are two different images. The README banner lives in the page; the [GitHub social preview](page:github-social-preview) is the 1280 × 640 card shown when the repository link is shared elsewhere. Many projects use one design for both: build it here, then switch the format to GitHub in the Export panel and download it a second time.",
        },
        {
          type: "figure",
          src: "/seo/readme-banner/example-editorial.webp",
          alt: "README banner with a large title on the left and a desktop screenshot on the right",
          caption:
            "The Editorial template leaves more room for the name and the one-line pitch.",
          width: 2400,
          height: 1500,
        },
      ],
    },
    {
      heading: "Keep it honest and light",
      blocks: [
        {
          type: "list",
          items: [
            "Use current screenshots: a banner that no longer matches the app costs more trust than no banner.",
            'Write the alt text as a sentence about the product, not "banner".',
            "Re-export when the interface changes. Cover Studio keeps your texts and colours in the browser, so it takes a minute.",
            "If the repository is a library without a UI, a banner of a demo or of the docs site works better than an empty frame.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What size should a GitHub README banner be?",
      answer:
        "There is no imposed size. A wide image of at least 1600 px stays sharp on high-density screens; Cover Studio exports 2400 × 1500. Keep the file light enough to load fast.",
    },
    {
      question: "Is this a GitHub profile banner?",
      answer:
        "No. Profile READMEs usually want a decorative header about a person. This page is about a project: the banner shows the app from its screenshots.",
    },
    {
      question: "Can I edit the banner later?",
      answer:
        "Yes. Your texts and colours are kept in your browser; import new screenshots and export again.",
    },
    {
      question: "Do I need an account or a watermark-free plan?",
      answer:
        "No account, no watermark, no export limit: Cover Studio is free and open source (MIT).",
    },
  ],
}

export default content
