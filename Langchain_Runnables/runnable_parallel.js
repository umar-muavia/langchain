import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableParallel } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// __dirname simulate karna (ESM me)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const prompt1 = new PromptTemplate({
  template: "Generate a tweet about {topic} without any extra text or explanations.",
  inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
  template: "Generate a LinkedIn post about {topic} without any extra text or explanations.",
  inputVariables: ["topic"],
});

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = new StringOutputParser();

const parallel_chain = RunnableParallel.from({
  tweet: RunnableSequence.from([prompt1, model, parser]),
  linkedin: RunnableSequence.from([prompt2, model, parser]),
});

const result = await parallel_chain.invoke({ topic: "AI" });
console.log(result);
