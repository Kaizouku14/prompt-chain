import { personaType } from "@/constants/persona";

export interface MessageProps {
  threadId: string;
  message: string;
  file?: File | null;
  persona: personaType;
}

export interface ChatProps {
  threadId: string;
  message: string;
  setMessage: (message: string) => void;
  addToConversation: (message?: string, response?: string, file?: File | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export interface ChatBubbleProps {
  conversation: Array<{ message?: string; response?: string; file?: File | null }>;
  isLoading: boolean;
}

export interface ConversationMessage {
  message?: string;
  response?: string;
  file?: File | null;
}
