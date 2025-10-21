"use server";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.65,
  maxTokens: 6124,
  maxRetries: 3,
});

export const chatMessage = async ({ input, file, persona }: { input: string; file?: string; persona: string }) => {
  const userMessage = file
    ? `User said: ${input}\n\nHere is the content of the uploaded file:\n${file}`
    : `User said: ${input}`;

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `${persona} You are a helpful assistant who explains information in a clear, structured way.
       If a file is provided, review and summarize its key insights accurately.
       If no file is provided, simply respond to the user's question naturally.`,
    ],
    ["user", userMessage],
  ]);

  const chain = chatPrompt.pipe(llm).pipe(new StringOutputParser());
  const response = await chain.invoke({ input, file, persona });
  return response;
};
