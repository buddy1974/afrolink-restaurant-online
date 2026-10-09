/**
 * Privacy-policy section for dish ratings. Rendered on the privacy pages ONLY when the build has
 * ratings enabled (RATINGS_ENABLED=true), so the policy never describes an inactive function.
 * Draft for owner/legal review (docs/ratings.md → "Privacy").
 */
import type { Lang } from './config';
import type { PrivacySection } from './legal-content';

export const ratingsPrivacy: Record<Lang, PrivacySection> = {
  de: {
    h: 'Bewertung von Gerichten',
    p: [
      'Sie können Gerichte anonym mit 1 bis 5 Sternen bewerten. Gespeichert werden das Gericht, die Sternzahl, Datum und Uhrzeit sowie ein pseudonymer Schlüssel. Namen, E-Mail-Adressen oder Konten werden nicht erhoben.',
      'Damit jede Person ein Gericht nur einmal bewertet (und die eigene Bewertung später ändern kann), setzt die Website beim Absenden einer Bewertung ein technisch notwendiges Cookie („afl_rv“, Laufzeit 12 Monate) mit einer Zufallskennung. In der Datenbank wird nur ein daraus berechneter, nicht umkehrbarer Schlüssel gespeichert. Das Cookie wird nur gesetzt, wenn Sie selbst eine Bewertung abgeben (§ 25 Abs. 2 Nr. 2 TDDDG).',
      'Zum Schutz vor Missbrauch (z. B. automatisierte Massenbewertungen) wird Ihre IP-Adresse nicht gespeichert, sondern nur ein täglich wechselnder, nicht umkehrbarer Schlüssel daraus gebildet. Dieser wird nach spätestens 30 Tagen gelöscht; Daten zur Begrenzung der Anfragen nach 2 Tagen.',
      'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an zuverlässigen Bewertungen und an der Verbesserung unserer Speisekarte). Die Daten werden bei Neon Inc. (Datenbank, Region EU) über Vercel verarbeitet. Bewertungen bleiben für die Auswertung gespeichert, solange die Bewertungsfunktion besteht; sie lassen sich keiner Person zuordnen.',
    ],
  },
  en: {
    h: 'Rating dishes',
    p: [
      'You can rate dishes anonymously with 1 to 5 stars. We store the dish, the number of stars, date and time and a pseudonymous key. No names, e-mail addresses or accounts are collected.',
      'So that each person rates a dish only once (and can change their rating later), the website sets a strictly necessary cookie (“afl_rv”, 12 months) containing a random identifier when you submit a rating. Only an irreversible key derived from it is stored in the database. The cookie is only set when you submit a rating yourself.',
      'To prevent abuse (e.g. automated mass ratings), your IP address is not stored; only a daily-changing, irreversible key derived from it is kept, for at most 30 days; rate-limiting data is deleted after 2 days.',
      'Legal basis: Art. 6(1)(f) GDPR (legitimate interest in reliable ratings and improving our menu). Data is processed by Neon Inc. (database, EU region) via Vercel. Ratings are kept for evaluation for as long as the rating function exists; they cannot be linked to a person.',
    ],
  },
  fr: {
    h: 'Notation des plats',
    p: [
      'Vous pouvez noter les plats de façon anonyme de 1 à 5 étoiles. Nous enregistrons le plat, le nombre d’étoiles, la date et l’heure ainsi qu’une clé pseudonyme. Aucun nom, adresse e-mail ou compte n’est collecté.',
      'Pour que chaque personne ne note un plat qu’une seule fois (et puisse modifier sa note), le site dépose, lorsque vous envoyez une note, un cookie strictement nécessaire (« afl_rv », 12 mois) contenant un identifiant aléatoire. Seule une clé irréversible dérivée de celui-ci est enregistrée. Le cookie n’est déposé que si vous notez vous-même un plat.',
      'Pour prévenir les abus (p. ex. notes automatisées en masse), votre adresse IP n’est pas enregistrée ; seule une clé irréversible, renouvelée chaque jour, est conservée 30 jours au plus ; les données de limitation des requêtes sont supprimées après 2 jours.',
      'Base légale : art. 6, par. 1, point f) RGPD (intérêt légitime à des notes fiables et à l’amélioration de notre carte). Les données sont traitées par Neon Inc. (base de données, région UE) via Vercel. Les notes sont conservées pour l’évaluation tant que la fonction existe ; elles ne permettent pas d’identifier une personne.',
    ],
  },
};
