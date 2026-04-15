# Genkit Recipe Generator - Setup Guide

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

## File Structure

```
genkit-intro/
├── main.py                 # Main recipe generator flow
├── pyproject.toml          # Project dependencies
├── TELEMETRY_ENDPOINTS.md  # Telemetry API guide
├── .env                    # API keys (create this)
└── .genkit/               # Runtime cache (auto-created)
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
```

## API Reference

### Get Traces
```bash
GET http://localhost:4033/api/traces
```
Returns JSON with all execution traces.

### Health Check
```bash
GET http://localhost:4033/api/__health
```
Returns: `{"status": "OK"}`

## Architecture

```
User Browser (localhost:4000)
    ↓
Developer UI (Starlette)
    ↓
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
