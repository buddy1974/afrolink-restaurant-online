/**
 * LEGAL OPERATOR DATA — Impressum (§ 5 DDG) and privacy controller (Art. 13 DSGVO).
 *
 * NOTHING here may be guessed. Three states per item:
 *   null   = not yet supplied by the owner → pages show "Angabe ausstehend" + incompleteness notice
 *   false  = owner confirmed "does not apply" (e.g. no register entry) → item is not shown
 *   string = the owner's information, shown as given
 * Questions for the owner: docs/compliance/legal-release-gate-2026-10-10.md
 */
export type Supplied = string | false | null;

export const legal = {
  /** Full name of the natural person (sole trader) or the company name exactly as registered. */
  operatorName: null as string | null,
  /** Legal form, e.g. "Einzelunternehmen", "GbR", "UG (haftungsbeschränkt)", "GmbH". */
  legalForm: null as string | null,
  /** Authorised representative(s) — required for companies (e.g. Geschäftsführer/in). false for sole traders. */
  representative: null as Supplied,
  /**
   * The restaurant address is used as the operator's address for service (ladungsfähige Anschrift).
   * Set true only after the owner confirms it (otherwise supply the correct address below).
   */
  addressConfirmed: false,
  /** Alternative address for service if it is not the restaurant address. */
  operatorAddress: null as string | null,
  /** E-mail address — REQUIRED by § 5 Abs. 1 Nr. 2 DDG for fast electronic contact. */
  email: null as string | null,
  /** Commercial register entry (Registergericht + Nummer); false if not registered. */
  register: null as Supplied,
  /** USt-IdNr. or W-IdNr. (§ 5 Abs. 1 Nr. 6 DDG); false if none has been issued. */
  vatId: null as Supplied,
  /**
   * Supervisory authority for the activity requiring a permit (§ 5 Abs. 1 Nr. 3 DDG).
   * A restaurant serving alcohol in NRW needs a Gaststättenerlaubnis — name the authority that
   * issued it (as on the permit). false only if the owner confirms no permit is required.
   */
  supervisoryAuthority: null as Supplied,
  /**
   * Consumer dispute resolution (§ 36 VSBG) — applies to businesses with more than 10 employees
   * (as of 31 Dec of the previous year) that have a website:
   *   'not-applicable' = 10 or fewer employees (nothing shown)
   *   'not-willing'    = statement that the business does not take part in such proceedings
   */
  consumerDispute: null as 'not-applicable' | 'not-willing' | null,
  /**
   * Person responsible for journalistic-editorial content (§ 18 Abs. 2 MStV). A restaurant menu
   * site is not a journalistic-editorial offering, so this is optional and hidden unless supplied.
   */
  contentResponsible: false as Supplied,
  /** Processor agreements (Art. 28 DSGVO) confirmed by the owner/account holder. */
  processors: {
    /** Vercel Inc. — hosting (Data Processing Addendum accepted in the Vercel account). */
    vercel: false,
    /** Neon (Databricks) — rating database; only relevant once ratings are enabled. */
    neon: false,
  },
} as const;

/** Everything the Impressum and the privacy policy need from the owner has been supplied. */
export const legalComplete = (): boolean =>
  !!legal.operatorName &&
  !!legal.legalForm &&
  !!legal.email &&
  (legal.addressConfirmed || !!legal.operatorAddress) &&
  legal.representative !== null &&
  legal.register !== null &&
  legal.vatId !== null &&
  legal.supervisoryAuthority !== null &&
  legal.consumerDispute !== null &&
  legal.processors.vercel;
