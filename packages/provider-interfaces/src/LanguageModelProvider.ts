/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueContext, DialogueOutput } from "../../shared-types/src/dialogue.ts";

export type LanguageModelRequest = {
  context: DialogueContext;
  maxOutputTokens: number;
};

export type LanguageModelResponse = {
  output: unknown;
  provider: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
};

export type LanguageModelProvider = {
  completeDialogue(request: LanguageModelRequest): Promise<LanguageModelResponse>;
};

export class ScriptedBlacksmithProvider implements LanguageModelProvider {
  async completeDialogue(request: LanguageModelRequest): Promise<LanguageModelResponse> {
    const npcId = request.context.character.profile.id;
    const playerText = request.context.input.text.toLowerCase();
    const knowsMine = playerText.includes("mine") || playerText.includes("wagon") || playerText.includes("tool");
    const text = knowsMine
      ? "If it concerns tools or the mine road, speak plainly. I trust steel marks more than town gossip."
      : "Make it quick. The forge is hot, and good iron does not wait for speeches.";

    const output: DialogueOutput = {
      npcId,
      text,
      emotion: knowsMine ? "suspicious" : "focused",
      subtitle: text,
      animation: knowsMine ? "fold-arms" : "hammer-pause",
      actions: []
    };

    return {
      output,
      provider: "scripted",
      model: "blacksmith-phase1",
      usage: {
        inputTokens: Math.ceil(request.context.input.text.length / 4),
        outputTokens: Math.ceil(text.length / 4),
        estimatedCost: 0
      }
    };
  }
}


