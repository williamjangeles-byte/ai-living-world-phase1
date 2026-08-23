/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { DialogueTurnResult } from "../../../../packages/shared-types/src/dialogue.ts";

export type DialoguePanelProps = {
  npcName: string;
  inputText: string;
  busy: boolean;
  lastResult?: DialogueTurnResult;
  onInputTextChange(text: string): void;
  onSubmit(): void;
};

export function DialoguePanel(props: DialoguePanelProps) {
  return (
    <section aria-label={`${props.npcName} dialogue`}>
      <header>
        <h2>{props.npcName}</h2>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit();
        }}
      >
        <label>
          Message
          <textarea
            value={props.inputText}
            maxLength={1000}
            onChange={(event) => props.onInputTextChange(event.currentTarget.value)}
          />
        </label>
        <button type="submit" disabled={props.busy || !props.inputText.trim()}>
          Send
        </button>
      </form>
      {props.lastResult ? (
        <output aria-live="polite">
          <strong>{props.npcName}</strong>
          <p>{props.lastResult.output.subtitle}</p>
        </output>
      ) : null}
    </section>
  );
}


