/**
 * Legal page copy. German is binding; EN/FR are courtesy translations.
 * Describes ONLY what this website technically does (verified in code). Operator identity,
 * e-mail and registration data come from src/data/legal.ts and are never guessed.
 * Must be reviewed by the owner / a legal adviser before relying on it.
 */
import type { Lang } from './config';

export interface PrivacySection {
  h: string;
  p: string[];
}

export const imprintCopy: Record<
  Lang,
  {
    title: string;
    lede: string;
    operator: string;
    legalForm: string;
    representative: string;
    address: string;
    addressNote: string;
    contact: string;
    phone: string;
    mobile: string;
    email: string;
    register: string;
    vat: string;
    content: string;
    ifApplicable: string;
    authority: string;
    dispute: string;
    disputeNotWilling: string;
  }
> = {
  de: {
    title: 'Impressum',
    lede: 'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)',
    operator: 'Betreiber (Inhaber/in bzw. Firma)',
    legalForm: 'Rechtsform',
    representative: 'Vertretungsberechtigte Person',
    address: 'Anschrift',
    addressNote: 'Bestätigung ausstehend, dass dies die ladungsfähige Anschrift des Betreibers ist.',
    contact: 'Kontakt',
    phone: 'Telefon',
    mobile: 'Mobil',
    email: 'E-Mail',
    register: 'Registereintrag',
    vat: 'Umsatzsteuer-Identifikationsnummer',
    content: 'Verantwortlich für den Inhalt',
    ifApplicable: '(falls vorhanden)',
    authority: 'Zuständige Aufsichtsbehörde (Gaststättenerlaubnis)',
    dispute: 'Verbraucherstreitbeilegung',
    disputeNotWilling:
      'Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  },
  en: {
    title: 'Legal notice (Impressum)',
    lede: 'Information pursuant to § 5 German Digital Services Act (DDG)',
    operator: 'Operator (owner or company)',
    legalForm: 'Legal form',
    representative: 'Authorised representative',
    address: 'Address',
    addressNote: 'Confirmation pending that this is the operator’s address for service.',
    contact: 'Contact',
    phone: 'Phone',
    mobile: 'Mobile',
    email: 'E-mail',
    register: 'Commercial register entry',
    vat: 'VAT identification number',
    content: 'Responsible for content',
    ifApplicable: '(if applicable)',
    authority: 'Supervisory authority (restaurant licence)',
    dispute: 'Consumer dispute resolution',
    disputeNotWilling:
      'We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.',
  },
  fr: {
    title: 'Mentions légales (Impressum)',
    lede: 'Informations selon le § 5 de la loi allemande sur les services numériques (DDG)',
    operator: 'Exploitant (propriétaire ou société)',
    legalForm: 'Forme juridique',
    representative: 'Représentant légal',
    address: 'Adresse',
    addressNote: 'Confirmation en attente qu’il s’agit de l’adresse légale de l’exploitant.',
    contact: 'Contact',
    phone: 'Téléphone',
    mobile: 'Portable',
    email: 'E-mail',
    register: 'Inscription au registre du commerce',
    vat: 'Numéro de TVA intracommunautaire',
    content: 'Responsable du contenu',
    ifApplicable: '(le cas échéant)',
    authority: 'Autorité de contrôle (licence de restauration)',
    dispute: 'Règlement des litiges de consommation',
    disputeNotWilling:
      'Nous ne sommes ni disposés ni tenus à participer à une procédure de règlement des litiges devant un organisme de conciliation des consommateurs.',
  },
};

export const allergenCopy: Record<
  Lang,
  {
    title: string;
    lede: string;
    statusTitle: string;
    statusText: string;
    askStaff: string;
    germanLink: string;
    tableDish: string;
    tableStatus: string;
    pending: string;
    contains: string;
    noneDeclared: string;
    legendAllergens: string;
    legendAdditives: string;
    additivesNote: string;
    food: string;
    drinks: string;
    verifiedOn: string;
  }
> = {
  de: {
    title: 'Allergene & Zusatzstoffe',
    lede: 'Information zu den 14 Hauptallergenen (Verordnung (EU) Nr. 1169/2011, Anhang II) und kennzeichnungspflichtigen Zusatzstoffen.',
    statusTitle: 'Unsere Allergeninformationen',
    statusText:
      'Hier finden Sie die Allergene und Zusatzstoffe unserer Gerichte und Getränke. Fragen zu Allergenen oder Zutaten? Unser Team hilft Ihnen gerne weiter – bei Allergien oder Unverträglichkeiten sprechen Sie uns bitte vor der Bestellung an.',
    askStaff: 'Unser Team berät Sie gerne',
    germanLink: '',
    tableDish: 'Speise / Getränk',
    tableStatus: 'Allergene & Zusatzstoffe',
    pending: 'Auskunft gerne durch unser Team',
    contains: 'Enthält',
    noneDeclared: 'Keine kennzeichnungspflichtigen Allergene',
    legendAllergens: 'Die 14 Hauptallergene',
    legendAdditives: 'Kennzeichnungspflichtige Zusatzstoffe und Angaben',
    additivesNote: 'Wortlaut gemäß LMZDV § 5 bzw. FrSaftErfrischGetrV § 6.',
    food: 'Speisen',
    drinks: 'Getränke',
    verifiedOn: 'Stand',
  },
  en: {
    title: 'Allergens & additives',
    lede: 'Information on the 14 major allergens (Regulation (EU) No 1169/2011, Annex II) and additives that must be declared.',
    statusTitle: 'Our allergen information',
    statusText:
      'Here you will find the allergens and additives in our dishes and drinks. Questions about allergens or ingredients? Our team will be happy to help – if you have an allergy or intolerance, please speak to us before ordering.',
    askStaff: 'Our team will be happy to advise you',
    germanLink: 'The legally required information is provided in German:',
    tableDish: 'Dish / drink',
    tableStatus: 'Allergens & additives',
    pending: 'Please ask our team',
    contains: 'Contains',
    noneDeclared: 'No allergens requiring declaration',
    legendAllergens: 'The 14 major allergens',
    legendAdditives: 'Additives and statements that must be declared',
    additivesNote: 'German legal wording under LMZDV § 5 / FrSaftErfrischGetrV § 6.',
    food: 'Food',
    drinks: 'Drinks',
    verifiedOn: 'as of',
  },
  fr: {
    title: 'Allergènes et additifs',
    lede: 'Informations sur les 14 allergènes majeurs (règlement (UE) n° 1169/2011, annexe II) et les additifs à déclarer.',
    statusTitle: 'Nos informations sur les allergènes',
    statusText:
      'Vous trouverez ici les allergènes et additifs de nos plats et boissons. Des questions sur les allergènes ou les ingrédients ? Notre équipe se fera un plaisir de vous renseigner – en cas d’allergie ou d’intolérance, parlez-nous-en avant de commander.',
    askStaff: 'Notre équipe vous conseille volontiers',
    germanLink: 'Les informations légalement requises sont fournies en allemand :',
    tableDish: 'Plat / boisson',
    tableStatus: 'Allergènes et additifs',
    pending: 'Renseignements auprès de notre équipe',
    contains: 'Contient',
    noneDeclared: 'Aucun allergène à déclarer',
    legendAllergens: 'Les 14 allergènes majeurs',
    legendAdditives: 'Additifs et mentions à déclarer',
    additivesNote: 'Libellés légaux allemands selon LMZDV § 5 / FrSaftErfrischGetrV § 6.',
    food: 'Plats',
    drinks: 'Boissons',
    verifiedOn: 'au',
  },
};
