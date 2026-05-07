# Deployment Guide

Production target: **Vercel**. Next.js 14 з статичною генерацією — деплой пройде за 1–2 хвилини, нема серверного коду який треба тримати запущеним.

---

## 1. Підготовка репозиторію

### Verify build runs locally

```bash
npm install
npm run build
```

Має побачити `✓ Compiled successfully` і ~43 prerendered сторінки. Якщо є помилки — фіксимо локально перед пушем.

### Push to GitHub

Якщо репозиторій ще не на GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create designers-arcana --public --source=. --push
```

(або вручну через github.com → New repo)

---

## 2. Vercel project setup

### Через Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

CLI запитає:
1. Project name → `designers-arcana`
2. Framework preset → **Next.js** (auto-detected)
3. Root directory → `.`
4. Override settings → **No**

### Або через Web UI

1. Відкрий <https://vercel.com/new>
2. Import репо `designers-arcana` з GitHub
3. Framework preset: **Next.js** (auto)
4. Build command: `next build` (default)
5. Output directory: `.next` (default)
6. Install command: `npm install` (default)
7. **Deploy**

---

## 3. Environment variables

У Vercel Dashboard → Project → Settings → Environment Variables додай:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Production |

`NEXT_PUBLIC_SITE_URL` потрібен для `metadataBase` (щоб OG-картинка мала абсолютний URL у соцмережах). Для preview-деплоїв можна не задавати — Next використає fallback.

**Firebase змінні** — залиш порожніми поки auth не повернений (PRD §7 на паузі). Якщо вирішиш активувати — заповни всі 6 значень із Firebase Console → Project Settings.

Після додавання env — натисни **Redeploy** на останньому деплої.

---

## 4. Custom domain

### Через Vercel

1. Settings → Domains → Add
2. Введи домен (e.g. `designers-arcana.app`)
3. Vercel покаже DNS-записи які треба додати у реєстратора:
   - `A` запис → `76.76.21.21`
   - або `CNAME` → `cname.vercel-dns.com`
4. У реєстратора (Namecheap, GoDaddy, Cloudflare) додай ці записи
5. Чекай ~10 хвилин на DNS пропагацію
6. Vercel автоматично згенерує безкоштовний Let's Encrypt SSL

### Cloudflare нюанси

Якщо домен на Cloudflare — **вимкни proxy (orange cloud)** для записів які вказують на Vercel. Інакше буде SSL-конфлікт. Залиш cloud сірим (DNS only).

---

## 5. Verification

Після деплою перевір:

- [ ] **Landing**: `https://your-domain.com/` — фон, заголовок з zoomIn, кнопка
- [ ] **Deck**: тасування + 5 карт, спред адаптується (mobile / iPad / desktop)
- [ ] **Card detail**: `/card/card-01` — переворот, текст, кнопка "Витягнути ще"
- [ ] **History**: `/history` — empty state ілюстрація + при потраплянні карт показується список
- [ ] **404**: `/asdf` — золотий екран "Загубилась карта"
- [ ] **Favicon**: золота іскра у вкладці браузера
- [ ] **OG image**: вставити URL в [opengraph.xyz](https://www.opengraph.xyz/) → має показати картку з заголовком на чорному фоні
- [ ] **Lighthouse**: DevTools → Lighthouse → Mobile + Desktop. Цілимось ≥ 90 в усіх 4 категоріях.
- [ ] **Mobile responsive**: відкрий з телефона → переконайся що Header показує `ГОЛОВНА`/`ІСТОРІЯ`, картка в деталях не overflow-ить

---

## 6. Continuous deployment

Vercel автоматично робить:
- **Preview deploy** на кожен push у не-main гілку
- **Production deploy** на push у `main`
- **Comment у PR** із preview URL

Для додаткової безпеки додай GitHub branch protection на `main`:

```
Settings → Branches → Add rule
- Require pull request before merging
- Require status checks (Vercel — Production)
```

---

## 7. Optional: monitoring

- **Vercel Analytics** — Settings → Analytics → Enable. Безкоштовно для Hobby плану. Real-user metrics: page views, Web Vitals.
- **Sentry** — `npm i @sentry/nextjs` + `npx @sentry/wizard@latest -i nextjs` для error tracking. У `app/error.tsx` та `app/history/error.tsx` уже є точки інтеграції — додай `Sentry.captureException(error)` всередині `useEffect`.

---

## Rollback

Якщо щось зламалось після деплою:

```bash
vercel rollback         # відкочується до попереднього успішного деплою
```

Або через Web UI: Deployments → попередній → ⋯ → Promote to Production.
