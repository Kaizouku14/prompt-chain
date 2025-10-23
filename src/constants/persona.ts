export const Persona = ["Auto", "Playful", "Expert", "Minimalist"] as const;
export type personaType = (typeof Persona)[number];

export enum PERSONA {
  AUTO = "Auto",
  PLAYFUL = "playful",
  EXPERT = "Expert",
  MINIMALIST = "Minimalist",
}
