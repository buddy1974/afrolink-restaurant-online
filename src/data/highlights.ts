/**
 * Restaurant highlights band (approved design). Each highlight is tied to a claim in
 * src/data/claims.ts and is only rendered while that claim is publishable.
 */
export type HighlightIcon = 'pot' | 'table' | 'delivery' | 'catering' | 'star' | 'leaf';

export interface Highlight {
  id: 'cuisine' | 'reserve' | 'delivery' | 'catering' | 'rating' | 'pork';
  claim: string;
  icon: HighlightIcon;
  href: string;
  /** Preselect this enquiry type when followed. */
  enquiry?: string;
}

export const highlights: Highlight[] = [
  { id: 'cuisine', claim: 'cuisine', icon: 'pot', href: '#menu' },
  { id: 'reserve', claim: 'reservations', icon: 'table', href: '#enquiry', enquiry: 'reservation' },
  { id: 'delivery', claim: 'delivery', icon: 'delivery', href: '#enquiry', enquiry: 'delivery' },
  { id: 'catering', claim: 'catering', icon: 'catering', href: '#enquiry', enquiry: 'catering' },
  { id: 'rating', claim: 'google-rating', icon: 'star', href: '#reviews' },
  { id: 'pork', claim: 'no-pork', icon: 'leaf', href: '#dietary' },
];
