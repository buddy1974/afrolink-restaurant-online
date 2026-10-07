/**
 * Price formatting. Food prices are whole euros on the printed menu ("€15");
 * drinks always show cents ("€3.50", "€2.00").
 */
export function formatPrice(cents: number, decimals: 'auto' | 'always' = 'auto'): string {
  const euros = cents / 100;
  const whole = Number.isInteger(euros);
  return `€${decimals === 'auto' && whole ? euros.toFixed(0) : euros.toFixed(2)}`;
}

/** Plain decimal for schema.org offers, e.g. "15.00". */
export function schemaPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
