# 🤖 AI News Dashboard

A modern, responsive dashboard for AI news built with Next.js 14+, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?style=flat&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)

## ✨ Features

- 📰 Clean news feed with card-based UI
- 🌙 Dark mode support (toggle + system preference)
- ⏳ Loading skeletons for better UX
- 🔥 Hot news highlighting
- 📱 Fully responsive design
- 🐳 Docker-ready for easy deployment
- ✅ Unit tested API routes
- 🚀 CI/CD with GitHub Actions + GHCR

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Production (Docker)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t ai-news-dashboard .
docker run -p 3000:3000 ai-news-dashboard
```

## 📁 Project Structure

```
ai-news-dashboard/
├── app/
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/
│       └── news/
│           └── route.ts   # News API endpoint
├── components/
│   ├── NewsCard.tsx       # News card component
│   ├── NewsCardSkeleton.tsx # Loading skeleton
│   └── ThemeToggle.tsx    # Dark mode toggle
├── types/
│   └── news.ts            # TypeScript interfaces
├── __tests__/
│   └── api/
│       └── news.test.ts   # API tests
├── .github/
│   └── workflows/
│       └── ci.yml         # CI/CD pipeline
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## 🔌 API

### GET /api/news

Returns a list of AI news items.

**Response:**
```json
[
  {
    "id": "1",
    "title": "OpenAI announces GPT-5",
    "url": "https://openai.com/blog/gpt-5",
    "source": "OpenAI Blog",
    "date": "2026-01-28",
    "isHot": true
  }
]
```

## 🐳 Docker

The app uses a multi-stage Docker build:
1. **deps** - Install dependencies
2. **builder** - Build the Next.js app
3. **runner** - Production-ready minimal image

Image is automatically pushed to GHCR on main branch pushes.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📜 License

MIT

---

Built with ❤️ by Klawd 🐾

---

## 🚀 Feature Roadmap (Night Build Session)

### Completed
- [x] Real data sources (HN, Reddit, RSS)
- [x] Dark mode

### In Progress
- [ ] Search & filter
- [ ] AI-powered summaries  
- [ ] Trending topics visualization
- [ ] PWA + notifications
- [ ] Analytics charts
- [ ] Personalization (bookmarks, history)
- [ ] Real-time updates
- [ ] Deploy to production
