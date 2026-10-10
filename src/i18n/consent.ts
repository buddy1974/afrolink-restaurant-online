/**
 * Copy for privacy settings, the video consent step and the cookie policy (DE / EN / FR).
 * German is the source; EN/FR must have the same keys (type-enforced + tests/consent.test.ts).
 * No dark patterns: "accept" and "reject" are equally prominent; nothing optional is preselected.
 */
import type { Lang } from './config';

const de = {
  settings: {
    open: 'Cookie-Einstellungen',
    title: 'Datenschutz-Einstellungen',
    intro:
      'Diese Website funktioniert ohne optionale Speicherungen. Sie entscheiden, ob wir zusätzlich externe Videos laden oder Ihre Sprache merken dürfen. Sie können Ihre Wahl jederzeit hier ändern.',
    necessaryTitle: 'Notwendig',
    necessaryText: 'Speichert nur Ihre Auswahl auf dieser Seite. Immer aktiv.',
    always: 'Immer aktiv',
    mediaTitle: 'Externe Videos',
    mediaText:
      'Videos von YouTube (Google) und Facebook (Meta) direkt laden. Dabei werden Daten wie Ihre IP-Adresse an diese Anbieter übertragen, auch in die USA, und die Anbieter können Cookies setzen.',
    prefsTitle: 'Sprache merken',
    prefsText: 'Ihre gewählte Sprache 12 Monate lang in einem Cookie speichern, damit die Startseite Sie direkt in dieser Sprache öffnet.',
    ratingsTitle: 'Bewertungen merken',
    ratingsText:
      'Ihre eigenen Gerichtebewertungen auf diesem Gerät merken (Cookie, 12 Monate), damit Sie sie ändern können und sie nicht doppelt gezählt werden.',
    acceptAll: 'Alle erlauben',
    rejectAll: 'Nur notwendige',
    save: 'Auswahl speichern',
    saved: 'Ihre Einstellungen wurden gespeichert.',
    policy: 'Cookie-Richtlinie',
    privacy: 'Datenschutzerklärung',
    close: 'Schließen',
  },
  video: {
    title: 'Externes Video',
    youtube:
      'Dieses Video wird von YouTube (Google Ireland Limited) bereitgestellt. Beim Laden werden Daten wie Ihre IP-Adresse an Google übertragen, auch in die USA, und es werden Informationen in Ihrem Browser gespeichert.',
    facebook:
      'Dieses Video wird von Facebook (Meta Platforms Ireland Limited) bereitgestellt. Beim Laden werden Daten wie Ihre IP-Adresse an Meta übertragen, auch in die USA, und Meta kann Cookies setzen.',
    loadOnce: 'Video laden',
    always: 'Externe Videos immer erlauben',
    cancel: 'Abbrechen',
    more: 'Mehr in der Datenschutzerklärung',
  },
  rating: {
    remember: 'Auf diesem Gerät merken (Cookie, 12 Monate) – damit Sie Ihre Bewertung später ändern können',
  },
  page: {
    title: 'Cookie-Richtlinie',
    lede: 'Welche Cookies und vergleichbaren Speicherungen diese Website nutzt – und wann wir Ihre Einwilligung brauchen.',
    summaryTitle: 'Kurz gesagt',
    summary: [
      'Beim normalen Besuch setzt diese Website keine Cookies, nutzt keinen lokalen Speicher und lädt nichts von Drittanbietern. Es gibt keine Analyse und keine Werbung.',
      'Optionale Funktionen – externe Videos und „Sprache merken“ – sind standardmäßig aus. Sie werden nur aktiv, wenn Sie sie selbst erlauben. Deshalb zeigen wir Ihnen auch kein Cookie-Banner beim Seitenaufruf.',
      'Die Sprachweiterleitung der Startseite nutzt nur die Spracheinstellung, die Ihr Browser bei jedem Aufruf ohnehin mitsendet; auf Ihrem Gerät wird dafür nichts gelesen oder gespeichert.',
    ],
    tableTitle: 'Übersicht',
    colName: 'Name',
    colType: 'Art',
    colProvider: 'Anbieter',
    colPurpose: 'Zweck',
    colDuration: 'Speicherdauer',
    colWhen: 'Wann gesetzt',
    colBasis: 'Rechtsgrundlage',
    catNecessary: 'Notwendig – keine Einwilligung erforderlich',
    catMedia: 'Externe Videos – nur mit Einwilligung',
    catPrefs: 'Sprache merken – nur mit Einwilligung',
    catRatings: 'Bewertungen merken – nur mit Einwilligung',
    basisNecessary: '§ 25 Abs. 2 Nr. 2 TDDDG',
    basisConsent: 'Einwilligung: § 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO',
    types: { cookie: 'Cookie', localStorage: 'Lokaler Speicher', 'third-party': 'Drittanbieter' },
    changeTitle: 'Einstellungen ändern oder widerrufen',
    changeText:
      'Sie können Ihre Einwilligungen jederzeit mit Wirkung für die Zukunft ändern oder widerrufen – über die Schaltfläche unten oder den Link „Cookie-Einstellungen“ am Ende jeder Seite. Beim Widerruf löschen wir die betroffenen Einträge sofort. Zusätzlich können Sie Cookies und lokale Speicherungen in Ihrem Browser löschen.',
    noneTitle: 'Was wir nicht verwenden',
    none: 'Keine Analyse- oder Statistikdienste, keine Werbe- oder Tracking-Cookies, keine Social-Media-Plugins vor Ihrem Klick, keine Schriftarten von Google-Servern.',
  },
};

