/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueOutput } from "../../shared-types/src/dialogue.ts";

export type DialogueValidation = {
  accepted: boolean;
  repaired: boolean;
  output?: DialogueOutput;
  errors: string[];
};

export function validateDialogueOutput(
  value: unknown,
  npcId: string,
  allowedActionTypes: string[],
  allowedAnimations: string[] = ["idle"]
): DialogueValidation {
  const errors: string[] = [];
  if (!isObject(value)) {
    return { accepted: false, repaired: false, errors: ["Model output must be an object."] };
  }

  const output: DialogueOutput = {
    npcId: stringOr(value.npcId, npcId),
    text: stringOr(value.text, ""),
    emotion: stringOr(value.emotion, "neutral"),
    subtitle: stringOr(value.subtitle, stringOr(value.text, "")),
    animation: stringOr(value.animation, "idle"),
    actions: []
  };

  if (output.npcId !== npcId) errors.push("Output npcId does not match addressed NPC.");
  if (!output.text.trim()) errors.push("Output text is required.");
  if (output.text.length > 600) errors.push("Output text exceeds 600 characters.");
  if (!output.subtitle.trim()) errors.push("Subtitle is required.");
  if (!allowedAnimations.includes(output.animation)) {
    errors.push(`Animation is not allowed: ${output.animation}.`);
  }

  const rawActions = Array.isArray(value.actions) ? value.actions : [];
  output.actions = rawActions.flatMap((item) => {
    if (!isObject(item)) return [];
    const type = stringOr(item.type, "");
    const reason = stringOr(item.reason, "");
    if (!allowedActionTypes.includes(type)) {
      errors.push(`Action type is not allowed: ${type || "(missing)"}.`);
      return [];
    }
    if (!reason) {
      errors.push(`Action ${type} requires a reason.`);
      return [];
    }
    const targetId = optionalString(item.targetId);
    return [targetId ? { type, targetId, reason } : { type, reason }];
  });

  return {
    accepted: errors.length === 0,
    repaired: value.subtitle !== output.subtitle || value.animation !== output.animation || value.emotion !== output.emotion,
    output,
    errors
  };
}

export function safeFallbackOutput(npcId: string): DialogueOutput {
  const text = "I need a moment. Ask me again, plainly.";
  return {
    npcId,
    text,
    emotion: "guarded",
    subtitle: text,
    animation: "idle",
    actions: []
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

