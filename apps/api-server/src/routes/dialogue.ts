/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueInput, DialogueTurnResult } from "../../../../packages/shared-types/src/dialogue.ts";
import type { DialogueService } from "../services/dialogueService.ts";

export type HttpLikeResponse<T> = {
  status: number;
  body: T;
};

export async function postDialogueRoute(
  body: unknown,
  service: DialogueService
): Promise<HttpLikeResponse<DialogueTurnResult | { error: string }>> {
  const input = parseDialogueInput(body);
  if (!input.ok) return { status: 400, body: { error: input.error } };

  const result = await service.submitTypedDialogue(input.value);
  return { status: result.ok ? 200 : 422, body: result };
}

type ParseResult =
  | { ok: true; value: DialogueInput }
  | { ok: false; error: string };

function parseDialogueInput(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Request body must be an object." };
  }
  const record = body as Record<string, unknown>;
  const fields = ["worldId", "playerId", "npcId", "text", "idempotencyKey"];
  for (const field of fields) {
    if (typeof record[field] !== "string" || !record[field]) {
      return { ok: false, error: `${field} must be a non-empty string.` };
    }
  }
  return {
    ok: true,
    value: {
      worldId: record.worldId as string,
      playerId: record.playerId as string,
      npcId: record.npcId as string,
      text: record.text as string,
      idempotencyKey: record.idempotencyKey as string
    }
  };
}


