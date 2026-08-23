<!-- This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. -->
# Dialogue API

## POST /dialogue

Request body:

```json
{
  "worldId": "town_demo_001",
  "playerId": "player_001",
  "npcId": "npc_blacksmith_001",
  "text": "Did you hear about the stolen tool?",
  "idempotencyKey": "turn_001"
}
```

Response body:

```json
{
  "ok": true,
  "output": {
    "npcId": "npc_blacksmith_001",
    "text": "If it concerns tools or the mine road, speak plainly. I trust steel marks more than town gossip.",
    "emotion": "suspicious",
    "subtitle": "If it concerns tools or the mine road, speak plainly. I trust steel marks more than town gossip.",
    "animation": "fold-arms",
    "actions": []
  }
}
```

Status codes:

- `200`: valid dialogue output.
- `400`: invalid request shape.
- `422`: provider output failed validation and fallback was used.