export type ConsentDict = typeof de;
type Shape<T> = T extends string ? string : T extends readonly string[] ? string[] : { [K in keyof T]: Shape<T[K]> };

const en: Shape<ConsentDict> = {
  settings: {
    open: 'Cookie settings',
    title: 'Privacy settings',
    intro:
      'This website works without any optional storage. You decide whether we may also load external videos or remember your language. You can change your choice here at any time.',
    necessaryTitle: 'Necessary',
    necessaryText: 'Only stores your choice on this page. Always on.',
    always: 'Always on',
    mediaTitle: 'External videos',
    mediaText:
      'Load videos from YouTube (Google) and Facebook (Meta) directly. Data such as your IP address is then transmitted to these providers, including to the USA, and the providers may set cookies.',
    prefsTitle: 'Remember language',
    prefsText: 'Store your chosen language in a cookie for 12 months so the home page opens in that language.',
    ratingsTitle: 'Remember ratings',
    ratingsText:
      'Remember your own dish ratings on this device (cookie, 12 months) so you can change them and they are not counted twice.',
    acceptAll: 'Allow all',
    rejectAll: 'Necessary only',
    save: 'Save selection',
    saved: 'Your settings have been saved.',
    policy: 'Cookie policy',
    privacy: 'Privacy policy',
    close: 'Close',
  },
  video: {
    title: 'External video',
    youtube:
      'This video is provided by YouTube (Google Ireland Limited). Loading it transmits data such as your IP address to Google, including to the USA, and stores information in your browser.',
    facebook:
      'This video is provided by Facebook (Meta Platforms Ireland Limited). Loading it transmits data such as your IP address to Meta, including to the USA, and Meta may set cookies.',
    loadOnce: 'Load video',
    always: 'Always allow external videos',
    cancel: 'Cancel',
    more: 'More in the privacy policy',
  },
  rating: {
    remember: 'Remember on this device (cookie, 12 months) – so you can change your rating later',
  },
  page: {
    title: 'Cookie policy',
    lede: 'Which cookies and similar storage this website uses – and when we need your consent.',
    summaryTitle: 'In short',
    summary: [
      'During a normal visit this website sets no cookies, uses no local storage and loads nothing from third parties. There is no analytics and no advertising.',
      'Optional features – external videos and “Remember language” – are off by default. They only become active if you allow them yourself. That is why we do not show you a cookie banner when you arrive.',
      'The language redirect on the home page only uses the language setting your browser sends with every request anyway; nothing is read from or stored on your device for it.',
    ],
    tableTitle: 'Overview',
    colName: 'Name',
    colType: 'Type',
    colProvider: 'Provider',
    colPurpose: 'Purpose',
    colDuration: 'Duration',
    colWhen: 'When set',
    colBasis: 'Legal basis',
    catNecessary: 'Necessary – no consent required',
    catMedia: 'External videos – only with consent',
    catPrefs: 'Remember language – only with consent',
    catRatings: 'Remember ratings – only with consent',
    basisNecessary: '§ 25(2) no. 2 TDDDG',
    basisConsent: 'Consent: § 25(1) TDDDG, Art. 6(1)(a) GDPR',
    types: { cookie: 'Cookie', localStorage: 'Local storage', 'third-party': 'Third party' },
    changeTitle: 'Change or withdraw your settings',
    changeText:
      'You can change or withdraw your consent at any time with effect for the future – with the button below or the “Cookie settings” link at the bottom of every page. When you withdraw, we delete the affected entries immediately. You can also delete cookies and local storage in your browser.',
    noneTitle: 'What we do not use',
    none: 'No analytics or statistics services, no advertising or tracking cookies, no social media plugins before you click, no fonts from Google servers.',
  },
};

