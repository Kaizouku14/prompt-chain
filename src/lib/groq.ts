"use server";

import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { ChatGroq } from "@langchain/groq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { MessageProps } from "@/interfaces/chat";
import { contextSchema, ContextSchema } from "./schema";
import { personaPrompts } from "./utils";
import { PERSONA } from "@/constants/persona";
import { MemorySaver } from "@langchain/langgraph";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.65,
  maxTokens: 6124,
  maxRetries: 3,
});

const agent = createAgent({
  model,
  tools: [], //Add tools based on the user's needs
  contextSchema,
  checkpointer: new MemorySaver(),
  middleware: [
    dynamicSystemPromptMiddleware<ContextSchema>((_, runtime) => {
      const persona = runtime.context.persona || PERSONA.AUTO;
      return personaPrompts[persona];
    }),
  ],
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

export const sendMessage = async ({ message, file, persona }: MessageProps): Promise<string> => {
  const loader = file && new PDFLoader(file);
  const docs = await loader?.load();
  const chunks = await splitter.splitDocuments(docs || []);

  const userMessage = file
    ? `User said: ${message}\n\nHere is the content of the uploaded file:\n${chunks
        .map((chunk) => chunk.pageContent)
        .join("\n\n")}`
    : `User said: ${message}`;

  const response = await agent.invoke(
    { messages: [{ role: "user", content: userMessage }] },
    { context: { persona }, configurable: { thread_id: "1" } }, //Fix Thread ID
  );

  const assistantReply = String(response.messages.at(-1)?.content ?? "");
  return assistantReply;
};
