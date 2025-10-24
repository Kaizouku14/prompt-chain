"use client";

import { useState } from "react";
import Chat from "./_components/chat";
import ChatBubble from "./_components/chat-bubble";
import { Button } from "@/components/ui/button";
import { ConversationMessage } from "@/interfaces/chat";
import { generateId } from "@/lib/utils";

const Home = () => {
  const [threadId, setThreadId] = useState<string>(generateId());
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToConversation = (newMessage?: string, newResponse?: string, file?: File | null) => {
    setConversation((prev) => [...prev, { message: newMessage, response: newResponse, file }]);
    setIsLoading(false);
  };

  const clearConversation = () => {
    const newThreadId = generateId();
    setThreadId(newThreadId);
    setConversation([]);
    setMessage("");
    setIsLoading(false);
  };

  return (
    <div className="border-border flex h-auto w-full max-w-xl flex-col gap-2 rounded-xl border p-4 shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-medium">Prompt or Upload PDF</h1>
        {conversation.length > 0 && (
          <Button onClick={clearConversation} className="text-sm">
            New Chat
          </Button>
        )}
      </div>
      <ChatBubble conversation={conversation} isLoading={isLoading} />
      <Chat
        threadId={threadId}
        message={message}
        addToConversation={addToConversation}
        setMessage={setMessage}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default Home;
