/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { validateDialogueOutput } from "../packages/dialogue-engine/src/validateDialogueOutput.ts";

test("validates and repairs optional dialogue fields", () => {
  const validation = validateDialogueOutput(
    {
      npcId: "npc_blacksmith_001",
      text: "Plain question, plain answer.",
      actions: [{ type: "gesture", reason: "Acknowledges player." }]
    },
    "npc_blacksmith_001",
    ["gesture"]
  );

  assert.equal(validation.accepted, true);
  assert.equal(validation.repaired, true);
  assert.equal(validation.output?.subtitle, "Plain question, plain answer.");
  assert.equal(validation.output?.animation, "idle");
});

test("rejects disallowed model actions", () => {
  const validation = validateDialogueOutput(
    {
      npcId: "npc_blacksmith_001",
      text: "No.",
      subtitle: "No.",
      animation: "idle",
      actions: [{ type: "spawn-gold", reason: "Model asked for it." }]
    },
    "npc_blacksmith_001",
    ["gesture"]
  );

  assert.equal(validation.accepted, false);
  assert.match(validation.errors.join(" "), /not allowed/);
  assert.equal(validation.output?.actions.length, 0);
});

test("rejects disallowed animation cues", () => {
  const validation = validateDialogueOutput(
    {
      npcId: "npc_blacksmith_001",
      text: "Plainly said.",
      subtitle: "Plainly said.",
      animation: "teleport",
      actions: []
    },
    "npc_blacksmith_001",
    ["gesture"],
    ["idle", "nod"]
  );

  assert.equal(validation.accepted, false);
  assert.match(validation.errors.join(" "), /Animation is not allowed/);
});

