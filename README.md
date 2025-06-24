# Kumorebe AI Engine

Strategy-first AI marketing intelligence engine.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev

# Test AI capabilities
curl -X POST http://localhost:3000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Nike",
    "industry": "sportswear",
    "target": "Gen Z athletes"
  }'
```

## Architecture

- **AI Models**: Multi-model orchestration (Claude, GPT-4, Llama, Gemma)
- **Engines**: Cultural analysis, strategic positioning, creative generation
- **Intelligence**: Real-time social listening and trend detection
- **Memory**: Vector storage for pattern recognition and learning

## API Reference

See `/api/v1/*` routes for available endpoints.