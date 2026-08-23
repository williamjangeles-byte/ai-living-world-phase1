<!-- This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. -->
# System Overview

Phase 1 is intentionally small:

1. A game or test harness sends typed `DialogueInput`.
2. `buildDialogueContext` asks the `EngineAdapter` for player, NPC, location, visible entity, and audible event state.
3. `runDialogueTurn` calls an injected `LanguageModelProvider`.
4. `validateDialogueOutput` accepts only structured, bounded output.
5. The engine emits a dialogue event and returns subtitle-ready text.

No provider key is exposed to the client. No model-proposed action is executed directly.


