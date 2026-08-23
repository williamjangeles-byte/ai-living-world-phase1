# AI Living World Phase 1

A tested, isolated typed-dialogue slice for a modular AI living-world game engine.

## What works

- Loads a sample blacksmith NPC.
- Builds dialogue context from typed input and engine state.
- Uses an injected language-model provider interface.
- Validates structured output and bounded actions.
- Returns text, emotion, subtitle, animation cue, and safe action proposals.
- Falls back safely when provider output is invalid.
- Includes an in-memory engine adapter, tests, and a smoke demo.

## Run

```powershell
npm.cmd test
npm.cmd run demo
```

Node.js 24 or newer is required.

## Deferred

Real provider connections, speech, persistent memory, moderation, autonomous behavior, multiplayer, and a complete game runtime are outside Phase 1.

## License and credit

This public Phase 1 slice is licensed under the Mozilla Public License 2.0. Distributed modifications to MPL-covered files must comply with that license and retain the legal notices.

Copyright © 2026 williamjangeles-byte. See [LICENSE](LICENSE) and [NOTICE](NOTICE.md).

The project name and branding are not licensed for reuse. Separate private projects and later proprietary components are not covered by this repository's license.
