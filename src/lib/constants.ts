export const SITE = {
  name: "ULC – FSEG",
  fullName:
    "Faculté de Sciences Économiques et de Gestion – Université Loyola du Congo",
  shortDescription:
    "Former les leaders économiques et gestionnaires de demain, dans la tradition d'excellence jésuite.",
  campus: "Kimwenza, Kinshasa – RDC",
  parent: {
    name: "Université Loyola du Congo",
    url: "https://uloyola.cd",
  },
  social: {
    facebook: "https://web.facebook.com/profile.php?id=61576847713122",
    linkedin:
      "https://www.linkedin.com/in/facult%C3%A9-de-sciences-%C3%A9conomiques-et-de-gestion-fseg-ulc-7aa11136a/",
  },
  contact: {
    email: "fseg@uloyola.cd",
    phone: "+243 000 000 000",
    address: "Campus de Kimwenza, Kinshasa, RDC",
  },
  admissions: {
    portal: "https://uloyola.cd/students_admin/souscription/",
  },
};

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/la-faculte", label: "La Faculté" },
  { href: "/programmes", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  { href: "/actualites", label: "Actualités" },
  { href: "/resultats", label: "Résultats" },
  { href: "/contact", label: "Contact" },
] as const;

export const MASTER_FILIERES = [
  {
    title: "Banque et Assurance",
    description:
      "Maîtrise des techniques bancaires, des marchés financiers et de la gestion des risques d'assurance.",
  },
  {
    title: "Comptabilité et Finance",
    description:
      "Audit, contrôle de gestion, finance d'entreprise et reporting financier aux normes internationales.",
  },
  {
    title: "Entrepreneuriat et Gestion des PME",
    description:
      "Création, pilotage et croissance des petites et moyennes entreprises dans le contexte africain.",
  },
  {
    title: "Sciences Économiques",
    description:
      "Analyse macro et microéconomique, politiques publiques et développement durable.",
  },
];

export const CAREER_PATHS = [
  "Agent de développement",
  "Fondateur de startup",
  "Secteur bancaire et assurances",
  "Finance et comptabilité",
  "Management",
  "Audit",
  "Administration du budget",
  "Recherche et enseignement",
];

export const FACTS = [
  { label: "Année de lancement", value: "2025" },
  { label: "Campus", value: "Kimwenza" },
  { label: "Système", value: "LMD" },
  { label: "Cycles", value: "Licence & Master" },
];
