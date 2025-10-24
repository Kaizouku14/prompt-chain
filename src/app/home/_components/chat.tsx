"use client";

import { ChatProps } from "@/interfaces/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Persona, personaType } from "@/constants/persona";
import { sendMessage } from "@/lib/groq";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";

const Chat = ({ threadId, message, setMessage, addToConversation, setIsLoading }: ChatProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [persona, setPersona] = useState<personaType>("Auto");

  const handleSendMessage = async () => {
    try {
      if (message.trim() !== "" || selectedFile) {
        addToConversation(message, undefined, selectedFile);
        setIsLoading(true);

        const response = await sendMessage({
          threadId,
          message,
          file: selectedFile,
          persona,
        });

        addToConversation(undefined, response, undefined);
        setMessage("");
        setSelectedFile(null);
      }
    } catch (error: unknown) {
      toast.error((error as Error)?.message);
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    const MAX_FILE_SIZE = 1024 * 1024; // 1 MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum allowed size is 1 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  return (
    <InputGroup>
      <InputGroupTextarea
        placeholder="Ask questions to start a conversation"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon align="block-end">
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
        <InputGroupButton
          variant="outline"
          className="rounded-full"
          size="icon-xs"
          onClick={() => fileInputRef.current?.click()}
          title="Upload PDF"
        >
          <PlusIcon className="size-4" />
        </InputGroupButton>
        {selectedFile && (
          <span className="text-muted-foreground px-2 text-xs">{selectedFile.name.substring(0, 15)}...</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton variant="ghost">{persona}</InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="[--radius:0.95rem]">
            {Persona.map((persona) => (
              <DropdownMenuItem key={persona} onClick={() => setPersona(persona)}>
                {persona}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupText className="ml-auto">kaizodevx</InputGroupText>
        <Separator orientation="vertical" className="bg-foreground h-4" />
        <InputGroupButton variant="default" className="rounded-full" size="icon-xs" onClick={handleSendMessage}>
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Chat;
