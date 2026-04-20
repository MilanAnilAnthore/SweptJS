<p align="center">
  <img src="public/resources/logo.png" alt="SweptJS Logo" width="160" />
</p>

<h1 align="center">SweptJS</h1>

<p align="center">
  <strong>A Chrome extension that detects JavaScript memory leaks and DOM node accumulation in real time.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-MV3-4285F4?logo=googlechrome&logoColor=white" alt="Chrome MV3" />
  <img src="https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white" alt="Svelte 5" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

SweptJS sits quietly in Chrome's side panel, collects heap memory and DOM lifecycle data every 2 seconds, and tells you whether the page you're browsing is leaking memory — **without opening DevTools**.

It detects two types of leaks:
- **Heap leaks** — JS objects piling up because something still references them (closures, caches, forgotten intervals)
- **DOM leaks** — HTML elements removed from the page but still held in memory by JavaScript references

## How It Works

SweptJS uses two complementary heuristics that run independently:

### Heuristic 1 — Heap Growth (≥ 20%)

Compares the **average `usedJSHeapSize`** of the oldest 5 samples vs the newest 5 samples. Averaging smooths out garbage collection spikes.

```
growth = (newestAvg - oldestAvg) / oldestAvg
if growth >= 0.20 → Heap leak suspected
```

### Heuristic 2 — Detached DOM Node Accumulation

