# 99Tech Code Challenge

## Candidate: Tran Canh Quan

This repository contains my solutions for the 99Tech Code Challenge (Backend/Full-stack profile).

### Repository Structure

- `src/problem-4/` - Three Ways to Sum to n (TypeScript)
- `src/problem-5/` - A Crude Server (Express + TypeScript + SQLite)
- `src/problem-6/` - Scoreboard Module Architecture Specification (Markdown)

---

## Problem 4: Three Ways to Sum to n

**Location:** `src/problem-4/`

Provides three different implementations of calculating the sum from 1 to `n` in TypeScript:

1. **Iterative:** `O(n)` time, `O(1)` space snippet.
2. **Recursive:** `O(n)` time, `O(n)` space snippet.
3. **Mathematical (Gauss):** `O(1)` time, `O(1)` space snippet (most optimal).

See `src/problem-4/README.md` for details and instructions on running tests.

---

## Problem 5: A Crude Server

**Location:** `src/problem-5/`

A REST API backend built using Express, TypeScript, and SQLite (`better-sqlite3`).

### Features

- Complete CRUD operations for an `Item` resource.
- Filter and search endpoints.
- Integration test coverage using Jest, supertest, and an isolated in-memory database.
- Structured following enterprise patterns (Router -> Service -> Repository).

See `src/problem-5/README.md` for API documentation and setup instructions.

---

## Problem 6: Architecture Specification

**Location:** `src/problem-6/`

A detailed architectural system design for a real-time Scoreboard API Module.

### Key Aspects Addressed

- **System Design:** PostgreSQL & Redis interaction diagram.
- **Security:** JWT Authentication and prevention of unauthorized or malicious score manipulations.
- **Concurrency:** Handling race conditions and idempotency for score updates (`action_log` implementation).
- **Real-Time Data:** Broadcasting live top 10 leaderboards to clients securely via WebSockets and Redis Pub/Sub.

See `src/problem-6/README.md` for the full technical specification.
