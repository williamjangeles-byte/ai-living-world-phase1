/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { LanguageModelProvider } from "../../provider-interfaces/src/LanguageModelProvider.ts";
import type { DialogueInput, DialogueTurnResult, EngineAdapter } from "../../shared-types/src/dialogue.ts";
import { buildDialogueContext } from "./buildDialogueContext.ts";
import { safeFallbackOutput, validateDialogueOutput } from "./validateDialogueOutput.ts";

export async function runDialogueTurn(
  input: DialogueInput,
  engine: EngineAdapter,
  provider: LanguageModelProvider
): Promise<DialogueTurnResult> {
  const startedAt = Date.now();

  try {
    const context = await buildDialogueContext(input, engine);
    const response = await provider.completeDialogue({
      context,
      maxOutputTokens: 180
    });
    const validation = validateDialogueOutput(
      response.output,
      input.npcId,
      context.policy.allowedActionTypes,
      context.policy.allowedAnimations
    );

    const output = validation.accepted && validation.output
      ? validation.output
      : safeFallbackOutput(input.npcId);

    await engine.emitDialogueEvent({
      id: input.idempotencyKey,
      worldId: input.worldId,
      npcId: input.npcId,
      playerId: input.playerId,
      input: context.input.text,
      output: output.text,
      createdAt: new Date().toISOString()
    });

    return {
      ok: validation.accepted,
      output,
      provider: response.provider,
      model: response.model,
      latencyMs: Date.now() - startedAt,
      usage: response.usage,
      validation: {
        accepted: validation.accepted,
        repaired: validation.repaired,
        errors: validation.errors
      }
    };
  } catch (error) {
    return {
      ok: false,
      output: safeFallbackOutput(input.npcId),
      provider: "fallback",
      model: "none",
      latencyMs: Date.now() - startedAt,
      usage: {
        inputTokens: Math.ceil(input.text.length / 4),
        outputTokens: 0,
        estimatedCost: 0
      },
      validation: {
        accepted: false,
        repaired: false,
        errors: [error instanceof Error ? error.message : "Unknown dialogue failure."]
      }
    };
  }
}

