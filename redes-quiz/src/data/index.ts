import { TOPIC, flashcards } from "./clase1";
import { TOPIC2, flashcardsClase2 } from "./clase2";
import { TOPIC3, flashcardsClase3 } from "./clase3";
import { TOPIC4, flashcardsClase4 } from "./clase4";
import { TOPIC5, flashcardsClase5 } from "./clase5";
import { TOPIC6, flashcardsClase6 } from "./clase6";
import { TOPIC7, flashcardsClase7 } from "./clase7";
import { TOPIC8, flashcardsClase8 } from "./clase8";
import { TOPIC9, flashcardsClase9 } from "./clase9";
import {
  TOPIC_PARCIAL_LAN,
  TOPIC_PARCIAL_IP,
  TOPIC_PARCIAL_TRANSPORTE,
  flashcardsParcialLAN,
  flashcardsParcialIP,
  flashcardsParcialTransporte,
} from "./parciales";
import type { Flashcard } from "./clase1";

export type { Flashcard };

export interface Topic {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  emoji: string;
  flashcards: Flashcard[];
  isParcial?: boolean;
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
  {
    slug: "wifi-arq",
    emoji: "📶",
    ...TOPIC4,
    flashcards: flashcardsClase4,
  },
  {
    slug: "routing-fragmentacion",
    emoji: "🗺️",
    ...TOPIC5,
    flashcards: flashcardsClase5,
  },
  {
    slug: "vlsm-dhcp-dns",
    emoji: "🌐",
    ...TOPIC6,
    flashcards: flashcardsClase6,
  },
  {
    slug: "http-tls-jwt",
    emoji: "🔒",
    ...TOPIC7,
    flashcards: flashcardsClase7,
  },
  {
    slug: "cableado-estructurado",
    emoji: "🔌",
    ...TOPIC8,
    flashcards: flashcardsClase8,
  },
  {
    slug: "wlan-avanzado",
    emoji: "📡",
    ...TOPIC9,
    flashcards: flashcardsClase9,
  },
  {
    slug: "parcial-lan-stp-wireless",
    emoji: "📋",
    ...TOPIC_PARCIAL_LAN,
    flashcards: flashcardsParcialLAN,
    isParcial: true,
  },
  {
    slug: "parcial-ip-direccionamiento",
    emoji: "📋",
    ...TOPIC_PARCIAL_IP,
    flashcards: flashcardsParcialIP,
    isParcial: true,
  },
  {
    slug: "parcial-transporte-ipv6",
    emoji: "📋",
    ...TOPIC_PARCIAL_TRANSPORTE,
    flashcards: flashcardsParcialTransporte,
    isParcial: true,
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
