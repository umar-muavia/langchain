import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const jsonSchema = z.object({
  facts: z.array(
    z.object({
      fact: z.string().min(10).describe("Detailed fact description"),
      category: z.enum(["technology", "history", "science"]),
      relevance: z.number().min(1).max(5)
    })
  ).length(3).describe("Exactly 3 facts"),
  summary: z.string().max(200),
  timestamp: z.string().datetime()
});

const parser = StructuredOutputParser.fromZodSchema(jsonSchema);

const template = new PromptTemplate({
  template: "Generate research facts about {topic} \n{format_instructions}",
  inputVariables: ["topic"],
  partialVariables: { 
    format_instructions: parser.getFormatInstructions() 
  },
});

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-haiku-20240307",
  temperature: 0.3,
});

const chain = template.pipe(model).pipe(parser);

const result = await chain.invoke({ 
  topic: "Artificial Intelligence" 
});

console.log(result);

  