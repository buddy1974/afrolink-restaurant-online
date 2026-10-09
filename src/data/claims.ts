/**
 * MARKETING CLAIMS REGISTER — feeds the information ticker.
 *
 * status:
 *  - 'verified'        checked against evidence (evidence field)
 *  - 'owner-provided'  stated by the owner / owner material; not independently verified
 *  - 'customer-opinion' must be attributed to a real, linkable review (attribution field)
 *  - 'awaiting'        proposed but unconfirmed — NEVER shown
 *
 * Only `enabled: true` claims with status verified / owner-provided (or customer-opinion WITH
 * attribution) are rendered. Tests enforce this.
 */
import type { L10n } from '../i18n/config';

export type ClaimStatus = 'verified' | 'owner-provided' | 'customer-opinion' | 'awaiting';

export interface Claim {
  id: string;
  text: L10n;
  status: ClaimStatus;
  enabled: boolean;
  evidence: string;
  /** Required for customer-opinion: reviewer + link to the original review. */
  attribution?: { author: string; href: string };
}

export const claims: Claim[] = [
  {
    id: 'cuisine',
    text: {
      de: 'Authentische westafrikanische Küche in Essen',
      en: 'Authentic West African cuisine in Essen',
      fr: 'Cuisine ouest-africaine authentique à Essen',
    },
    status: 'verified',
    enabled: true,
    evidence: 'Google Business Profile category "West African restaurant"; menu content.',
  },
  {
    id: 'google-rating',
    text: {
      de: '4,6 ★ bei Google · 145 Bewertungen (Stand 08.10.2026)',
      en: '4.6 ★ on Google · 145 reviews (as of 8 Oct 2026)',
      fr: '4,6 ★ sur Google · 145 avis (au 08/10/2026)',
    },
    status: 'verified',
    enabled: true,
    evidence: 'Owner screenshot of Google Business Profile, 2026-10-08 (manual snapshot).',
  },
  {
    id: 'since-2022',
    text: { de: 'Seit Mai 2022 in Essen', en: 'In Essen since May 2022', fr: 'À Essen depuis mai 2022' },
    status: 'owner-provided',
    enabled: true,
    evidence: 'Afrolink opening flyer "NEW OPENING 07.05.2022"; brief 2026-10-08 ("opened in May 2022").',
  },
  {
    id: 'no-pork',
    text: { de: 'Kein Schweinefleisch', en: 'No pork served', fr: 'Sans porc' },
    status: 'owner-provided',
    enabled: true,
    evidence: 'Owner statement, brief 2026-10-08.',
  },
  {
    id: 'delivery',
    text: {
      de: 'Lieferung in Essen nach Absprache',
      en: 'Delivery in Essen by arrangement',
      fr: 'Livraison à Essen sur demande',
    },
    status: 'owner-provided',
    enabled: true,
    evidence: 'Owner instruction, brief 2026-10-08.',
  },
  {
    id: 'catering',
    text: {
      de: 'Catering für Feiern & Firmen',
      en: 'Catering for celebrations & companies',
      fr: 'Traiteur pour fêtes & entreprises',
    },
    status: 'owner-provided',
    enabled: true,
    evidence: 'Owner instruction, brief 2026-10-08.',
  },
  {
    id: 'reservations',
    text: { de: 'Tischreservierung möglich', en: 'Table reservations accepted', fr: 'Réservations acceptées' },
    status: 'owner-provided',
    enabled: true,
    evidence: 'Services list in brief 2026-10-07 ("Reservations accepted").',
  },
  {
    id: 'regulars-500',
    text: { de: 'Über 500 Stammgäste', en: 'More than 500 regular customers', fr: 'Plus de 500 habitués' },
    status: 'awaiting',
    enabled: false,
    evidence: 'Proposed in brief 2026-10-08; basis for counting regular customers not confirmed.',
  },
  {
    id: 'team-20-years',
    text: {
      de: 'Ein Team mit über 20 Jahren Gastronomie-Erfahrung',
      en: 'A team with more than 20 years of hospitality experience',
      fr: 'Une équipe forte de plus de 20 ans d’expérience en restauration',
    },
    status: 'awaiting',
    enabled: false,
    evidence:
      'Proposed in brief 2026-10-08; refers to the team, not the restaurant (open since May 2022). Needs owner confirmation of whose experience and since when.',
  },
  {
    id: 'number-one',
    text: {
      de: '„Das beste afrikanische Restaurant in Essen“ – Gästestimme',
      en: '“The best African restaurant in Essen” – a guest’s view',
      fr: '« Le meilleur restaurant africain d’Essen » – avis d’un client',
    },
    status: 'customer-opinion',
    enabled: false,
    evidence: 'No supporting review text supplied yet. Enable only with a real review link and reviewer name.',
  },
];

export function publishableClaims(): Claim[] {
  return claims.filter(
    (c) =>
      c.enabled &&
      (c.status === 'verified' || c.status === 'owner-provided' || (c.status === 'customer-opinion' && !!c.attribution)),
  );
}
