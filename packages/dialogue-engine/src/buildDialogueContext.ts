/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueContext, DialogueInput, EngineAdapter } from "../../shared-types/src/dialogue.ts";

const maxInputChars = 1000;

export async function buildDialogueContext(
  input: DialogueInput,
  engine: EngineAdapter
): Promise<DialogueContext> {
  const text = input.text.trim();
  if (!text) throw new Error("Dialogue input text is required.");
  if (text.length > maxInputChars) throw new Error(`Dialogue input exceeds ${maxInputChars} characters.`);
  if (!input.idempotencyKey.trim()) throw new Error("idempotencyKey is required.");

  const player = await engine.getPlayerState(input.playerId);
  const character = await engine.getNpcState(input.npcId);
  if (!character.runtime.availableToTalk) throw new Error(`${character.profile.name} is not available to talk.`);

  const [location, visibleEntities, audibleEvents] = await Promise.all([
    engine.getLocationState(character.runtime.currentLocationId),
    engine.getVisibleEntities(input.npcId),
    engine.getAudibleEvents(input.npcId)
  ]);

  const playerIsVisible = visibleEntities.some((entity) => entity.id === input.playerId);
  if (player.locationId !== character.runtime.currentLocationId && !playerIsVisible) {
    throw new Error(`${character.profile.name} cannot hear or see the player from here.`);
  }

  return {
    input: { ...input, text },
    player,
    character,
    location,
    visibleEntities,
    audibleEvents,
    policy: {
      maxOutputChars: 600,
      allowedActionTypes: ["emote", "gesture", "face-player"],
      allowedAnimations: ["idle", "fold-arms", "hammer-pause", "nod", "look-away"]
    }
  };
}

