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
  },
};

export const privacyCopy: Record<Lang, { title: string; lede: string; sections: PrivacySection[] }> = {
  de: {
    title: 'Datenschutzerklärung',
    lede: 'Informationen nach Art. 13 DSGVO zur Nutzung dieser Website.',
    sections: [
      {
        h: '1. Verantwortlicher',
        p: ['Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum genannte Betreiber.'],
      },
      {
        h: '2. Hosting und Server-Logfiles',
        p: [
          'Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf der Website verarbeitet der Hoster technisch notwendige Daten, insbesondere IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene Seite, Browser- und Geräteinformationen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (sicherer und stabiler Betrieb der Website).',
          'Eine Übermittlung in die USA kann stattfinden. Angaben zu den Garantien (z. B. Auftragsverarbeitungsvertrag, Angemessenheitsbeschluss oder Standardvertragsklauseln) werden vom Betreiber geprüft und ergänzt.',
        ],
      },
      {
        h: '3. Keine Cookies, keine Analyse, keine Werbung',
        p: [
          'Diese Website setzt keine Cookies, verwendet keine Analyse- oder Werbedienste und lädt Schriftarten von unserem eigenen Server (keine Verbindung zu Google Fonts).',
        ],
      },
      {
        h: '4. Speicherung Ihrer Sprachwahl',
        p: [
          'Wenn Sie eine Sprache auswählen, speichern wir diese Wahl („afl-lang“) im lokalen Speicher Ihres Browsers, damit die Website Sie beim nächsten Besuch in Ihrer Sprache anzeigt. Diese Information verlässt Ihr Gerät nicht. Grundlage ist § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für den von Ihnen gewünschten Dienst). Sie können den Eintrag jederzeit in Ihren Browsereinstellungen löschen.',
        ],
      },
      {
        h: '5. Videos von YouTube und Facebook (erst nach Klick)',
        p: [
          'Videos werden zunächst nur als Vorschaubild von unserem Server angezeigt. Erst wenn Sie auf „Abspielen“ klicken, wird das Video von YouTube (Google Ireland Limited, über youtube-nocookie.com) bzw. Facebook (Meta Platforms Ireland Limited) geladen. Dabei werden Daten wie Ihre IP-Adresse an den jeweiligen Anbieter übertragen; die Anbieter können Cookies setzen und Daten auch in den USA verarbeiten. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TDDDG).',
        ],
      },
      {
        h: '6. Anfragen per WhatsApp, Telefon und Anfrage-Assistent',
        p: [
          'Der Anfrage-Assistent auf dieser Website speichert und übermittelt keine Daten. Er erstellt in Ihrem Browser einen Text. Erst wenn Sie „Per WhatsApp senden“ wählen, öffnet sich WhatsApp (WhatsApp Ireland Limited) mit diesem Text; für die weitere Verarbeitung gelten die Bedingungen von WhatsApp. Wie wir Anfragen, Reservierungen und Bestellungen intern bearbeiten und wie lange wir sie aufbewahren, ergänzt der Betreiber.',
        ],
      },
      {
        h: '7. Externe Links',
        p: [
          'Links zu Google Maps, Google-Bewertungen, Facebook, Instagram, TikTok und YouTube führen zu den Websites dieser Anbieter. Erst beim Anklicken werden Daten an den jeweiligen Anbieter übertragen.',
        ],
      },
      {
        h: '8. Ihre Rechte',
        p: [
          'Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.',
          'Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren, z. B. bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy policy',
    lede: 'Information under Art. 13 GDPR about the use of this website.',
    sections: [
      { h: '1. Controller', p: ['The controller responsible for data processing on this website is the operator named in the legal notice (Impressum).'] },
      {
        h: '2. Hosting and server log files',
        p: [
          'This website is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit the site, the host processes technically necessary data, in particular your IP address, date and time of access, the page requested and browser/device information. Legal basis: Art. 6(1)(f) GDPR (secure and stable operation of the website).',
          'Data may be transferred to the USA. Details of the safeguards (e.g. data processing agreement, adequacy decision or standard contractual clauses) are being checked and will be added by the operator.',
        ],
      },
      {
        h: '3. No cookies, no analytics, no advertising',
        p: ['This website sets no cookies, uses no analytics or advertising services, and serves its fonts from our own server (no connection to Google Fonts).'],
      },
      {
        h: '4. Storing your language choice',
        p: [
          'When you choose a language, we store that choice ("afl-lang") in your browser’s local storage so the site opens in your language next time. This information never leaves your device. Legal basis: § 25(2) no. 2 TDDDG (strictly necessary for the service you requested). You can delete it at any time in your browser settings.',
        ],
      },
      {
        h: '5. Videos from YouTube and Facebook (only after you click)',
        p: [
          'Videos are first shown only as a preview image from our server. Only when you click “Play” is the video loaded from YouTube (Google Ireland Limited, via youtube-nocookie.com) or Facebook (Meta Platforms Ireland Limited). Data such as your IP address is then transmitted to that provider, which may set cookies and also process data in the USA. Legal basis: your consent given by clicking (Art. 6(1)(a) GDPR; § 25(1) TDDDG).',
        ],
      },
      {
        h: '6. Enquiries by WhatsApp, phone and the enquiry assistant',
        p: [
          'The enquiry assistant on this website neither stores nor transmits data. It composes a text in your browser. Only when you choose “Send via WhatsApp” does WhatsApp (WhatsApp Ireland Limited) open with that text; WhatsApp’s terms apply from then on. How we handle enquiries, reservations and orders internally, and how long we keep them, will be added by the operator.',
        ],
      },
      {
        h: '7. External links',
        p: ['Links to Google Maps, Google reviews, Facebook, Instagram, TikTok and YouTube lead to those providers’ websites. Data is only transmitted to them when you click.'],
      },
      {
        h: '8. Your rights',
        p: [
          'You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object (Art. 21). You may withdraw consent at any time with effect for the future.',
          'You may lodge a complaint with a data protection supervisory authority, e.g. the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia.',
        ],
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    lede: 'Informations selon l’art. 13 du RGPD sur l’utilisation de ce site.',
    sections: [
      { h: '1. Responsable du traitement', p: ['Le responsable du traitement des données sur ce site est l’exploitant indiqué dans les mentions légales (Impressum).'] },
      {
        h: '2. Hébergement et fichiers journaux',
        p: [
          'Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Lors de votre visite, l’hébergeur traite des données techniquement nécessaires, notamment votre adresse IP, la date et l’heure d’accès, la page consultée et des informations sur le navigateur et l’appareil. Base juridique : art. 6, par. 1, point f) du RGPD (fonctionnement sûr et stable du site).',
          'Des données peuvent être transférées aux États-Unis. Les garanties applicables (contrat de sous-traitance, décision d’adéquation ou clauses contractuelles types) sont en cours de vérification et seront complétées par l’exploitant.',
        ],
      },
      {
        h: '3. Pas de cookies, pas d’analyse, pas de publicité',
        p: ['Ce site ne dépose aucun cookie, n’utilise aucun service d’analyse ou de publicité et charge ses polices depuis notre propre serveur (aucune connexion à Google Fonts).'],
      },
      {
        h: '4. Mémorisation de votre choix de langue',
        p: [
          'Lorsque vous choisissez une langue, nous enregistrons ce choix (« afl-lang ») dans le stockage local de votre navigateur afin que le site s’affiche dans votre langue lors de votre prochaine visite. Cette information ne quitte pas votre appareil. Base juridique : § 25, al. 2, n° 2 TDDDG (strictement nécessaire au service demandé). Vous pouvez la supprimer à tout moment dans les réglages de votre navigateur.',
        ],
      },
      {
        h: '5. Vidéos YouTube et Facebook (uniquement après un clic)',
        p: [
          'Les vidéos s’affichent d’abord sous forme d’image d’aperçu depuis notre serveur. Ce n’est que lorsque vous cliquez sur « Lire » que la vidéo est chargée depuis YouTube (Google Ireland Limited, via youtube-nocookie.com) ou Facebook (Meta Platforms Ireland Limited). Des données comme votre adresse IP sont alors transmises au fournisseur, qui peut déposer des cookies et traiter des données aux États-Unis. Base juridique : votre consentement par le clic (art. 6, par. 1, point a) du RGPD ; § 25, al. 1 TDDDG).',
        ],
      },
      {
        h: '6. Demandes par WhatsApp, téléphone et assistant de demande',
        p: [
          'L’assistant de demande de ce site n’enregistre ni ne transmet aucune donnée. Il compose un texte dans votre navigateur. Ce n’est que lorsque vous choisissez « Envoyer par WhatsApp » que WhatsApp (WhatsApp Ireland Limited) s’ouvre avec ce texte ; les conditions de WhatsApp s’appliquent ensuite. La manière dont nous traitons en interne les demandes, réservations et commandes, ainsi que leur durée de conservation, sera précisée par l’exploitant.',
        ],
      },
      {
        h: '7. Liens externes',
        p: ['Les liens vers Google Maps, les avis Google, Facebook, Instagram, TikTok et YouTube mènent aux sites de ces fournisseurs. Les données ne leur sont transmises qu’au moment du clic.'],
      },
      {
        h: '8. Vos droits',
        p: [
          'Vous disposez d’un droit d’accès (art. 15 RGPD), de rectification (art. 16), d’effacement (art. 17), de limitation du traitement (art. 18), de portabilité (art. 20) et d’opposition (art. 21). Vous pouvez retirer votre consentement à tout moment pour l’avenir.',
          'Vous pouvez introduire une réclamation auprès d’une autorité de contrôle, par exemple la commissaire à la protection des données et à la liberté d’information de Rhénanie-du-Nord-Westphalie.',
        ],
      },
    ],
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
    statusTitle: 'Aktueller Stand',
    statusText:
      'Für die unten aufgeführten Speisen und Getränke liegt auf dieser Website noch keine geprüfte, gerichtsbezogene Allergen- und Zusatzstoffkennzeichnung vor. Bitte sprechen Sie vor Ihrer Bestellung unser Personal an. Wir können derzeit nicht zusagen, dass ein Gericht frei von einem bestimmten Allergen ist.',
    askStaff: 'Bitte vor der Bestellung beim Personal erfragen',
    germanLink: '',
    tableDish: 'Speise / Getränk',
    tableStatus: 'Allergene & Zusatzstoffe',
    pending: 'In Prüfung – bitte Personal fragen',
    contains: 'Enthält',
    noneDeclared: 'Keine kennzeichnungspflichtigen Allergene',
    legendAllergens: 'Die 14 Hauptallergene',
    legendAdditives: 'Kennzeichnungspflichtige Zusatzstoffe und Angaben',
    additivesNote: 'Wortlaut gemäß LMZDV § 5 bzw. FrSaftErfrischGetrV § 6.',
    food: 'Speisen',
    drinks: 'Getränke',
    verifiedOn: 'geprüft am',
  },
  en: {
    title: 'Allergens & additives',
    lede: 'Information on the 14 major allergens (Regulation (EU) No 1169/2011, Annex II) and additives that must be declared.',
    statusTitle: 'Current status',
    statusText:
      'Verified, dish-by-dish allergen and additive information is not yet available on this website for the dishes and drinks listed below. Please speak to our staff before ordering. We cannot currently promise that any dish is free from a particular allergen.',
    askStaff: 'Please ask our staff before ordering',
    germanLink: 'The legally required information is provided in German:',
    tableDish: 'Dish / drink',
    tableStatus: 'Allergens & additives',
    pending: 'Being verified – please ask staff',
    contains: 'Contains',
    noneDeclared: 'No allergens requiring declaration',
    legendAllergens: 'The 14 major allergens',
    legendAdditives: 'Additives and statements that must be declared',
    additivesNote: 'German legal wording under LMZDV § 5 / FrSaftErfrischGetrV § 6.',
    food: 'Food',
    drinks: 'Drinks',
    verifiedOn: 'verified on',
  },
  fr: {
    title: 'Allergènes et additifs',
    lede: 'Informations sur les 14 allergènes majeurs (règlement (UE) n° 1169/2011, annexe II) et les additifs à déclarer.',
    statusTitle: 'Situation actuelle',
    statusText:
      'Aucune information vérifiée, plat par plat, sur les allergènes et additifs n’est encore disponible sur ce site pour les plats et boissons ci-dessous. Merci de vous adresser à notre personnel avant de commander. Nous ne pouvons pas garantir actuellement qu’un plat soit exempt d’un allergène donné.',
    askStaff: 'Merci de vous renseigner auprès du personnel avant de commander',
    germanLink: 'Les informations légalement requises sont fournies en allemand :',
    tableDish: 'Plat / boisson',
    tableStatus: 'Allergènes et additifs',
    pending: 'En cours de vérification – demandez au personnel',
    contains: 'Contient',
    noneDeclared: 'Aucun allergène à déclarer',
    legendAllergens: 'Les 14 allergènes majeurs',
    legendAdditives: 'Additifs et mentions à déclarer',
    additivesNote: 'Libellés légaux allemands selon LMZDV § 5 / FrSaftErfrischGetrV § 6.',
    food: 'Plats',
    drinks: 'Boissons',
    verifiedOn: 'vérifié le',
  },
};
