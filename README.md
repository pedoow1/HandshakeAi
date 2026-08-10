# Handshake Onboarding — Setup Guide

## 1. Before deploying — edit these values in `index.html`

- `#airtmHandle` (line with `AIRTM_EMAIL_HERE`): your Airtm email/username.
- The amount (line with `AMOUNT_HERE`): your subscription price.
- `#dmLink` (line with `CONTACT_LINK_HERE`): your WhatsApp or Instagram link, e.g.
  `https://wa.me/20xxxxxxxxxx`

## 2. Deploy to Vercel

1. Go to https://vercel.com and sign in (or create an account).
2. Click **Add New → Project**.
3. Upload this whole project folder (or connect it via a GitHub repo).
4. Vercel will auto-detect the static files + `/api` folder and deploy them correctly with zero config.

## 3. Environment Variables — important

Before deploying, go to **Project Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `CODE_SECRET` | Any long random string (e.g. 32 characters). This is what generates the codes — keep it private. |
| `ADMIN_KEY` | A password only you use to access `/admin.html` and verify codes. |

After adding them, trigger a **Redeploy** so they take effect.

## 4. How it works

- The client sends payment via Airtm, then enters their email on the site.
- The site generates a fixed 8-character code based on the email + your secret — the same email always produces the same code.
- The client screenshots the code and sends it to you privately along with proof of transfer.
- You open `yourdomain.vercel.app/admin.html`, enter your admin key and the client's email (from the Airtm notification), and the site shows you the same code — if it matches what the client sent, the transfer and email are confirmed.

## 5. Security note

The code isn't fully secret (anyone who knows the method and has your secret could compute one), but it's sufficient as a lightweight way to confirm the person messaging you is the same one who transferred from that email. If you want stronger protection (preventing code reuse, tracking who used what), you'd need an actual database — let me know if you'd like that added.
