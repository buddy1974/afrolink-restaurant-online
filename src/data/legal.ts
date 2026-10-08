/**
 * LEGAL OPERATOR DATA — Impressum (§ 5 DDG) and privacy controller (Art. 13 DSGVO).
 *
 * NOTHING here may be guessed. `null` = not yet supplied by the owner; the pages then show
 * "Angabe ausstehend" and a visible incompleteness notice. Fill in, then re-run tests.
 */
export const legal = {
  /** Name of the natural person or legal entity operating the restaurant (Inhaber/Firma). */
  operatorName: null as string | null,
  /** Legal form, e.g. "Einzelunternehmen", "GmbH" (+ register court/number if registered). */
  legalForm: null as string | null,
  /** Authorised representative(s) — required for companies (e.g. Geschäftsführer). */
  representative: null as string | null,
  /** Address for service — known: the restaurant address. Confirm it is the operator's address. */
  addressConfirmed: false,
  /** E-mail address — REQUIRED by § 5 Abs. 1 Nr. 2 DDG for fast electronic contact. */
  email: null as string | null,
  /** Commercial register entry if any (Registergericht + Nummer). */
  register: null as string | null,
  /** USt-IdNr. / W-IdNr. if one exists (§ 5 Abs. 1 Nr. 6 DDG). */
  vatId: null as string | null,
  /** Person responsible for editorial content (if applicable). */
  contentResponsible: null as string | null,
} as const;

export const legalComplete = (): boolean =>
  !!legal.operatorName && !!legal.legalForm && !!legal.email && legal.addressConfirmed;
