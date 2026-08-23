/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueInput, DialogueTurnResult } from "../../../../packages/shared-types/src/dialogue.ts";

export type DialogueClient = {
  submit(input: DialogueInput): Promise<DialogueTurnResult>;
};

export type NpcDialogueState = {
  busy: boolean;
  lastResult?: DialogueTurnResult;
  error?: string;
};

export function createNpcDialogueController(client: DialogueClient) {
  const state: NpcDialogueState = { busy: false };

  return {
    state,
    async send(input: DialogueInput): Promise<DialogueTurnResult | undefined> {
      state.busy = true;
      state.error = undefined;
      try {
        const result = await client.submit(input);
        state.lastResult = result;
        return result;
      } catch (error) {
        state.error = error instanceof Error ? error.message : "Dialogue failed.";
        return undefined;
      } finally {
        state.busy = false;
      }
    }
  };
}


