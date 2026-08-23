/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import { readFile } from "node:fs/promises";
import { InMemoryEngineAdapter, type InMemoryWorld } from "../packages/engine-adapter/src/InMemoryEngineAdapter.ts";
import { ScriptedBlacksmithProvider } from "../packages/provider-interfaces/src/LanguageModelProvider.ts";
import { runDialogueTurn } from "../packages/dialogue-engine/src/runDialogueTurn.ts";
import type { CharacterRecord } from "../packages/shared-types/src/character.ts";
import type { DialogueEvent, LocationState, PlayerWorldState, WorldEntity } from "../packages/shared-types/src/dialogue.ts";

const rawCharacter = await readFile(new URL("../content/characters/npc_blacksmith_001.json", import.meta.url), "utf8");
const character = JSON.parse(rawCharacter) as CharacterRecord;
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
const playerEntity: WorldEntity = {
  id: player.playerId,
  name: player.displayName,
  type: "player",
  locationId: player.locationId
};
const npcEntity: WorldEntity = {
  id: character.profile.id,
  name: character.profile.name,
  type: "npc",
  locationId: character.runtime.currentLocationId
};
const dialogueEvents: DialogueEvent[] = [];
const world: InMemoryWorld = {
  players: new Map([[player.playerId, player]]),
  npcs: new Map([[character.profile.id, character]]),
  locations: new Map([[location.id, location]]),
  entities: [playerEntity, npcEntity],
  events: [],
  dialogueEvents
};

const result = await runDialogueTurn(
  {
    worldId: "town_demo_001",
    playerId: player.playerId,
    npcId: character.profile.id,
    text: "Did you hear about the stolen tool?",
    idempotencyKey: `smoke_${Date.now()}`
  },
  new InMemoryEngineAdapter(world),
  new ScriptedBlacksmithProvider()
);

console.log(JSON.stringify({
  ok: result.ok,
  npc: character.profile.name,
  response: result.output.text,
  animation: result.output.animation,
  eventCount: dialogueEvents.length
}, null, 2));


