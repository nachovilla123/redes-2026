import { TOPIC, flashcards } from "./clase1";
import { TOPIC2, flashcardsClase2 } from "./clase2";
import { TOPIC3, flashcardsClase3 } from "./clase3";
import type { Flashcard } from "./clase1";

export type { Flashcard };

export interface Topic {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  emoji: string;
  flashcards: Flashcard[];
}

export const topics: Topic[] = [
  {
    slug: "intro",
    emoji: "📡",
    ...TOPIC,
    flashcards,
  },
  {
    slug: "arquitectura",
    emoji: "🏗️",
    ...TOPIC2,
    flashcards: flashcardsClase2,
  },
  {
    slug: "switches",
    emoji: "🔀",
    ...TOPIC3,
    flashcards: flashcardsClase3,
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
