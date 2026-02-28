# Build Notes

## "Attention: Next.js now collects anonymous telemetry..." — Ye ERROR nahi hai

Build ke dauran jo message aata hai:
```
Attention: Next.js now collects completely anonymous telemetry...
```
**Ye error nahi hai.** Next.js sirf bata raha hai ki wo anonymous usage data collect karta hai. Build iske baad bhi normally chalna chahiye.

### Telemetry band karna (optional)
- **Ek baar run karo:** `npx next telemetry disable`
- Ya **.env** / **.env.local** mein add karo: `NEXT_TELEMETRY_DISABLED=1`

---

## Agar build fail ho (actual error)

Agar **usse niche** koi red error dikhe (TypeScript, module not found, etc.) to:

1. **Poora error message** copy karke bhejo (last 20–30 lines).
2. Pehle ye try karo:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```
   (Windows pe `rm -rf` ki jagah `.next` aur `node_modules` manually delete karo, phir `npm install` + `npm run build`.)

---

## Build success ka matlab

Agar build **end tak** bina error chal jaye to aakhri lines aisi dikhengi:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```
Iske baad koi error nahi aana chahiye.
