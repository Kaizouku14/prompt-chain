import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const buildUserMessage = (message: string, chunks: string[]): string => {
  if (!chunks.length) return `User said: ${message}`;
  return [`User said: ${message}`, `\n\nHere is the content of the uploaded file:`, chunks.join("\n\n")].join("\n");
};
