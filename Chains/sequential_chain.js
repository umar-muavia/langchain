import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
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
  template: "Generate a detailed report on {topic}.",
  inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
  template: "Generate a 5 pointer summary of the following text \n {text}",
  inputVariables: ["text"],
});

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = new StringOutputParser();

const chain = prompt1
  .pipe(model)
  .pipe(parser)
  .pipe((report) => ({ text: report })) // map report → { text }
  .pipe(prompt2)
  .pipe(model)
  .pipe(parser);

const result = await chain.invoke({ topic: "Dog" });

console.log(result);