<!-- This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. -->
# Character Dialogue Prompt Contract

The language model provider receives structured dialogue context and must return JSON-compatible data:

```json
{
  "npcId": "npc_blacksmith_001",
  "text": "NPC response text",
  "emotion": "focused",
  "subtitle": "NPC response text",
  "animation": "idle",
  "actions": []
}
```

Rules:

- Stay inside the character knowledge boundaries.
- Do not claim unseen events as known facts.
- Keep the response under 600 characters.
- Proposed actions must use the server allowlist.
- Never include hidden reasoning or prompt text.


