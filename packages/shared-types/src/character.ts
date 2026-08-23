/* This Source Code Form is subject to the Mozilla Public License, v. 2.0. Copyright © 2026 williamjangeles-byte. */
export type EmotionKey =
  | "valence"
  | "arousal"
  | "dominance"
  | "trust"
  | "fear"
  | "anger"
  | "sadness"
  | "curiosity"
  | "affection"
  | "suspicion";

export type EmotionState = Record<EmotionKey, number>;

export type VoiceProfile = {
  providerVoiceId: string;
  style: string;
  speed: number;
};

export type RelationshipLink = {
  targetEntityId: string;
  familiarity: number;
  trust: number;
  respect: number;
  fear: number;
  affection: number;
  hostility: number;
  sharedHistory: string[];
};

export type CharacterProfile = {
  id: string;
  name: string;
  ageCategory: string;
  species: string;
  occupation: string;
  faction: string;
  biography: string;
  personalityTraits: string[];
  values: string[];
  beliefs: string[];
  fears: string[];
  desires: string[];
  secrets: string[];
  speechStyle: string;
  vocabularyLevel: string;
  humorStyle: string;
  knowledgeBoundaries: string[];
  skills: string[];
  voice: VoiceProfile;
  defaultEmotion: EmotionState;
  moralConstraints: string[];
  longTermGoals: string[];
  forbiddenBehaviors: string[];
  narrativeRole: string;
  relationships: RelationshipLink[];
};

export type CharacterRuntimeState = {
  currentLocationId: string;
  currentAction: string;
  currentTargetId?: string;
  emotionalState: EmotionState;
  energy: number;
  stress: number;
  trustTowardPlayer: number;
  currentShortTermGoal: string;
  activeMemoryIds: string[];
  recentPerceptionIds: string[];
  currentConversationId?: string;
  currentScheduleEntry: string;
  status: string;
  alertness: number;
  availableToTalk: boolean;
};

export type CharacterRecord = {
  profile: CharacterProfile;
  runtime: CharacterRuntimeState;
};


