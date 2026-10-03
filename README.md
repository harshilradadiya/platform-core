# MediaFlow Platform Core (Production-Grade Media Resolution & Monetization SaaS)

A production-ready, high-concurrency Media Utility Platform designed to resolve and stream media from **YouTube** and **Pinterest** (expandable to TikTok/Instagram) with **Zero Server Disk Buffering**, resilient scraping, Redis metadata caching, and a programmatic SEO frontend built in **Next.js 14 App Router**.

---

## Key Architectural Principles

1. **Zero-Server-Buffering (Pass-Through Streaming)**:
   - Media files are never downloaded to application server disks.
   - Direct CDN links are returned to clients whenever available (Pinterest images/videos, direct MP4 streams).
   - Upstream formats requiring proxying/CORS/Range handling are streamed in 64KB memory chunks directly via FastAPI `StreamingResponse`.

2. **Resilient Extraction Engine**:
   - `BaseExtractor` abstract interface with asynchronous `validate(url)` and `extract(url)`.
   - `YouTubeExtractor`: uses `yt-dlp` in non-blocking worker threads (`asyncio.to_thread`) for event loop responsiveness.
   - `PinterestExtractor`: uses `httpx.AsyncClient` with `BeautifulSoup4` to parse `__PWS_DATA__` and OpenGraph tags, supporting both video pins (.mp4) and original images (.jpg), with automatic `pin.it` redirect resolution.
   - `ExtractorFactory`: regex-based routing with runtime registration support for TikTok/Instagram.
   - Rotating modern browser User-Agents and proxy pool injection hooks.

3. **High-Performance Caching & Security**:
   - 3-hour TTL Redis caching (`10800s`) keyed by canonical URL SHA-256 hash (`cache:resolve:{hash}`).
   - Automatic in-memory cache fallback for development resilience.
   - SlowAPI IP rate limiting (30 requests/minute).

4. **Monetization & Programmatic SEO Frontend (Next.js 14)**:
   - Dynamic SSR routes (`/[platform]/page.tsx`) with auto-generated metadata for high-intent search keywords.
   - Google Rich Results JSON-LD schema (`SoftwareApplication` and `FAQPage`).
   - Strict CLS-safe `AdContainer` reserving exact aspect ratios (728x90 Leaderboard, 300x250 Medium Rectangle, 320x50 Mobile Banner).
   - High-converting `AffiliateBanner` cards for privacy VPNs and video tools.
   - Interactive `UrlForm` with clipboard auto-detection and real-time source badge.
   - Mandatory compliance pages (`/legal/terms` for DMCA/Fair Use, `/legal/privacy` for AdSense/GDPR).

---

## Directory Structure

