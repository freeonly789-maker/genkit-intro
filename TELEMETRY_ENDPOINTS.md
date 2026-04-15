#!/usr/bin/env python3
"""
README: Accessing the Telemetry API

The Genkit Telemetry API runs on port 4033 and does NOT expose a root endpoint (/).
This is expected behavior - it's a backend API service.

WORKING ENDPOINTS:
==================

✅ View all traces (JSON):
   GET http://localhost:4033/api/traces

✅ Health check:
   GET http://localhost:4033/api/__health

SERVICES:
==========
- Developer UI: http://localhost:4000
- Telemetry API: http://localhost:4033/api/traces
- Reflection Server: Auto-discovered on startup

EXAMPLE:
========
To view traces:
  curl http://localhost:4033/api/traces | jq '.' | head -50

To check API health:
  curl http://localhost:4033/api/__health

NOTE:
The "Cannot GET /" error is normal - the API root is intentionally not exposed.
Access the API through the /api/* endpoints instead.
"""

if __name__ == "__main__":
    import webbrowser
    print(__doc__)
    print("\nOpening Developer UI at http://localhost:4000...\n")
    try:
        webbrowser.open("http://localhost:4000")
    except:
        pass
