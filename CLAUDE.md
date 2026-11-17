# Earth Bound Roots — working rules

- What: website for Tavia Valdez's grief-gathering nonprofit. Kara Yeates helps (sound bath, reiki) and appears on "Meet your practitioners".
- Words and gatherings: `src/lib/content.js` only. The bios and practice descriptions are drafts written by Claude; Tavia must approve them.
- 3D standard: the Three.js scene is recorded into pictures (`npm run capture`, 320 desktop / 240 phone frames). Never ship live WebGL to visitors; the 3D code loads only in `?capture=1`. Re-record after any scene change.
- Look: forest green, candle amber, linen, clay. Fonts Young Serif + Hanken Grotesk. Calm, slow motion; respect reduced motion.
- RSVP form only composes a text/email; it stores nothing. Ask before adding any form service, analytics or sign-up (launch-legal-check).
- Before showing: build, check laptop and phone widths, `npx impeccable detect` on the running site.
- Photos (public/images) are 360px-wide phone screenshots; full-size originals would look sharper. Venmo link decoded from her QR code.
- Missing from Tavia: approval of the drafted bios.
