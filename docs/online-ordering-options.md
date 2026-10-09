# Online ordering & payment: options (investigation only, nothing launched)

_2026-10-09. No ordering, payment collection or delivery fees exist on the site. This is a staged path for when the operational workflow is defined and approved._

## Stage 0: today
Enquiry builder (WhatsApp / phone). The guest composes the message; the website stores nothing. Allergen information is on every dish.

## Stage 1: order request basket (low effort, no payment)
- "Add to request" on dish cards, quantities, special requests, pickup or delivery enquiry, preferred time.
- Sends a structured WhatsApp message (or e-mail) to the restaurant; staff confirm price, time and delivery terms.
- No new legal obligations beyond today's. Reuses the static site.

## Stage 2: binding orders with staff confirmation
- Server-side order record (the Neon database prepared for ratings), order number, staff view (like `/admin/ratings/`), status updates (accepted / ready / delivered), confirmation by e-mail or WhatsApp.
- Needs from the owner: ordering hours, pickup/delivery areas, **delivery fees and minimums**, preparation times, cancellation rules.
- Legal: complete Impressum, terms (AGB), price indication (PAngV), LMIV Art. 14 (allergen information **before** the order is placed; dish pages already provide the structure), privacy update.

## Stage 3: online payment
- Stripe Checkout (cards, Apple/Google Pay, SEPA, Klarna) or PayPal, using hosted payment pages so card data never touches the site.
- Webhook marks the order "paid"; refunds through the provider dashboard.
- Needs: a business account, accepted fees, a bookkeeping export.

Recommendation: start with Stage 1 once the owner confirms what information staff need in a request. Do not advertise online ordering before Stage 2 works operationally.
