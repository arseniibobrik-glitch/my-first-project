# My First Project — Монорепо стартер

Готовая структура для быстрого старта: **CLI + Web + API** в одном репозитории.  
Долларов 0 — деплой на GitHub Pages + Cloudflare Workers.

---

## 📦 Структура

```
my-first-project/
├── apps/
│   ├── cli/          # Bun CLI утилита → бинарник / npm
│   ├── web/          # React + Vite + Tailwind → GitHub Pages
│   └── api/          # Hono + SQLite (D1) → Cloudflare Workers
├── packages/
│   └── shared/       # Общие типы, Zod-схемы, утилиты
├── .github/workflows/# CI/CD (lint, test, build, deploy)
├── package.json      # Bun workspaces
└── tsconfig.base.json
```

---

## 🚀 Быстрый старт

```bash
# 1. Клонируй
git clone https://github.com/<ТВОЙ-НИК>/my-first-project.git
cd my-first-project

# 2. Установи зависимости (один раз)
bun install

# 3. Запусти всё локально
bun run dev
```

Откроется:
- **Web:** http://localhost:5173
- **API:** http://localhost:8787
- **CLI:** `bun run --filter=cli dev hello Мир`

---

## 🛠 Команды

| Команда | Что делает |
|---------|------------|
| `bun run dev` | Запускает web + api + cli в watch-режиме |
| `bun run build` | Собирает все 3 приложения |
| `bun run lint` | ESLint по всему монорепо |
| `bun run format` | Prettier --write |
| `bun run typecheck` | TypeScript без эмита |
| `bun test` | Запускает тесты (bun test) |

### Отдельно по приложениям

```bash
# Web
bun run --filter=web dev      # dev сервер
bun run --filter=web build    # сборка в apps/web/dist

# API
bun run --filter=api dev      # wrangler dev (порт 8787)
bun run --filter=api deploy   # wrangler deploy

# CLI
bun run --filter=cli dev      # watch режим
bun run --filter=cli build    # бинарник в apps/cli/dist
./apps/cli/dist/index.js hello World  # запуск
```

---

## 🌐 Деплой (бесплатно)

### Web → GitHub Pages
1. Settings → Pages → Source: **GitHub Actions**
2. Пуш в `main` → автоматический деплой через workflow
3. Сайт будет на `https://<ник>.github.io/my-first-project`

### API → Cloudflare Workers
1. Создай аккаунт на [dash.cloudflare.com](https://dash.cloudflare.com)
2. `wrangler login` (или добавь секреты в GitHub):
   - `CLOUDFLARE_API_TOKEN` (Account → API Tokens → Edit Cloudflare Workers)
   - `CLOUDFLARE_ACCOUNT_ID` (виден в URL дашборда)
3. Пуш в `main` → автодеплой на `https://my-api.<subdomain>.workers.dev`

### CLI → npm / GitHub Releases
```bash
bun run --filter=cli build
# apps/cli/dist/index.js — готовый бинарник
npm publish --access public  # после настройки package.json
```

---

## 🧱 Технологии

| Слой | Инструмент | Зачем |
|------|------------|-------|
| Пакетный менеджер | **Bun** | Быстрый, встроенный test/runner/bundler |
| Язык | **TypeScript 5.5** | Строгая типизация везде |
| Линтинг | **ESLint 9 + @typescript-eslint** | Качество кода |
| Форматирование | **Prettier 3** | Единый стиль |
| Git hooks | **Husky 9** | pre-commit: lint + format |
| CI/CD | **GitHub Actions** | Бесплатно для публичных репо |
| Web UI | **React 18 + Vite 5 + Tailwind 3** | Современный стек |
| API | **Hono 4** | Быстрый, лёгкий, работает на edge |
| Валидация | **Zod 3** | Runtime + compile-time типы |
| CLI | **Commander.js** | Стандарт для CLI на Node/Bun |

---

## 📝 Работа с общими типами

`packages/shared` экспортирует всё через `index.ts`:

```typescript
// В любом приложении:
import { UserSchema, createApiResponse, validateEnv } from "@my-project/shared";

// Типы автоматически доступны благодаря TypeScript project references
const user = UserSchema.parse(data);
```

Добавил новую схему в `shared` → `bun install` → типы обновятся везде.

---

## 🔧 Настройка под себя

1. **Имя пакета** — замени `@my-project` на свой npm scope в `package.json` всех пакетов
2. **Пути в tsconfig.base.json** — обнови `paths` если сменил имена
3. **Wrangler** — раскомментируй `[[d1_databases]]` в `apps/api/wrangler.toml` после `wrangler d1 create`
4. **Tailwind** — настрой тему в `apps/web/tailwind.config.js`
5. **GitHub Pages** — в `vite.config.ts` добавь `base: '/my-first-project/'` если репо не на root домене

---

## 📚 Полезные ссылки

- [Bun docs](https://bun.sh/docs)
- [Hono docs](https://hono.dev)
- [Vite docs](https://vitejs.dev)
- [Tailwind docs](https://tailwindcss.com)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🤝 Контрибьют

1. Форкни
2. Создай ветку: `git checkout -b feature/amazing-feature`
3. Коммить: `git commit -m 'feat: amazing feature'`
4. Пуш: `git push origin feature/amazing-feature`
5. Открой PR

---

**Сделано для быстрого старта в вайбкодинге.** Удачи! 🚀