```
platform-core/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py                 # Redis connection, rate limiting dependencies
│   │   │   └── v1/
│   │   │       ├── router.py           # API route aggregator
│   │   │       ├── endpoints/
│   │   │       │   ├── resolve.py      # POST /api/v1/resolve (URL -> formats)
│   │   │       │   ├── stream.py       # GET /api/v1/stream (Proxy chunking)
│   │   │       │   └── health.py       # GET /health & readiness probes
│   │   │       └── schemas/
│   │   │           ├── request.py      # URL validation schemas
│   │   │           └── media.py        # Strict Pydantic response contracts
│   │   ├── core/
│   │   │   ├── config.py               # Pydantic BaseSettings (env vars, secrets)
│   │   │   └── security.py             # Rate limiters (slowapi) & origin guards
│   │   ├── extractors/
│   │   │   ├── base.py                 # Abstract BaseExtractor class
│   │   │   ├── factory.py              # Extractor selector (URL pattern matcher)
│   │   │   ├── youtube.py              # yt-dlp low-overhead metadata engine
│   │   │   └── pinterest.py            # High-res image/video scraper
│   │   ├── services/
│   │   │   ├── cache.py                # Redis caching wrapper with fallback
│   │   │   └── proxy_manager.py        # Rotating proxy pool interface
│   │   └── main.py                     # FastAPI application factory & lifespan
│   ├── tests/
│   │   ├── test_api.py                 # API endpoints & cache integration tests
│   │   └── test_extractors.py          # Extractor validation & parsing tests
│   ├── Dockerfile                      # Multi-stage Python 3.12 slim container
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              # Root layout with ad slots & global providers
│   │   │   ├── page.tsx                # Universal multi-downloader hero page
│   │   │   ├── [platform]/
│   │   │   │   └── page.tsx            # Programmatic SEO pages (e.g. /youtube, /pinterest)
│   │   │   ├── api/
│   │   │   │   └── revalidate/route.ts # On-demand ISR revalidation
│   │   │   └── legal/
│   │   │       ├── terms/page.tsx      # DMCA & fair use disclaimer
│   │   │       └── privacy/page.tsx    # Privacy policy (mandatory for ad approvals)
│   │   ├── components/
│   │   │   ├── downloader/
│   │   │   │   ├── UrlForm.tsx         # Paste input, clear button, loader state
│   │   │   │   ├── FormatCard.tsx      # Format selector (720p, 1080p, MP3)
│   │   │   │   ├── MediaDisplay.tsx    # Title, thumbnail, duration preview
│   │   │   │   └── PlatformDownloaderClient.tsx # Client state for dynamic routes
│   │   │   ├── monetization/
│   │   │   │   ├── AdContainer.tsx     # CLS-safe responsive ad container
│   │   │   │   └── AffiliateBanner.tsx # Native VPN/Software recommendation card
│   │   │   └── seo/
│   │   │       ├── FaqAccordion.tsx    # Interactive FAQ + JSON-LD Schema injector
│   │   │       └── SeoContentBlock.tsx # Keyword-rich editorial content
│   │   ├── lib/
│   │   │   ├── api-client.ts           # Type-safe client for backend
│   │   │   └── constants.ts            # Supported platforms, SEO configs
│   │   └── types/
│   │       └── api.ts                  # TypeScript mirrors of backend schemas
│   ├── Dockerfile                      # Multi-stage Next.js standalone container
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
│
└── docker-compose.yml                  # Unified Redis + Backend + Frontend orchestration
```

---

## Quickstart

### 1. Run via Docker Compose (Recommended for Production)
```bash
cd platform-core
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend Swagger Docs: http://localhost:8000/api/v1/docs
- Health Probe: http://localhost:8000/health

### 2. Run Backend Locally
```bash
cd platform-core/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

To run the backend unit tests:
```bash
python -m pytest -v
```

### 3. Run Frontend Locally
```bash
cd platform-core/frontend
npm install
npm run dev
```

---

## API Endpoints

### `POST /api/v1/resolve`
Resolves media URL to all available download formats.
- Request Body:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```
- Response (cached in Redis for 3 hours):
```json
{
  "platform": "youtube",
  "source_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "media_id": "dQw4w9WgXcQ",
  "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "duration_seconds": 213,
  "formats": [
    {
      "id": "yt-1080p-progressive",
      "ext": "mp4",
      "quality_label": "1080p HD (MP4)",
      "filesize_bytes": 48234496,
      "direct_url": "https://...",
      "is_audio_only": false,
      "requires_server_stream": true
    },
    {
      "id": "yt-audio-high",
      "ext": "mp3",
      "quality_label": "Audio High Quality (~160kbps MP3)",
      "filesize_bytes": 3565158,
      "direct_url": "https://...",
      "is_audio_only": true,
      "requires_server_stream": true
    }
  ],
  "cached": false
}
```

### `GET /api/v1/stream`
Pass-through zero-buffering memory chunk streamer:
```
GET /api/v1/stream?url={ENCODED_STREAM_URL}&filename=my_video.mp4
```
Supports HTTP `Range` headers for seeking and download resumption.

### `GET /health`
Liveness and readiness probe checking system uptime and Redis connectivity.
