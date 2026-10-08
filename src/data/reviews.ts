/**
 * REVIEW EXCERPTS — genuine Afrolink customer reviews only.
 *
 * Status 2026-10-08: no Afrolink review texts have been supplied. The only review screenshot
 * supplied showed a cardiology practice and is excluded. The carousel renders only when this
 * list has entries.
 *
 * To add a review (copy from the Google Business Profile you manage):
 *   { author: 'First name + initial as shown on Google', rating: 5,
 *     date: '2026-09',                       // month of the review
 *     excerpt: 'Short verbatim excerpt …',   // original language, verbatim, may be shortened with …
 *     lang: 'de',                            // language of the excerpt
 *     href: 'https://…' }                    // link to the review or the profile
 * Keep a balanced selection; never edit wording beyond shortening with an ellipsis.
 */
import type { Lang } from '../i18n/config';

export interface ReviewExcerpt {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  excerpt: string;
  lang: Lang | 'other';
  href: string;
}

export const reviewExcerpts: ReviewExcerpt[] = [];
