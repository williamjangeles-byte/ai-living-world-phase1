/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type {
  ActionResult,
  DialogueEvent,
  EngineAdapter,
  LocationState,
  PlayerWorldState,
  UnsubscribeFunction,
  WorldAction,
  WorldEntity,
  WorldEvent
} from "../../shared-types/src/dialogue.ts";
import type { CharacterRecord } from "../../shared-types/src/character.ts";

export type InMemoryWorld = {
  players: Map<string, PlayerWorldState>;
  npcs: Map<string, CharacterRecord>;
  locations: Map<string, LocationState>;
  entities: WorldEntity[];
  events: WorldEvent[];
  dialogueEvents: DialogueEvent[];
};

export class InMemoryEngineAdapter implements EngineAdapter {
  private readonly world: InMemoryWorld;

  constructor(world: InMemoryWorld) {
    this.world = world;
  }

  async getPlayerState(playerId: string): Promise<PlayerWorldState> {
    const player = this.world.players.get(playerId);
    if (!player) throw new Error(`Unknown player: ${playerId}`);
    return player;
  }

  async getNpcState(npcId: string): Promise<CharacterRecord> {
    const npc = this.world.npcs.get(npcId);
    if (!npc) throw new Error(`Unknown NPC: ${npcId}`);
    return npc;
  }

  async getNearbyEntities(entityId: string, _radius: number): Promise<WorldEntity[]> {
    const locationId = this.locationForEntity(entityId);
    return this.world.entities.filter((entity) => entity.locationId === locationId && entity.id !== entityId);
  }

  async getVisibleEntities(entityId: string): Promise<WorldEntity[]> {
    return this.getNearbyEntities(entityId, 12);
  }

  async getAudibleEvents(entityId: string): Promise<WorldEvent[]> {
    const locationId = this.locationForEntity(entityId);
    return this.world.events.filter((event) => event.locationId === locationId || event.observedByEntityIds.includes(entityId));
  }

  async getLocationState(locationId: string): Promise<LocationState> {
    const location = this.world.locations.get(locationId);
    if (!location) throw new Error(`Unknown location: ${locationId}`);
    return location;
  }

  async emitDialogueEvent(event: DialogueEvent): Promise<void> {
    this.world.dialogueEvents.push(event);
  }

  async emitWorldAction(_action: WorldAction): Promise<ActionResult> {
    return { accepted: false, reason: "Phase 1 records dialogue only; world actions are not executed." };
  }

  async emitAnimation(_entityId: string, _animation: string): Promise<void> {}

  async playSpatialAudio(_entityId: string, _audioUrl: string): Promise<void> {}

  subscribeToWorldEvents(_handler: (event: WorldEvent) => Promise<void>): UnsubscribeFunction {
    return () => {};
  }

  private locationForEntity(entityId: string): string {
    const npc = this.world.npcs.get(entityId);
    if (npc) return npc.runtime.currentLocationId;

    const player = this.world.players.get(entityId);
    if (player) return player.locationId;

    const entity = this.world.entities.find((item) => item.id === entityId);
    if (entity) return entity.locationId;

    throw new Error(`Unknown entity: ${entityId}`);
  }
}

