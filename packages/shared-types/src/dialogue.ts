/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { CharacterRecord } from "./character.ts";

export type PlayerWorldState = {
  playerId: string;
  displayName: string;
  locationId: string;
};

export type LocationState = {
  id: string;
  name: string;
  description: string;
};

export type WorldEntity = {
  id: string;
  name: string;
  type: "player" | "npc" | "object" | "location";
  locationId: string;
};

export type WorldEvent = {
  id: string;
  worldId: string;
  description: string;
  locationId: string;
  observedByEntityIds: string[];
  createdAt: string;
};

export type DialogueEvent = {
  id: string;
  worldId: string;
  npcId: string;
  playerId: string;
  input: string;
  output: string;
  createdAt: string;
};

export type WorldAction = {
  type: string;
  actorId: string;
  targetId?: string;
  reason: string;
};

export type ActionResult = {
  accepted: boolean;
  reason: string;
};

export type UnsubscribeFunction = () => void;

export type EngineAdapter = {
  getPlayerState(playerId: string): Promise<PlayerWorldState>;
  getNpcState(npcId: string): Promise<CharacterRecord>;
  getNearbyEntities(entityId: string, radius: number): Promise<WorldEntity[]>;
  getVisibleEntities(entityId: string): Promise<WorldEntity[]>;
  getAudibleEvents(entityId: string): Promise<WorldEvent[]>;
  getLocationState(locationId: string): Promise<LocationState>;
  emitDialogueEvent(event: DialogueEvent): Promise<void>;
  emitWorldAction(action: WorldAction): Promise<ActionResult>;
  emitAnimation(entityId: string, animation: string): Promise<void>;
  playSpatialAudio(entityId: string, audioUrl: string): Promise<void>;
  subscribeToWorldEvents(handler: (event: WorldEvent) => Promise<void>): UnsubscribeFunction;
};

export type DialogueInput = {
  worldId: string;
  playerId: string;
  npcId: string;
  text: string;
  idempotencyKey: string;
};

export type DialogueContext = {
  input: DialogueInput;
  player: PlayerWorldState;
  character: CharacterRecord;
  location: LocationState;
  visibleEntities: WorldEntity[];
  audibleEvents: WorldEvent[];
  policy: {
    maxOutputChars: number;
    allowedActionTypes: string[];
    allowedAnimations: string[];
  };
};

export type DialogueActionProposal = {
  type: string;
  targetId?: string;
  reason: string;
};

export type DialogueOutput = {
  npcId: string;
  text: string;
  emotion: string;
  subtitle: string;
  animation: string;
  actions: DialogueActionProposal[];
};

export type DialogueTurnResult = {
  ok: boolean;
  output: DialogueOutput;
  provider: string;
  model: string;
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
  validation: {
    accepted: boolean;
    repaired: boolean;
    errors: string[];
  };
};

