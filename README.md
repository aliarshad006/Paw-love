# Ruff Luck: Matches That Never Work
MAD Hacks 2026, Useless Software theme.

A pet dating app where every match comes with a Doom-o-meter, a compatibility report and an official breakup certificate.

- Username + password login (no email). Data saved on the device and synced via Firebase when online.
- Rule-based "science", no AI or paid APIs.
- Stack: React, Vite, Tailwind, Firebase (free plan). Tools used: AI Studio and Claude for coding help.

## Run
    npm install
    npm run dev

## Firebase setup (once)
1. Authentication > Sign-in method > enable **Anonymous**.
2. Firestore Database > Rules > paste `firestore.rules` > Publish.
