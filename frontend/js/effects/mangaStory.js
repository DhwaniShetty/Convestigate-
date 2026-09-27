/**
 * MangaStory - Unified Interactive Manga Story Presentation Layer
 * Integrates reusable components:
 * - MangaPage: Multi-panel interactive comic page layout
 * - MangaPanel: Panel framing, ink borders, screentone dots, speed lines, active focus
 * - CharacterLayer: High-contrast noir character silhouettes, expressions, and metadata
 * - SpeechBubble: Speech, thought, and spiked shout dialogue bubbles with typewriter animation
 * - NarrationBox: Archival noir typewriter docket narration
 * - EvidencePanel: CCTV surveillance feed with scanlines / encrypted mobile phone telemetry
 * - StoryController: Beat-by-beat interactive reading controller across all 14 cases
 */
import {
  MangaPage,
  MangaPanel,
  CharacterLayer,
  SpeechBubble,
  NarrationBox,
  EvidencePanel,
  StoryController,
  storyController
} from './manga/index.js';

export {
  MangaPage,
  MangaPanel,
  CharacterLayer,
  SpeechBubble,
  NarrationBox,
  EvidencePanel,
  StoryController,
  storyController
};

export const mangaStory = storyController;
