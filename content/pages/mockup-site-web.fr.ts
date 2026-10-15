import type { PageContent } from "../types"

const content: PageContent = {
  title: "Mockup de site web gratuit, à partir de son adresse",
  description:
    "Collez l'adresse de votre site : Cover Studio capture ses pages sur ordinateur et mobile, puis les met dans un navigateur et un téléphone. Gratuit.",
  h1: "Mockup de site web à partir de son adresse",
  intro:
    "Pas de capture d'écran sous la main ? Collez l'adresse de votre site ci-dessous : Cover Studio trouve ses pages, capture celles que vous choisissez sur ordinateur et sur mobile, et les met en scène.",
  ogImage: {
    src: "/seo/website-mockup-from-url/og.png",
    alt: "Mockup de site web créé avec Cover Studio : la même page dans un navigateur et dans un téléphone",
  },
  sections: [
    {
      heading: "De l'adresse au mockup, en quatre étapes",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "**Analyser.** Cover Studio lit la page d'accueil, ses liens de navigation et le sitemap pour lister les pages du site, rangées en navigation, pages, blog et mentions légales.",
            "**Choisir.** Cochez jusqu'à 2 pages capturées sur ordinateur et sur mobile, ou jusqu'à 4 pages sur un seul appareil. Un aperçu montre la page avant de lancer la capture.",
            "**Capturer.** Chaque page est affichée dans un vrai navigateur Chrome, puis arrive dans la galerie comme une capture d'écran importée.",
            "**Mettre en scène et exporter.** Choisissez un modèle et une couleur, puis téléchargez le PNG au format voulu.",
          ],
        },
        {
          type: "figure",
          src: "/seo/website-mockup-from-url/example-devices.webp",
          alt: "Mockup d'un site affiché dans un navigateur d'ordinateur, avec la même page dans un téléphone au premier plan",
          caption:
            "Les captures ordinateur et mobile d'une même page, placées par le modèle Showcase.",
          width: 2400,
          height: 1500,
        },
      ],
    },
    {
      heading: "Ce qui part sur le serveur, ce qui reste chez vous",
      blocks: [
        {
          type: "p",
          text: "La capture d'un site est la seule fonction qui passe par un serveur : l'adresse saisie est envoyée au service de capture de Cover Studio, qui renvoie les images. Rien d'autre. Les captures que vous importez vous-même ne quittent jamais votre appareil, et la mise en page comme l'export se font toujours dans votre navigateur.",
        },
        {
          type: "p",
          text: "Le service de capture est open source, comme le reste du projet : son fonctionnement est décrit dans [le dépôt GitHub](https://github.com/roosveltkn/cover-studio/blob/main/docs/CAPTURE.md) (en anglais).",
        },
      ],
    },
    {
      heading: "Les sites qu'il ne peut pas capturer",
      blocks: [
        {
          type: "p",
          text: "Le service voit votre site comme un visiteur non connecté. Dans quelques cas, il faut importer ses captures à la main :",
        },
        {
          type: "list",
          items: [
            "les pages derrière une connexion (tableau de bord, espace d'administration) ;",
            "les sites qui bloquent les navigateurs automatisés ;",
            "les adresses locales, comme `localhost` ou un réseau privé.",
          ],
        },
        {
          type: "p",
          text: "Repassez alors la source sur **Fichiers** et déposez vos captures : la suite est identique.",
        },
      ],
    },
    {
      heading: "Un mockup, plusieurs formats",
      blocks: [
        {
          type: "p",
          text: "Le même visuel s'exporte en grand format (2400 × 1500), en image Open Graph (1200 × 630) pour le partage de liens et LinkedIn, en aperçu de dépôt GitHub, au format X, en galerie Product Hunt ou en carré. Il suffit de changer de format dans le panneau Export. Pour partir de vos propres captures plutôt que d'une adresse, passez par [la page d'accueil](page:).",
        },
        {
          type: "figure",
          src: "/seo/website-mockup-from-url/example-mobile.webp",
          alt: "Trois captures mobiles d'un site côte à côte dans des téléphones",
          caption:
            "Des captures uniquement mobiles vont dans le modèle Mobile trio.",
          width: 2400,
          height: 1500,
        },
      ],
    },
  ],
  faq: [
    {
      question: "Combien de pages puis-je capturer à la fois ?",
      answer:
        "Quatre captures par lancement : 2 pages sur ordinateur et mobile, ou 4 pages sur un seul appareil. La galerie contient 4 images.",
    },
    {
      question: "Combien de temps prend une capture ?",
      answer: "Une dizaine de secondes par page, deux pages à la fois.",
    },
    {
      question: "Puis-je mélanger pages capturées et captures importées ?",
      answer:
        "Oui. Les captures arrivent dans la même galerie que les fichiers importés ; réordonnez-les par glisser-déposer pour choisir l'emplacement de chacune.",
    },
    {
      question: "Est-ce vraiment gratuit ?",
      answer:
        "Oui, sans compte ni filigrane. Cover Studio est open source, sous licence MIT.",
    },
  ],
}

export default content
