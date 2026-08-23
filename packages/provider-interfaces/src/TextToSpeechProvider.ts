/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
export type TextToSpeechRequest = {
  text: string;
  voiceId: string;
  speed: number;
};

export type TextToSpeechResponse = {
  audioUrl: string;
  provider: string;
  model: string;
};

export type TextToSpeechProvider = {
  synthesize(request: TextToSpeechRequest): Promise<TextToSpeechResponse>;
};


