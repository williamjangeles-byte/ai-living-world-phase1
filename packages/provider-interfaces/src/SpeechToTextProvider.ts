/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
export type SpeechToTextRequest = {
  audio: Uint8Array;
  mimeType: string;
  language: string;
};

export type SpeechToTextResponse = {
  transcript: string;
  provider: string;
  model: string;
};

export type SpeechToTextProvider = {
  transcribe(request: SpeechToTextRequest): Promise<SpeechToTextResponse>;
};


