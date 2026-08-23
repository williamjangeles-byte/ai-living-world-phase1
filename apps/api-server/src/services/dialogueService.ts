/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { LanguageModelProvider } from "../../../../packages/provider-interfaces/src/LanguageModelProvider.ts";
import type { DialogueInput, DialogueTurnResult, EngineAdapter } from "../../../../packages/shared-types/src/dialogue.ts";
import { runDialogueTurn } from "../../../../packages/dialogue-engine/src/runDialogueTurn.ts";

export type DialogueService = {
  submitTypedDialogue(input: DialogueInput): Promise<DialogueTurnResult>;
};

export function createDialogueService(engine: EngineAdapter, provider: LanguageModelProvider): DialogueService {
  return {
    submitTypedDialogue(input: DialogueInput): Promise<DialogueTurnResult> {
      return runDialogueTurn(input, engine, provider);
    }
  };
}


