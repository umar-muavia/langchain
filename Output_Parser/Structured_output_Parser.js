import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  fact_1: "Fact 1 about the topic",
  fact_2: "Fact 2 about the topic",
  fact_3: "Fact 3 about the topic",
});

const template = new PromptTemplate({
  template: "Give 3 facts about the topic: {topic}.\n{format_instructions}",
  inputVariables: ["topic"],
  partialVariables: {
    format_instructions: parser.getFormatInstructions(),
  },
});

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({ topic: "Artificial Intelligence" });
console.log(result);
