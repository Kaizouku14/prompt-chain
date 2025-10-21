export interface ChatProps {
  message: string;
  setMessage: (message: string) => void;
  addToConversation: (message: string, response: string, file?: File) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export interface ChatBubbleProps {
  conversation: Array<{ message: string; response: string; file?: File }>;
  isLoading: boolean;
}

export interface ConversationMessage {
  message: string;
  response: string;
  file?: File;
}
