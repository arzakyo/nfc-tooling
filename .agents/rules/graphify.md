# Knowledge Graph (Graphify) Rules & Regeneration

This project maintains a code knowledge graph in `graphify-out/` to allow developers and AI agents to instantly trace dependencies, data flow, card protocols, and component relationships.

## How to Generate on a Fresh Clone

`graphify-out/` is excluded from git to avoid diff bloat. If you switch to another machine or freshly clone this repository, you can regenerate the entire graph in seconds:

### Prerequisite
Python 3.10+ installed.

### Option 1: Using Bun / NPM Script
```bash
bun run graphify
```

### Option 2: Using the CLI directly
```bash
# 1. Install graphifyy (one-time)
pip install graphifyy
# or with uv:
uv tool install graphifyy

# 2. Extract and generate HTML & graph data
graphify .
```

### Option 3: Inside Antigravity / AI Agent
If you are working with Antigravity:
```text
/graphify
```

---

## Important Properties

- **100% Deterministic & Offline:** For codebases like this, extraction uses native Abstract Syntax Tree (AST) parsing. No LLM tokens, no API keys, and no network connection are required.
- **Output Files:**
  - `graphify-out/graph.json` — Structured graph nodes, edges, and community clusters for GraphRAG and AI agent context.
  - `graphify-out/graph.html` — Interactive visual graph you can open in any browser.
  - `graphify-out/GRAPH_REPORT.md` — Architectural breakdown, god nodes, and cohesion metrics.

---

## Querying the Knowledge Graph

Whenever you need to inspect architecture or dependencies:
```bash
graphify query "<question>"
# Examples:
graphify query "How does Flazz card reading work?"
graphify query "Where is platform isolation implemented between native and web?"
```
