/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { getCharacterRuntime } from "../packages/character-engine/src/getCharacterRuntime.ts";
import { validateCharacterRecord } from "../packages/content-schema/src/characterSchema.ts";

test("validates the blacksmith content record", async () => {
  const raw = await readFile(new URL("../content/characters/npc_blacksmith_001.json", import.meta.url), "utf8");
  const validation = validateCharacterRecord(JSON.parse(raw));

  assert.equal(validation.ok, true);
  assert.equal(validation.value?.profile.id, "npc_blacksmith_001");
  assert.equal(validation.value?.runtime.availableToTalk, true);
});

test("rejects character records with invalid bounded emotion values", () => {
  const validation = validateCharacterRecord({
    profile: {
      id: "bad",
      name: "Bad",
      occupation: "tester",
      speechStyle: "plain",
      knowledgeBoundaries: [],
      forbiddenBehaviors: [],
      defaultEmotion: { valence: 2 }
    },
    runtime: {
      currentLocationId: "forge",
      availableToTalk: true,
      emotionalState: { valence: 0 }
    }
  });

  assert.equal(validation.ok, false);
  assert.match(validation.errors.join(" "), /valence/);
});

test("loads character runtime through the character engine", async () => {
  const raw = await readFile(new URL("../content/characters/npc_blacksmith_001.json", import.meta.url), "utf8");
  const record = await getCharacterRuntime("npc_blacksmith_001", async () => JSON.parse(raw));

  assert.equal(record.profile.name, "Bram Ironwake");
});


