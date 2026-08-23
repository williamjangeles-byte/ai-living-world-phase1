/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { InMemoryEngineAdapter, type InMemoryWorld } from "../packages/engine-adapter/src/InMemoryEngineAdapter.ts";
import { ScriptedBlacksmithProvider } from "../packages/provider-interfaces/src/LanguageModelProvider.ts";
import { runDialogueTurn } from "../packages/dialogue-engine/src/runDialogueTurn.ts";
import type { CharacterRecord } from "../packages/shared-types/src/character.ts";
import type { DialogueEvent, EngineAdapter, LocationState, PlayerWorldState, WorldEntity, WorldEvent } from "../packages/shared-types/src/dialogue.ts";

test("runs a typed dialogue turn for the blacksmith", async () => {
  const emitted: DialogueEvent[] = [];
  const engine = await createMockEngine(emitted);
  const result = await runDialogueTurn(
    {
      worldId: "town_demo_001",
      playerId: "player_001",
      npcId: "npc_blacksmith_001",
      text: "Did you hear about the stolen tool?",
      idempotencyKey: "turn_001"
    },
    engine,
    new ScriptedBlacksmithProvider()
  );

  assert.equal(result.ok, true);
  assert.equal(result.output.npcId, "npc_blacksmith_001");
  assert.match(result.output.text, /tool|mine|gossip/i);
  assert.equal(result.usage.estimatedCost, 0);
  assert.equal(emitted.length, 1);
  assert.equal(emitted[0]?.id, "turn_001");
});

test("returns a safe fallback when provider output is invalid", async () => {
  const emitted: DialogueEvent[] = [];
  const engine = await createMockEngine(emitted);
  const result = await runDialogueTurn(
    {
      worldId: "town_demo_001",
      playerId: "player_001",
      npcId: "npc_blacksmith_001",
      text: "Tell me everything.",
      idempotencyKey: "turn_002"
    },
    engine,
    {
      async completeDialogue() {
        return {
          output: { npcId: "wrong", text: "", actions: [{ type: "delete-save", reason: "bad" }] },
          provider: "test",
          model: "invalid",
          usage: { inputTokens: 1, outputTokens: 1, estimatedCost: 0 }
        };
      }
    }
  );

  assert.equal(result.ok, false);
  assert.equal(result.output.text, "I need a moment. Ask me again, plainly.");
  assert.match(result.validation.errors.join(" "), /npcId|text|Action type/);
  assert.equal(emitted.length, 1);
});

test("returns a safe fallback instead of throwing when interaction is impossible", async () => {
  const emitted: DialogueEvent[] = [];
  const engine = await createMockEngine(emitted, {
    player: {
      playerId: "player_001",
      displayName: "Mara",
      locationId: "library"
    },
    visibleEntities: []
  });
  let providerCalled = false;

  const result = await runDialogueTurn(
    {
      worldId: "town_demo_001",
      playerId: "player_001",
      npcId: "npc_blacksmith_001",
      text: "Can you hear me from the library?",
      idempotencyKey: "turn_003"
    },
    engine,
    {
      async completeDialogue() {
        providerCalled = true;
        throw new Error("Provider should not be called when context is invalid.");
      }
    }
  );

  assert.equal(providerCalled, false);
  assert.equal(result.ok, false);
  assert.match(result.validation.errors.join(" "), /cannot hear or see/);
  assert.equal(emitted.length, 0);
});

async function createMockEngine(
  emitted: DialogueEvent[],
  overrides: {
    player?: PlayerWorldState;
    visibleEntities?: WorldEntity[];
    audibleEvents?: WorldEvent[];
  } = {}
): Promise<EngineAdapter> {
  const raw = await readFile(new URL("../content/characters/npc_blacksmith_001.json", import.meta.url), "utf8");
  const character = JSON.parse(raw) as CharacterRecord;
  const player: PlayerWorldState = overrides.player ?? {
    playerId: "player_001",
    displayName: "Mara",
    locationId: "forge"
  };
  const location: LocationState = {
    id: "forge",
    name: "Forge",
    description: "A hot stone forge facing the town square."
  };
  const visibleEntities: WorldEntity[] = overrides.visibleEntities ?? [
    { id: "player_001", name: "Mara", type: "player", locationId: "forge" }
  ];
  const audibleEvents: WorldEvent[] = overrides.audibleEvents ?? [];
  const locations = new Map<string, LocationState>([
    [location.id, location],
    ["library", { id: "library", name: "Library", description: "A quiet archive across town." }]
  ]);
  const world: InMemoryWorld = {
    players: new Map([[player.playerId, player]]),
    npcs: new Map([[character.profile.id, character]]),
    locations,
    entities: [
      ...visibleEntities,
      { id: character.profile.id, name: character.profile.name, type: "npc", locationId: character.runtime.currentLocationId }
    ],
    events: audibleEvents,
    dialogueEvents: emitted
  };

  return new InMemoryEngineAdapter(world);
}