const fr: Shape<ConsentDict> = {
  settings: {
    open: 'Paramètres des cookies',
    title: 'Paramètres de confidentialité',
    intro:
      'Ce site fonctionne sans aucun stockage facultatif. Vous décidez si nous pouvons en plus charger des vidéos externes ou mémoriser votre langue. Vous pouvez modifier votre choix ici à tout moment.',
    necessaryTitle: 'Nécessaire',
    necessaryText: 'Enregistre uniquement votre choix sur cette page. Toujours actif.',
    always: 'Toujours actif',
    mediaTitle: 'Vidéos externes',
    mediaText:
      'Charger directement les vidéos de YouTube (Google) et Facebook (Meta). Des données comme votre adresse IP sont alors transmises à ces fournisseurs, y compris aux États-Unis, et ils peuvent déposer des cookies.',
    prefsTitle: 'Mémoriser la langue',
    prefsText: 'Enregistrer la langue choisie dans un cookie pendant 12 mois afin que la page d’accueil s’ouvre dans cette langue.',
    ratingsTitle: 'Mémoriser mes notes',
    ratingsText:
      'Mémoriser vos propres notes de plats sur cet appareil (cookie, 12 mois) afin de pouvoir les modifier et éviter qu’elles soient comptées deux fois.',
    acceptAll: 'Tout autoriser',
    rejectAll: 'Nécessaires uniquement',
    save: 'Enregistrer la sélection',
    saved: 'Vos paramètres ont été enregistrés.',
    policy: 'Politique relative aux cookies',
    privacy: 'Politique de confidentialité',
    close: 'Fermer',
  },
  video: {
    title: 'Vidéo externe',
    youtube:
      'Cette vidéo est fournie par YouTube (Google Ireland Limited). Son chargement transmet des données comme votre adresse IP à Google, y compris aux États-Unis, et enregistre des informations dans votre navigateur.',
    facebook:
      'Cette vidéo est fournie par Facebook (Meta Platforms Ireland Limited). Son chargement transmet des données comme votre adresse IP à Meta, y compris aux États-Unis, et Meta peut déposer des cookies.',
    loadOnce: 'Charger la vidéo',
    always: 'Toujours autoriser les vidéos externes',
    cancel: 'Annuler',
    more: 'En savoir plus dans la politique de confidentialité',
  },
  rating: {
    remember: 'Mémoriser sur cet appareil (cookie, 12 mois) – pour pouvoir modifier votre note plus tard',
  },
  page: {
    title: 'Politique relative aux cookies',
    lede: 'Quels cookies et stockages similaires ce site utilise – et quand nous avons besoin de votre consentement.',
    summaryTitle: 'En bref',
    summary: [
      'Lors d’une visite normale, ce site ne dépose aucun cookie, n’utilise pas le stockage local et ne charge rien depuis des tiers. Pas d’analyse, pas de publicité.',
      'Les fonctions facultatives – vidéos externes et « Mémoriser la langue » – sont désactivées par défaut. Elles ne s’activent que si vous les autorisez vous-même. C’est pourquoi nous ne vous montrons pas de bandeau cookies à l’arrivée.',
      'La redirection linguistique de la page d’accueil utilise uniquement la langue que votre navigateur transmet de toute façon à chaque requête ; rien n’est lu ni enregistré sur votre appareil pour cela.',
    ],
    tableTitle: 'Vue d’ensemble',
    colName: 'Nom',
    colType: 'Type',
    colProvider: 'Fournisseur',
    colPurpose: 'Finalité',
    colDuration: 'Durée',
    colWhen: 'Quand',
    colBasis: 'Base juridique',
    catNecessary: 'Nécessaire – aucun consentement requis',
    catMedia: 'Vidéos externes – uniquement avec consentement',
    catPrefs: 'Mémoriser la langue – uniquement avec consentement',
    catRatings: 'Mémoriser mes notes – uniquement avec consentement',
    basisNecessary: '§ 25, al. 2, n° 2 TDDDG',
    basisConsent: 'Consentement : § 25, al. 1 TDDDG, art. 6, par. 1, point a) RGPD',
    types: { cookie: 'Cookie', localStorage: 'Stockage local', 'third-party': 'Tiers' },
    changeTitle: 'Modifier ou retirer vos paramètres',
    changeText:
      'Vous pouvez modifier ou retirer votre consentement à tout moment pour l’avenir – avec le bouton ci-dessous ou le lien « Paramètres des cookies » en bas de chaque page. En cas de retrait, nous supprimons immédiatement les entrées concernées. Vous pouvez aussi effacer les cookies et le stockage local dans votre navigateur.',
    noneTitle: 'Ce que nous n’utilisons pas',
    none: 'Aucun service d’analyse ou de statistiques, aucun cookie publicitaire ou de suivi, aucun plugin de réseaux sociaux avant votre clic, aucune police chargée depuis les serveurs de Google.',
  },
};

export const consentUi = { de, en, fr } as const;

export function useConsentUi(lang: Lang) {
  return consentUi[lang] as ConsentDict;
}
