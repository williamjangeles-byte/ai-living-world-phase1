/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
import type { CharacterRecord, EmotionKey } from "../../shared-types/src/character.ts";

const emotionKeys: EmotionKey[] = [
  "valence",
  "arousal",
  "dominance",
  "trust",
  "fear",
  "anger",
  "sadness",
  "curiosity",
  "affection",
  "suspicion"
];

export type ValidationResult<T> = {
  ok: boolean;
  value?: T;
  errors: string[];
};

export function validateCharacterRecord(value: unknown): ValidationResult<CharacterRecord> {
  const errors: string[] = [];
  if (!isObject(value)) return { ok: false, errors: ["Character record must be an object."] };

  const profile = value.profile;
  const runtime = value.runtime;
  if (!isObject(profile)) errors.push("profile must be an object.");
  if (!isObject(runtime)) errors.push("runtime must be an object.");
  if (errors.length) return { ok: false, errors };

  requireString(profile, "id", errors);
  requireString(profile, "name", errors);
  requireString(profile, "occupation", errors);
  requireString(profile, "speechStyle", errors);
  requireStringArray(profile, "knowledgeBoundaries", errors);
  requireStringArray(profile, "forbiddenBehaviors", errors);
  requireEmotion(profile.defaultEmotion, "profile.defaultEmotion", errors);
  requireEmotion(runtime.emotionalState, "runtime.emotionalState", errors);
  requireString(runtime, "currentLocationId", errors);
  requireBoolean(runtime, "availableToTalk", errors);

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: value as CharacterRecord, errors: [] };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(target: Record<string, unknown>, field: string, errors: string[]): void {
  if (typeof target[field] !== "string" || target[field] === "") {
    errors.push(`${field} must be a non-empty string.`);
  }
}

function requireBoolean(target: Record<string, unknown>, field: string, errors: string[]): void {
  if (typeof target[field] !== "boolean") {
    errors.push(`${field} must be a boolean.`);
  }
}

function requireStringArray(target: Record<string, unknown>, field: string, errors: string[]): void {
  const value = target[field];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${field} must be an array of strings.`);
  }
}

function requireEmotion(value: unknown, label: string, errors: string[]): void {
  if (!isObject(value)) {
    errors.push(`${label} must be an object.`);
    return;
  }

  for (const key of emotionKeys) {
    const amount = value[key];
    if (typeof amount !== "number" || amount < -1 || amount > 1) {
      errors.push(`${label}.${key} must be a number from -1 to 1.`);
    }
  }
}


