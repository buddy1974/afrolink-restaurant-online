# Security Checklist — `afrolink-restaurant-online` (tier S0)

- [x] No secrets, environment variables or API keys in the repo
- [x] No forms, user input or backend
- [x] No cookies, analytics or third-party scripts; fonts self-hosted
- [x] Photo EXIF/GPS metadata stripped (`prepare-image` enforces this for new photos)
- [x] No photos of identifiable guests or staff
- [x] Security headers (nosniff, frame DENY, referrer policy, permissions policy) in `vercel.json`
- [x] External links use `rel="noopener"`
- [ ] Datenschutzerklärung published (R-001)
