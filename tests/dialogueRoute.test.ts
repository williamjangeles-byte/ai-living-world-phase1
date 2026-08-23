/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { postDialogueRoute } from "../apps/api-server/src/routes/dialogue.ts";
import { createDialogueService } from "../apps/api-server/src/services/dialogueService.ts";
import { InMemoryEngineAdapter, type InMemoryWorld } from "../packages/engine-adapter/src/InMemoryEngineAdapter.ts";
import { ScriptedBlacksmithProvider } from "../packages/provider-interfaces/src/LanguageModelProvider.ts";
import type { CharacterRecord } from "../packages/shared-types/src/character.ts";
import type { DialogueEvent, LocationState, PlayerWorldState, WorldEntity } from "../packages/shared-types/src/dialogue.ts";

test("rejects malformed dialogue route requests", async () => {
  const service = createDialogueService(await createEngine(), new ScriptedBlacksmithProvider());
  const response = await postDialogueRoute({ npcId: "npc_blacksmith_001" }, service);

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: "worldId must be a non-empty string." });
});

test("routes valid typed dialogue through the service", async () => {
  const service = createDialogueService(await createEngine(), new ScriptedBlacksmithProvider());
  const response = await postDialogueRoute(
    {
      worldId: "town_demo_001",
      playerId: "player_001",
      npcId: "npc_blacksmith_001",
      text: "What happened with the mine tools?",
      idempotencyKey: "route_001"
    },
    service
  );

  assert.equal(response.status, 200);
  assert.equal("ok" in response.body && response.body.ok, true);
});

async function createEngine(): Promise<InMemoryEngineAdapter> {
  const raw = await readFile(new URL("../content/characters/npc_blacksmith_001.json", import.meta.url), "utf8");
  const character = JSON.parse(raw) as CharacterRecord;
  const player: PlayerWorldState = {
    playerId: "player_001",
    displayName: "Mara",
    locationId: "forge"
  };
  const location: LocationState = {
    id: "forge",
    name: "Forge",
    description: "A hot stone forge facing the town square."
  };
  const entities: WorldEntity[] = [
    { id: player.playerId, name: player.displayName, type: "player", locationId: player.locationId },
    { id: character.profile.id, name: character.profile.name, type: "npc", locationId: character.runtime.currentLocationId }
  ];
  const dialogueEvents: DialogueEvent[] = [];
  const world: InMemoryWorld = {
    players: new Map([[player.playerId, player]]),
    npcs: new Map([[character.profile.id, character]]),
    locations: new Map([[location.id, location]]),
    entities,
    events: [],
    dialogueEvents
  };

  return new InMemoryEngineAdapter(world);
}

