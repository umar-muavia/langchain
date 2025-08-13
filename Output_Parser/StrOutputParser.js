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
  template: "Write a brief report on the topic: {topic} without any bullet points and in a single paragraph",
  inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
  template: "Write a 5 line summary in bullet points on the following text \n {text}",
  inputVariables: ["text"],
});


const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = new StringOutputParser();

const chain = prompt1.pipe(model).pipe(parser).pipe((report) => ({ text: report })).pipe(prompt2).pipe(model).pipe(parser);

const result = await chain.invoke({ topic: "cats" });

console.log(result);