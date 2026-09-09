# Pixcel Studio — Netlify + Decap CMS

This version is **Netlify-only**. It uses Decap CMS with Netlify Identity + Git Gateway, so there is no Vercel configuration or Vercel OAuth function.

## Netlify deployment
- Build command: `npm run build`
- Publish directory: `dist`
- Node: use a current LTS Node version

## Enable Decap CMS
In the Netlify site dashboard:
1. Open **Identity** and enable Netlify Identity.
2. Under Identity settings, enable **Git Gateway**.
3. Invite your GitHub account as an Identity user, or enable the registration method you prefer.
4. Deploy the site.
5. Open `/admin/` on the Netlify site and sign in.

The CMS writes content changes to the `main` branch of:
`nanidasari/PIXCELSTUDIOSVERCEL`

If your Netlify site uses a different GitHub repository, change the `repo:` value in `public/admin/config.yml`.

## CMS media
Uploads are stored in:
- `public/uploads`

## Routes
- `/` — Home
- `/work` — Portfolio
- `/about` — About
- `/admin/` — Decap CMS

The Netlify redirects keep React routes refresh-safe while preserving the CMS admin page.

## Background design
The home page includes subtle floating graphic-design elements — grid circles, geometric forms, type markers, rings and gradient bars — layered over the existing ambient glow. They are pointer-safe, lightweight CSS shapes and respect reduced-motion preferences.
