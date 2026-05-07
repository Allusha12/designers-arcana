# The Designer's Arcana

Інтерактивний веб-сервіс з метафоричними картами для дизайнерів. Базується на механіці Таро — кожна карта є не передбаченням, а дзеркалом ситуації та практичною порадою.

→ Повний PRD: [`../PRD.md`](../PRD.md)  
→ Контент карт: [`../контент-для-карт.md`](../контент-для-карт.md)  
→ Дизайн: [Figma — Tarot for designers](https://www.figma.com/design/g3ODAT58SWvCwazbztOzWP/Tarot-for-designers?node-id=257-12816)

---

## Мета проекту

- Допомогти дизайнерам виходити з творчих і комунікаційних глухих кутів
- Забезпечити персоналізований досвід через Google Auth + особисту Історію
- Алгоритм без повторень: одна й та сама карта не з'являється до тих пір, поки не пройдена вся колода з 32 карт

---

## Екрани

| Маршрут | Екран | Figma node |
|---------|-------|------------|
| `/` | Landing — hero + CTA | `257:12816` |
| `/deck` | Колода (idle → shuffle → spread) | `257:12896` → `257:13132` |
| `/card/[slug]` | Деталь карти (flip + тлумачення) | `257:12716` |
| `/history` | Історія сесій | `257:13380` / `257:13621` |
| `/login` | Google OAuth | — |

---

## Файлова структура

```
designers-arcana/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — fonts, metadata, providers
│   ├── globals.css               # Design tokens (CSS vars) + Tailwind directives
│   ├── page.tsx                  # / — Landing
│   ├── not-found.tsx             # 404
│   ├── deck/
│   │   └── page.tsx              # /deck — Колода + shuffle + spread
│   ├── card/
│   │   └── [slug]/
│   │       └── page.tsx          # /card/[slug] — Деталь карти
│   ├── history/
│   │   └── page.tsx              # /history — Історія сесій
│   └── (auth)/
│       └── login/
│           └── page.tsx          # /login — Google OAuth
│
├── components/
│   ├── layout/
│   │   └── Header.tsx            # Логотип + навігація (НАЗАД / ІСТОРІЯ)
│   ├── background/
│   │   ├── SceneBackground.tsx   # atmosphere-glow + constellations + astro-елементи
│   │   └── StarField.tsx         # 70 зірок з анімацією мерехтіння
│   ├── cards/
│   │   ├── CardBack.tsx          # Рубашка карти
│   │   ├── CardFront.tsx         # Лицева сторона з ілюстрацією
│   │   ├── CardFlip.tsx          # 3D flip-анімація (preserve-3d)
│   │   ├── CardSpread.tsx        # Розклад 5 карт для вибору
│   │   └── CardDetail.tsx        # Повна деталь: зображення + тлумачення + порада
│   ├── history/
│   │   ├── HistoryList.tsx       # Список або empty state
│   │   └── HistoryItem.tsx       # Рядок запису + видалення
│   └── ui/
│       ├── Button.tsx            # Базова кнопка (primary / ghost)
│       └── Logo.tsx              # Wordmark + орнаменти
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts             # Firebase app singleton
│   │   ├── auth.ts               # Google OAuth helpers
│   │   └── firestore.ts          # CRUD для history (users/{uid}/history)
│   └── deck/
│       └── algorithm.ts          # No-repeat алгоритм (sessionStorage)
│
├── hooks/
│   ├── useAuth.ts                # Firebase onAuthStateChanged
│   ├── useDeck.ts                # Фази колоди: idle → shuffling → spread
│   └── useHistory.ts             # Fetch / add / delete history entries
│
├── data/
│   └── cards.ts                  # Масив 32 карт (id, slug, name, meaning, advice, image)
│
├── types/
│   └── index.ts                  # Card, HistoryEntry, DeckState, Breakpoint
│
├── public/
│   └── cards/                    # PNG-ілюстрації карт (card-01.png … back.png)
│       ├── back.png              # ← скопіювати з "items of cards/Back of card.png"
│       ├── Akula.png
│       └── ...                   # решта 31 карти
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.js
├── .env.local.example            # Firebase env vars template
└── .gitignore
```

---

## Адаптація під різні екрани

### Підхід: Mobile-First

Стилі пишуться для мобільного за замовчуванням, з розширенням через `md:` → `lg:` → `xl:`.

### Брейкпоінти (tailwind.config.ts)

| Token | Px | Пристрій |
|-------|----|----------|
| `sm` | 375px | iPhone 14 / малий мобільний |
| `md` | 768px | iPad (портрет) |
| `lg` | 1024px | iPad (альбом) / малий десктоп |
| `xl` | 1280px | Десктоп |
| `2xl` | 1440px | Великий десктоп (дизайн-база) |

### Ключові адаптації по компонентах

**Картки (CardSpread):**
- Desktop: 5 карт у ряд з легкою ротацією (fan layout)
- Tablet: 3 карти видно + підглядають ще 2, горизонтальний скрол
- Mobile: `scroll-snap-type: x mandatory` — 1 карта по центру, сусідні підглядають

**Деталь карти (CardDetail):**
- Desktop: 2 колонки — зображення зліва, текст справа
- Tablet: 1 колонка — зображення зверху, текст нижче
- Mobile: картка на всю ширину, текст скролиться, CTA — sticky внизу

**Фон (SceneBackground):**
- Desktop: усі astro-декорації видимі
- Mobile: астро-елементи приховані (`hidden md:block`), лишаються тільки зірки та glow

**Header:**
- Desktop: логотип по центру, посилання з текстом (НАЗАД / ІСТОРІЯ) по боках
- Mobile: логотип зліва, тільки іконки без підписів справа

**Картка-рубашка (CardBack):**
- CSS var `--card-width` / `--card-height` задаються глобально per-breakpoint у `globals.css`

---

## Дані та зберігання

### Карти (статичні)
- **Джерело:** `data/cards.ts` — 32 об'єкти з полями: `id`, `slug`, `name`, `meaning`, `advice`, `image`
- **Зображення:** `public/cards/*.png` — скопіювати з папки `items of cards/`

### Алгоритм без повторень
- `lib/deck/algorithm.ts`
- Стан зберігається в `sessionStorage` під ключем `arcana_deck_state`
- При виснаженні колоди (всі 32 пройдені) — автоматичне перемішування нового циклу

### Firestore схема
```
users/
  {uid}/
    history/
      {entryId}/
        cardSlug: string
        drawnAt:  Timestamp
```

---

## Технологічний стек

| Шар | Технологія | Причина |
|-----|-----------|---------|
| Framework | Next.js 14 (App Router) | SSG для карт (`generateStaticParams`), файловий роутинг |
| Styling | Tailwind CSS | Mobile-first утилітарний підхід, кастомні токени |
| Animation | Framer Motion | Flip карт, shuffle, fade-in зірок |
| Auth | Firebase Authentication | Google OAuth, мінімальна інфраструктура |
| Database | Firebase Firestore | Real-time, без власного бекенду |
| Images | next/image | WebP/AVIF авто-оптимізація, responsive srcSet |
| Language | TypeScript (strict) | Типобезпека по всьому стеку |

---

## Запуск

```bash
# 1. Встановити залежності
npm install

# 2. Налаштувати Firebase
cp .env.local.example .env.local
# → вставити свої Firebase credentials

# 3. Скопіювати зображення карт
cp "../items of cards/"*.png public/cards/
# Перейменувати "Back of card.png" → "back.png"

# 4. Dev-сервер
npm run dev
```

---

## Принципи розробки

1. **Тільки з дизайну** — жоден колір, відступ або текст не додається без відповідника в Figma
2. **Mobile-first** — кожен компонент починається зі стилів для 375px
3. **Статика де можливо** — сторінки карт генеруються статично через `generateStaticParams`
4. **Без зайвих абстракцій** — компоненти прості, хуки роблять одну річ
5. **Типи на межах** — Firestore дані типізуються при вході в систему (firestore.ts)
6. **Сесійна ізоляція алгоритму** — `sessionStorage` не персистить між сесіями навмисно
