# Protected PDF deployment

The 13 paid PDFs are encrypted in pdf-products.enc. The decryption key is stored only
in the existing Vercel project's protected PDF_ASSET_KEY setting (Preview and Production).
Git deployments remain reproducible: the build authenticates and decrypts the bundle,
verifies each file's SHA-256 and bundles the files as private Nitro server assets.
An incomplete or unauthenticated bundle fails the build instead of breaking downloads.
Never place the plaintext PDFs in public/ or commit private-products/ to this public repository.

The owner retains the originals and a Windows-encrypted local recovery copy of the key.
Other hosting accounts require the protected key through their own secure settings.
The encrypted bundle alone cannot restore paid files without that key.

Downloads independently verify the actual Stripe product line item, captured payment,
refund/dispute status and 30-day purchase window. Encrypted capability links contain no
customer information. PDF_DOWNLOAD_SECRET is an optional independent download-link key;
otherwise a purpose-separated derivation of the existing protected Stripe key is used.
Rotating that key invalidates old capabilities; the confirmation URL can reissue a link
within the purchase window after checking the payment again.

Automatic download email is not configured. Customers should save their confirmation page
and a local copy. Stripe event delivery is verified independently. No completed customer
or sandbox payment was submitted to test these files.
