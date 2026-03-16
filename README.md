# 📝 Text Summarizer — Browser-Native NLP

> Automatically condense long documents into concise summaries — entirely in your browser. No server, no API keys, no setup.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-1D9E75?style=for-the-badge&logo=firefox)](https://your-username.github.io/text-summarization/)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Transformers.js](https://img.shields.io/badge/AI-Transformers.js-FFD21E?style=for-the-badge&logo=huggingface)](https://huggingface.co/docs/transformers.js)
[![Static Site](https://img.shields.io/badge/Hosting-Static%20Web-00C853?style=for-the-badge&logo=googlechrome)](https://pages.github.com)

---

## 📖 Table of Contents

- [About](#-about)
- [Tech Flow](#-tech-flow)
- [Models & Caveats](#-models--caveats)
- [How to Run](#-how-to-run)
- [Deploy](#-deploy)
- [CI/CD — GitHub Pages](#-cicd--github-pages)
- [CI/CD — GitLab Pages](#-cicd--gitlab-pages)
- [GitHub vs GitLab](#-github-vs-gitlab)
- [Project Structure](#-project-structure)

---

## 🧠 About

Text Summarizer is a Natural Language Processing (NLP) application designed to **automatically create a short, coherent summary** of a longer text document. The goal is to reduce the volume of text while retaining the most important information, making it easier to digest large amounts of content efficiently.

This project is a sample demonstration — by virtue of running on a non-server-backed environment, everything executes entirely in-browser via [Xenova/Transformers.js](https://github.com/xenova/transformers.js).

---

## ⚡ Tech Flow

```
📝 Text Input  →  Transformers.js (ONNX/WASM)  →  🧠 Model Inference  →  📄 Summary Output
```

**Stack:**

- Vanilla JS — no frameworks, no bundlers
- Static Web — just HTML, CSS, and JS files
- CI/CD + Webhooks — automated deploy on every push

---

## 🤖 Models & Caveats

All models are loaded from HuggingFace CDN on first use and **cached in your browser's IndexedDB** — subsequent runs load in seconds. Speed depends on your internet connection for the initial download, and your device CPU for inference.

| Model | Speed | Notes |
|---|---|---|
| `Xenova/t5-small` | 🔥 Fast | Runs in-browser. Limited by client resources, may be slower for long texts. |
| `Xenova/pegasus-xsum-small` | 🔥🔥 Fast | Similar size to t5-small. Architecture optimised for summarization — slight speed variation. |
| `Xenova/t5-base` | 🔥🔥🔥 Moderate | Significantly slower than t5-small due to larger size and higher parameter count. |
| `Xenova/distilbart-cnn-6-6` | 🔥🔥🔥🔥 Fast | Distilled BART architecture — intentionally smaller and faster than the full-sized BART model. |
| `Xenova/bart-large-cnn` | 🔥🔥🔥🔥🔥 Slowest | Largest model. Highest inference time. Best quality summaries. |

> ⚡ Speed depends on your internet connection (model download) and device CPU (inference).

---

## 🚀 How to Run

This is a **fully static site** — no build step, no package manager, no environment variables required.

### Option A — Open directly (zero setup)

```bash
# Clone the repository
git clone https://github.com/ronaldgosso/text_sumarization.git
cd text-sumarization

# Open in your browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### Option B — Serve locally (recommended)

Serving over `localhost` avoids browser restrictions on `file://` URLs and ensures Web Workers run correctly:

```bash
# Node.js (no install needed)
npx serve .
# → http://localhost:3000

# Python 3
python -m http.server 8080
# → http://localhost:8080
```

> 💡 No `.env` file, no `npm install`, no API keys. Pure static. Models are fetched from HuggingFace CDN on first use, then cached in IndexedDB automatically.

---

## ☁️ Deploy

Since this is a static site, it deploys to any static hosting platform with zero configuration.

| Platform | Method |
|---|---|
| **GitHub Pages** | Via Actions workflow below — see CI/CD section |
| **GitLab Pages** | Via `.gitlab-ci.yml` below — see CI/CD section |
| **Netlify** | Drag and drop the project folder at [netlify.com/drop](https://netlify.com/drop) |
| **Vercel** | `npx vercel .` in the project directory |
| **Surge** | `npx surge .` — free surge.sh subdomain, instant |
| **Cloudflare Pages** | Connect repo in dashboard, set build output to `/` |

---

## 🐙 CI/CD — GitHub Pages

### Step 1 — Create the workflow file

Add `.github/workflows/deploy.yml` to your repository:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:

  # ── Validate ───────────────────────────────────────────
  validate:
    name: Validate static files
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check index.html exists
        run: test -f index.html && echo "✅ index.html found"

  # ── Build ──────────────────────────────────────────────
  build:
    name: Build and upload artifact
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .        # Serve from project root

  # ── Deploy ─────────────────────────────────────────────
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 2 — Enable GitHub Pages

1. Go to your repository → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 3 — Push and deploy

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment"
git push origin main
```

Watch the pipeline run in the **Actions** tab. Your site will be live at `https://your-username.github.io/text-summarization/`.

**Pipeline flow:**
```
git push → validate → build artifact → deploy ✓
```

---

## 🦊 CI/CD — GitLab Pages

Add `.gitlab-ci.yml` to the project root:

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - deploy

validate:
  stage: validate
  image: alpine:latest
  script:
    - test -f index.html && echo "✅ index.html found"
  only:
    - main
    - merge_requests

build:
  stage: build
  image: alpine:latest
  script:
    - mkdir -p public
    - cp -r . public/
    - rm -rf public/.git public/.gitlab-ci.yml
  artifacts:
    paths:
      - public/
  only:
    - main

pages:
  stage: deploy
  script:
    - echo "Deploying to GitLab Pages..."
  artifacts:
    paths:
      - public/
  only:
    - main
  environment:
    name: production
    url: https://$CI_PROJECT_NAMESPACE.gitlab.io/$CI_PROJECT_NAME
```

> The `pages` job name is **reserved** in GitLab CI — it automatically serves files in the `public/` directory. No extra settings required.

---

## 📊 GitHub vs GitLab

| | GitHub Actions | GitLab CI |
|---|---|---|
| **Config file** | `.github/workflows/deploy.yml` | `.gitlab-ci.yml` |
| **Pages folder** | Configurable (`path:`) | Must be `public/` |
| **Enable Pages** | Settings → Pages → GitHub Actions | Automatic after `pages` job |
| **Secrets** | Settings → Secrets → Actions | Settings → CI/CD → Variables |
| **Free CI minutes** | 2,000 min/month | 400 min/month |
| **Site URL** | `username.github.io/repo` | `username.gitlab.io/repo` |
| **Manual trigger** | Actions → Run workflow | CI/CD → Pipelines → Run pipeline |

---

## 📁 Project Structure

```
text-summarization/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD
├── .gitlab-ci.yml          # GitLab CI/CD
├── index.html              # Main entry point — entire app lives here
├── style.css               # Styles
├── app.js                  # Transformers.js pipeline logic
└── README.md
```

---

## 📄 License

MIT © Text Summarizer Contributors

---

> Built with 📝 + 🧠 using Vanilla JS and Transformers.js — no backend required.
