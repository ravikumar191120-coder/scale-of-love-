export type ScaleType =
  | 'eyes'
  | 'human'
  | 'landmark'
  | 'country'
  | 'planet'
  | 'star'
  | 'system'
  | 'giant-star'
  | 'galaxy'
  | 'supercluster'
  | 'universe'
  | 'heart';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  romanticFeedback: string;
}

export interface ScaleItem {
  id: string;
  order: number;
  type: ScaleType;
  title: string;
  hindiTitle: string;
  tagline: string;
  hindiTagline: string;
  mysteryTitle: string;
  mysteryTagline: string;
  sizeMeters: number;
  displaySize: string;
  scientificUnit: string;
  exponentPower: number;
  comparisonFact: string;
  romanticNote: string;
  imageUrl: string;
  imageAlt: string;
  // Romantic Quiz Question attributes
  quizQuestion: string;
  quizHint?: string;
  quizOptions: QuizOption[];
  revealedMessage: string;
  themeColor: {
    accent: string;
    glow: string;
    bgGlow: string;
    border: string;
  };
}

export interface UserMediaConfig {
  eyesImageUrl: string;
  bodyImageUrl: string;
  handHeartImageUrl: string;
  musicAudioUrl: string;
  gfName: string;
  nicknames: string[];
  gfHeightFt: string;
}
