import { Persona } from "@/constants/persona";
import { z } from "zod";

export const contextSchema = z.object({
  persona: z.enum(Persona),
});

export type ContextSchema = z.infer<typeof contextSchema>;
