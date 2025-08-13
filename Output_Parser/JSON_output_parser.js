import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// __dirname simulate karna (ESM me)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const parser = new JsonOutputParser();

const template = new PromptTemplate({
  template:
    "You must ONLY reply with a valid JSON object, no extra text.\n" +
    "Give me the name, age, and city of a fictional person.\n{format_instructions}",
  inputVariables: [],
  partialVariables: {
    format_instructions: parser.getFormatInstructions(),
  },
});


const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

// const promptValue = await template.formatPromptValue({});

// const result = await model.invoke(promptValue);

// const parsed = await parser.parse(result.content);

// console.log(parsed);

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({});
console.log(result);
