import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// __dirname simulate karna (ESM me)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Step 1: Joke prompt
const prompt = new PromptTemplate({
  template: "Write a joke about {topic} without any extra text or explanations.",
  inputVariables: ["topic"],
});

// Step 2: Claude model
const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

// Step 3: Output parser
const parser = new StringOutputParser();

// Step 4: Joke explanation prompt
const prompt2 = new PromptTemplate({
  template: "Explain the following joke - {text}",
  inputVariables: ["text"],
});

// Step 5: Sequence with mapping step
const chain = RunnableSequence.from([
  prompt,
  model,
  parser,
  (joke) => ({ text: joke }), // mapping step
  prompt2,
  model,
  parser,
]);

// Run
const result = await chain.invoke({ topic: "cats" });
console.log(result);
