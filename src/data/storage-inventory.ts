/**
 * STORAGE INVENTORY — every cookie / local-storage entry this website itself sets, and what
 * third parties may set after consent. Single source for the cookie policy page and the tests
 * (tests/consent.test.ts checks that every key used in the code is listed here).
 *
 * Categories:
 *   necessary — exempt from consent under § 25 Abs. 2 Nr. 2 TDDDG (strictly necessary for a
 *               service the user explicitly requested, or to remember the user's consent choice)
 *   media     — external videos (YouTube, Facebook); consent, Art. 6(1)(a) GDPR + § 25(1) TDDDG
 *   prefs     — remembering the chosen language across visits; consent
 *   ratings   — remembering one's own dish ratings on the device (only when ratings are enabled)
 */
import type { L10n } from '../i18n/config';

export type ConsentCategory = 'necessary' | 'media' | 'prefs' | 'ratings';

export interface StorageItem {
  name: string;
  type: 'cookie' | 'localStorage' | 'third-party';
  provider: string;
  category: ConsentCategory;
  /** Only present when the ratings feature is enabled in the build. */
  ratingsOnly?: boolean;
  duration: L10n;
  purpose: L10n;
  setWhen: L10n;
}

export const storageInventory: StorageItem[] = [
  {
    name: 'afl-consent',
    type: 'localStorage',
    provider: 'Afrolink (diese Website)',
    category: 'necessary',
    duration: { de: '12 Monate, danach erneute Abfrage', en: '12 months, then asked again', fr: '12 mois, puis nouvelle demande' },
    purpose: {
      de: 'Speichert Ihre Datenschutz-Einstellungen (welche optionalen Kategorien Sie erlaubt haben), damit wir sie beachten können. Enthält keine personenbezogenen Angaben.',
      en: 'Stores your privacy settings (which optional categories you allowed) so that we can respect them. Contains no personal details.',
      fr: 'Enregistre vos paramètres de confidentialité (catégories facultatives autorisées) afin que nous puissions les respecter. Ne contient aucune donnée personnelle.',
    },
    setWhen: {
      de: 'Erst wenn Sie eine Auswahl treffen (Einstellungen oder Video-Freigabe).',
      en: 'Only when you make a choice (settings or video permission).',
      fr: 'Uniquement lorsque vous faites un choix (paramètres ou autorisation vidéo).',
    },
  },
  {
    name: 'afl_admin',
    type: 'cookie',
    provider: 'Afrolink (diese Website)',
    category: 'necessary',
    ratingsOnly: true,
    duration: { de: 'Höchstens 8 Stunden', en: 'At most 8 hours', fr: '8 heures au maximum' },
    purpose: {
      de: 'Anmeldung von Mitarbeitenden im internen Verwaltungsbereich (Authentifizierung). Für Gäste ohne Bedeutung.',
      en: 'Staff login to the internal management area (authentication). Not used for guests.',
      fr: 'Connexion du personnel à l’espace de gestion interne (authentification). Sans objet pour les clients.',
    },
    setWhen: { de: 'Nach der Anmeldung im Verwaltungsbereich.', en: 'After logging in to the management area.', fr: 'Après connexion à l’espace de gestion.' },
  },
  {
    name: 'afl_lang',
    type: 'cookie',
    provider: 'Afrolink (diese Website)',
    category: 'prefs',
    duration: { de: '12 Monate', en: '12 months', fr: '12 mois' },
    purpose: {
      de: 'Merkt sich die zuletzt gewählte Sprache, damit die Startseite Sie beim nächsten Besuch direkt in dieser Sprache öffnet.',
      en: 'Remembers the language you last chose so the home page opens in that language on your next visit.',
      fr: 'Mémorise la dernière langue choisie afin que la page d’accueil s’ouvre dans cette langue lors de votre prochaine visite.',
    },
    setWhen: {
      de: 'Nur mit Ihrer Einwilligung „Sprache merken“, wenn Sie die Sprache wechseln.',
      en: 'Only with your consent “Remember language”, when you switch language.',
      fr: 'Uniquement avec votre consentement « Mémoriser la langue », lorsque vous changez de langue.',
    },
  },
  {
    name: 'afl_rv',
    type: 'cookie',
    provider: 'Afrolink (diese Website)',
    category: 'ratings',
    ratingsOnly: true,
    duration: { de: '12 Monate', en: '12 months', fr: '12 mois' },
    purpose: {
      de: 'Zufallskennung, damit Sie Ihre Bewertung eines Gerichts später ändern können und sie nicht doppelt gezählt wird.',
      en: 'Random identifier so you can change your rating of a dish later and it is not counted twice.',
      fr: 'Identifiant aléatoire permettant de modifier votre note plus tard sans qu’elle soit comptée deux fois.',
    },
    setWhen: {
      de: 'Nur wenn Sie beim Bewerten „Auf diesem Gerät merken“ wählen.',
      en: 'Only if you choose “Remember on this device” when rating.',
      fr: 'Uniquement si vous choisissez « Mémoriser sur cet appareil » en notant.',
    },
  },
  {
    name: 'afl-rated:<id>',
    type: 'localStorage',
    provider: 'Afrolink (diese Website)',
    category: 'ratings',
    ratingsOnly: true,
    duration: { de: 'Bis Sie die Einwilligung widerrufen oder den Speicher löschen', en: 'Until you withdraw consent or clear storage', fr: 'Jusqu’au retrait du consentement ou à l’effacement' },
    purpose: {
      de: 'Zeigt Ihnen Ihre eigene Sternzahl wieder an.',
      en: 'Shows your own star rating again.',
      fr: 'Réaffiche votre propre note.',
    },
    setWhen: {
      de: 'Nur wenn Sie beim Bewerten „Auf diesem Gerät merken“ wählen.',
      en: 'Only if you choose “Remember on this device” when rating.',
      fr: 'Uniquement si vous choisissez « Mémoriser sur cet appareil » en notant.',
    },
  },
  {
    name: 'YouTube (youtube-nocookie.com)',
    type: 'third-party',
    provider: 'Google Ireland Limited',
    category: 'media',
    duration: { de: 'Laut Google (Sitzung bis zu 2 Jahre)', en: 'As set by Google (session up to 2 years)', fr: 'Selon Google (session jusqu’à 2 ans)' },
    purpose: {
      de: 'Abspielen des Videos; YouTube speichert dabei Informationen im Browser (lokaler Speicher, ggf. Cookies) und erhält Ihre IP-Adresse.',
      en: 'Playing the video; YouTube stores information in the browser (local storage, possibly cookies) and receives your IP address.',
      fr: 'Lecture de la vidéo ; YouTube stocke des informations dans le navigateur (stockage local, éventuellement cookies) et reçoit votre adresse IP.',
    },
    setWhen: {
      de: 'Erst wenn Sie ein YouTube-Video laden (einmalig oder dauerhaft erlaubt).',
      en: 'Only when you load a YouTube video (once or always allowed).',
      fr: 'Uniquement lorsque vous chargez une vidéo YouTube (une fois ou toujours autorisé).',
    },
  },
  {
    name: 'Facebook (facebook.com)',
    type: 'third-party',
    provider: 'Meta Platforms Ireland Limited',
    category: 'media',
    duration: { de: 'Laut Meta (bis zu 2 Jahre)', en: 'As set by Meta (up to 2 years)', fr: 'Selon Meta (jusqu’à 2 ans)' },
    purpose: {
      de: 'Abspielen des Facebook-Videos; Meta kann Cookies setzen und erhält Ihre IP-Adresse.',
      en: 'Playing the Facebook video; Meta may set cookies and receives your IP address.',
      fr: 'Lecture de la vidéo Facebook ; Meta peut déposer des cookies et reçoit votre adresse IP.',
    },
    setWhen: {
      de: 'Erst wenn Sie ein Facebook-Video laden (einmalig oder dauerhaft erlaubt).',
      en: 'Only when you load a Facebook video (once or always allowed).',
      fr: 'Uniquement lorsque vous chargez une vidéo Facebook (une fois ou toujours autorisé).',
    },
  },
];

export const CONSENT_KEY = 'afl-consent';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;
