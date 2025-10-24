"use server";

import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { ChatGroq } from "@langchain/groq";
import { MessageProps } from "@/interfaces/chat";
import { contextSchema, ContextSchema } from "./schema";
import { PERSONA } from "@/constants/persona";
import { MemorySaver } from "@langchain/langgraph";
import { buildPrompt } from "./prompt";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { buildUserMessage } from "./utils";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.65,
  maxTokens: 6124,
  maxRetries: 3,
});

const agent = createAgent({
  model,
  tools: [],
  contextSchema,
  checkpointer: new MemorySaver(),
  middleware: [
    dynamicSystemPromptMiddleware<ContextSchema>((_, runtime) => {
      const persona = runtime.context.persona || PERSONA.AUTO;
      return buildPrompt(persona);
    }),
  ],
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

export const sendMessage = async ({ threadId, message, file, persona }: MessageProps): Promise<string> => {
  const chunks = file ? await loadFileChunks(file) : [];
  const userMessage = buildUserMessage(message, chunks);
  const response = await agent.invoke(
    { messages: [{ role: "user", content: userMessage }] },
    { context: { persona }, configurable: { thread_id: threadId } },
  );

  return String(response.messages.at(-1)?.content ?? "");
};

export const loadFileChunks = async (file: File): Promise<string[]> => {
  try {
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    const chunks = await splitter.splitDocuments(docs);
    return chunks.map((chunk) => chunk.pageContent);
  } catch (err) {
    console.error("Error loading file:", err);
    return [];
  }
};
