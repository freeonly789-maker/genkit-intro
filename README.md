# Genkit Recipe Generator & Next.js Chat App

This repository contains two main components:

1. **Genkit Recipe Generator** - A backend service for generating recipes using Google's Gemini AI
2. **Next.js Chat Application** - A modern React-based chat interface with task management sidebar

## 🚀 Next.js Chat Application

A beautiful, responsive chat interface built with Next.js, featuring:

### ✨ Features
- **Real-time chat interface** with message bubbles
- **Markdown rendering** for rich text messages
- **Task sidebar** with status indicators (idle/loading/done)
- **Auto-resizing input** and keyboard shortcuts
- **Message actions** (copy, export, suggestions)
- **Responsive design** with custom CSS variables
- **Dark/light theme support**

### 🛠️ Tech Stack
- **Framework:** Next.js 16.2.3 with App Router
- **Language:** TypeScript
- **Styling:** Custom CSS with CSS Variables
- **Icons:** SVG icons with hover effects

### 🚀 Running the Chat App

```bash
cd next-chat-app
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 📁 Chat App Structure
```
next-chat-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Inter font
│   │   ├── page.tsx        # Main chat interface
│   │   └── globals.css     # Global styles & CSS variables
│   └── components/
│       └── TaskSidebar.tsx # Task management sidebar
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## 🍳 Genkit Recipe Generator

## Services & Ports

After running `genkit start -- uv run main.py`, the following services will be available:

| Service | URL | Status |
|---------|-----|--------|
| **Developer UI** | http://localhost:4000 | ✅ Full UI |
| **Genkit Telemetry API** | http://localhost:4033/api/traces | ✅ Working |
| **Telemetry Health** | http://localhost:4033/api/__health | ✅ Working |

## ⚠️ About the "Cannot GET /" Error

The Telemetry API root endpoint (`http://localhost:4033/`) intentionally returns **404**. This is **expected behavior** - it's a backend service without a root UI.

### ✅ Correct Endpoints to Use

```bash
# View all traces (JSON)
curl http://localhost:4033/api/traces | jq '.'

# Check API health
curl http://localhost:4033/api/__health
```

## Getting Started

### 1. Set Environment Variable
```bash
export GEMINI_API_KEY=your_gemini_api_key_here
```

Or create a `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Start Genkit
```bash
genkit start -- uv run main.py
```

### 3. Access Services

- **Developer UI**: Open http://localhost:4000 in your browser
- **Traces API**: `curl http://localhost:4033/api/traces`
- **Recipe Flow**: Accessible through Developer UI

## 📁 Project Structure

```
genkit-intro/
├── next-chat-app/          # Next.js chat application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Chat interface
│   │   │   └── globals.css     # Global styles
│   │   └── components/
│   │       └── TaskSidebar.tsx # Task sidebar component
│   ├── package.json
│   └── next.config.ts
├── main.py                 # Genkit recipe generator flow
├── pyproject.toml          # Python dependencies
├── index.html              # Original HTML chat interface
├── TELEMETRY_ENDPOINTS.md  # Telemetry API guide
├── .env                    # API keys (create this)
└── .genkit/               # Runtime cache (auto-created)
```

## 🏃 Running Both Applications

### Option 1: Run Separately
```bash
# Terminal 1: Start Genkit backend
genkit start -- uv run main.py

# Terminal 2: Start Next.js frontend
cd next-chat-app && npm run dev
```

### Option 2: Use the Chat App Only
```bash
cd next-chat-app
npm install
npm run dev
# Open http://localhost:3000
```

### Option 3: Use Genkit Only
```bash
export GEMINI_API_KEY=your_key
genkit start -- uv run main.py
# Open http://localhost:4000
```

## Common Issues

### "Telemetry API: Cannot GET /"
✅ **This is normal.** The API root is not exposed. Use `/api/traces` instead.

### "GEMINI_API_KEY not found"
Set the environment variable before running:
```bash
export GEMINI_API_KEY=your_key
genkit start -- uv run main.py
```

### Ports Already in Use
Kill existing processes:
```bash
pkill -9 genkit
pkill -9 uv
# For Next.js
pkill -f "next dev"
```

### Next.js Build Errors
If you encounter JSX parsing errors:
```bash
cd next-chat-app
rm -rf .next
npm run dev
```

## 💬 Chat Application Features

### 🎨 UI Components
- **Message Bubbles**: User and assistant messages with distinct styling
- **Task Sidebar**: Collapsible sidebar showing task progress with icons
- **Auto-resize Input**: Textarea that grows with content
- **Action Buttons**: Copy, export, and suggestion buttons
- **Loading States**: Animated thinking indicator and task spinners

### ⌨️ Keyboard Shortcuts
- **Enter**: Send message (Shift+Enter for new line)
- **Auto-focus**: Input focuses on load and after sending

### 🎯 Task Management
- **Status Indicators**: Visual icons for idle/loading/done states
- **Hover Effects**: Interactive task items with background changes
- **Time Stamps**: Completion times for finished tasks

## API Reference

### Genkit Telemetry API

#### Get Traces
```bash
GET http://localhost:4033/api/traces
```
Returns JSON with all execution traces.

#### Health Check
```bash
GET http://localhost:4033/api/__health
```
Returns: `{"status": "OK"}`

### Chat App Endpoints
- **Main App**: `http://localhost:3000`
- **No API endpoints** - client-side only application

## 🏗️ Architecture

```
User Browser
├── Next.js Chat App (localhost:3000)
│   └── React Components + Task Sidebar
└── Genkit Developer UI (localhost:4000)
    └── Recipe Generator Flow
        └── Gemini AI API
            └── Telemetry API (localhost:4033)
```
Reflection Server (localhost:49xxx)
    ↓
Main App (main.py) ← Genkit Flow
    ↓
Telemetry API (localhost:4033)
    ↓
Trace Data (JSON)
```

## Notes

- The telemetry API is a **read-only** service for viewing execution traces
- Traces are automatically collected when flows execute
- The root endpoint returning 404 is intentional and not a bug
- All API endpoints are working correctly despite the root 404