Uses [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect removed DOM nodes and [`FinalizationRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/FinalizationRegistry) to track whether the garbage collector actually cleans them up.

If `alive` (detached but not collected) keeps growing beyond a threshold — that's a DOM leak.

### Combined Verdict

| Heap ≥ 20% | DOM Growing | Verdict |
|:---:|:---:|---|
| ❌ | ❌ | 🟢 **System stable** — no leak detected |
| ✅ | ❌ | 🟡 **Probable heap leak** — closure/cache leak? |
| ❌ | ✅ | 🟡 **Probable DOM leak** — detached nodes accumulating |
| ✅ | ✅ | 🔴 **High confidence leak** — both signals firing |

## Architecture

SweptJS operates across three Chrome Extension execution contexts:

```
┌─────────────────────────────────────────────────────┐
│  WEB PAGE (Content Script)                          │
│                                                     │
│  heapmonitor.ts       lifecycletracker.ts           │
│  ┌──────────────┐     ┌────────────────────┐        │
│  │ Poll heap    │     │ MutationObserver   │        │
│  │ memory / 2s  │     │ + FinalizationReg  │        │
│  └──────┬───────┘     └────────┬───────────┘        │
│         └──────┬───────────────┘                    │
│                ▼                                    │
│          content.ts → sendMessage(MEMORY_UPDATE)    │
└────────────────┼────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│  BACKGROUND (Service Worker)                       │
│                                                    │
│  background.ts         leakdetector.ts             │
│  ┌─────────────────┐   ┌──────────────────────┐   │
│  │ Store samples   │   │ analyzeHeapTrend()   │   │
│  │ (max 50, ~100s) │──▶│ analyzeDOMTrend()    │   │
│  │ Run analysis    │   │ detectLeak()         │   │
│  └─────────────────┘   └──────────────────────┘   │
└────────────────────────────────────────────────────┘
                 ▲
                 │
┌────────────────┼───────────────────────────────────┐
│  SIDE PANEL (Svelte 5 UI)                          │
│                                                    │
│  App.svelte + components                           │
│  ┌──────────────────────────────────┐              │
│  │ Request GET_ANALYSIS on open    │              │
│  │ Auto-refresh every 4 seconds    │              │
│  │ Render 🟢 / 🟡 / 🔴 + heap chart │              │
│  └──────────────────────────────────┘              │
└────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Content scripts only collect** — no analysis runs on the web page, keeping performance impact minimal
- **Windowed averaging** (5 samples = 10s) instead of point-to-point comparison — smooths out GC spikes and prevents false positives
- **Stateless detection** — `prevAliveAvg` is computed from a sliding window, not persisted state, so the detector works correctly across extension restarts
- **Tab-scoped storage** — each tab's data is stored independently using `dataSample_${tabId}`

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MilanAnilAnthore/SweptJS.git
   cd SweptJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Navigate to `chrome://extensions`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked** and select the `dist/` folder

5. **Use it** — Click the SweptJS icon in the toolbar to open the side panel, then browse normally. The extension will start collecting data and show results after ~30 seconds.

## Development

```bash
npm run dev       # Watch mode — rebuilds on file changes
npm run build     # Production build
npm run check     # Svelte + TypeScript type checking
```

## Project Structure

```
SweptJS/
├── manifest.json                    # Chrome MV3 manifest
├── vite.config.ts                   # Vite + Svelte + web-extension plugin
├── src/
│   ├── types.ts                     # Shared types (MessageType, AnalyzedMessage, ChromeError)
│   ├── leakdetector.ts              # Detection algorithm (heap + DOM heuristics)
│   ├── background.ts                # Service worker — storage + analysis orchestration
│   ├── content/
│   │   ├── content.ts               # Entry — starts monitors, sends data every 2s
│   │   ├── heapmonitor.ts           # Polls performance.memory (legacy + modern fallback)
│   │   ├── lifecycletracker.ts      # MutationObserver + FinalizationRegistry tracking
│   │   └── global.d.ts              # Type declarations for Performance API
│   └── popup/
│       ├── popup.html               # Side panel HTML entry
│       ├── main.ts                  # Svelte app bootstrap
│       ├── popup.css                # Global cyberpunk theme styles
│       ├── App.svelte               # Root component — polling, state management
│       └── components/
│           ├── MemoryStatus.svelte   # 🟢/🟡/🔴 status indicator
│           ├── MemoryMetrics.svelte  # Heap growth % + alive node count
│           ├── HeapGraph.svelte      # Chart.js line graph of heap over time
│           └── ErrorDisplay.svelte   # Error/status message display
└── public/
    └── resources/
        ├── logo.png                 # Extension icon
        └── backMain.png             # Side panel background
```

## The Numbers

| Constant | Value | Why |
|---|---|---|
| Polling interval | 2 seconds | Fast enough to catch trends, slow enough to not impact page performance |
| Max samples | 50 | ~100 seconds of history — sufficient to detect real trends |
| Window size | 5 samples | Averaging 10 seconds of data smooths out GC spikes |
| Min samples | 15 | Need ~30s of data before detection is meaningful |
| Heap threshold | 20% growth | If memory grew 20%+ across the sample window, that's suspicious |
| DOM threshold | 10 alive | Fewer than 10 alive detached nodes is normal (framework re-renders) |

## Tech Stack

- **[Svelte 5](https://svelte.dev/)** — Reactive UI with runes (`$state`, `$derived`, `$effect`)
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety across all execution contexts
- **[Chart.js](https://www.chartjs.org/)** — Heap memory visualization
- **[Vite](https://vite.dev/)** + **[vite-plugin-web-extension](https://github.com/nicolo-ribaudo/vite-plugin-web-extension)** — Unified build for all extension entry points
- **Chrome Manifest V3** — Modern extension platform with service workers

## Browser APIs Used

| API | Purpose |
|---|---|
| [`performance.memory`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory) | Legacy heap memory reading (Chrome-only) |
| [`performance.measureUserAgentSpecificMemory()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory) | Modern memory measurement (cross-origin isolated contexts) |
| [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) | Detects DOM node removals in real time |
| [`FinalizationRegistry`](https://developer.mozilla.org/en-US/docs/Web/API/FinalizationRegistry) | Fires callback when GC actually collects a tracked object |
| [`chrome.storage.local`](https://developer.chrome.com/docs/extensions/reference/api/storage) | Persists up to 50 samples per tab |
| [`chrome.sidePanel`](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) | Extension UI in Chrome's side panel |

## License

[MIT](LICENSE) © Milan Anil Anthore
