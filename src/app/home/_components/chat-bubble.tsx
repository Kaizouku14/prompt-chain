"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon } from "lucide-react";
import LoadingBubble from "./loading-bubble";
import { useRef, useEffect } from "react";
import { ChatBubbleProps } from "@/interfaces/chat";
import ReactMarkdown from "react-markdown";

const ChatBubble = ({ conversation, isLoading }: ChatBubbleProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  return (
    <ScrollArea className="h-80">
      <div className="border-border bg-card/50 flex w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-xl border px-4 shadow-sm backdrop-blur-sm h-80 py-6">
        {conversation.length === 0 && !isLoading ? (
          <div className="text-muted-foreground flex h-80 flex-col items-center justify-center py-8 text-sm">
            <p className="text-center">No conversation yet — start chatting!</p>
          </div>
        ) : (
          <>
            {conversation.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                {(item.message || item.file) && (
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-bold">
                      U
                    </div>
                    <div className="flex max-w-[80%] flex-col gap-2">
                      {item.message && (
                        <div className="bg-muted text-muted-foreground rounded-2xl px-3 py-2 text-sm">
                          {item.message}
                        </div>
                      )}
                      {item.file && (
                        <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-2xl px-3 py-2 text-sm">
                          <FileIcon className="size-4" />
                          <span className="truncate max-w-60">{item.file.name}</span>
                          <span className="text-xs">({(item.file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {item.response && (
                  <div className="flex items-start justify-end gap-3">
                    <div className="bg-primary/10 text-foreground max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-inner h-auto">
                      <pre className="font-sans whitespace-pre-wrap prose">
                        <ReactMarkdown>{item.response}</ReactMarkdown>
                      </pre>
                    </div>
                    <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-bold">
                      AI
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <LoadingBubble />}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </ScrollArea>
  );
};
export default ChatBubble;
