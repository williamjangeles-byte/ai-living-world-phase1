/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { CharacterRecord } from "../../shared-types/src/character.ts";
import { validateCharacterRecord } from "../../content-schema/src/characterSchema.ts";

export async function getCharacterRuntime(
  npcId: string,
  loadCharacter: (npcId: string) => Promise<unknown>
): Promise<CharacterRecord> {
  const raw = await loadCharacter(npcId);
  const validation = validateCharacterRecord(raw);

  if (!validation.ok || !validation.value) {
    throw new Error(`Invalid character ${npcId}: ${validation.errors.join(" ")}`);
  }

  if (validation.value.profile.id !== npcId) {
    throw new Error(`Character ID mismatch: expected ${npcId}, got ${validation.value.profile.id}`);
  }

  return validation.value;
}


