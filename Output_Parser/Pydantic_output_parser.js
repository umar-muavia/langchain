import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// __dirname simulation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Zod schema
const schema = z.object({
  facts: z.array(z.string()).length(3)
});

// Parser
const parser = StructuredOutputParser.fromZodSchema(schema);

// Prompt
const template = new PromptTemplate({
 template: "Give 3 facts about the topic: {topic}.\n{format_instructions}",
  inputVariables: ["topic"],
  partialVariables: { format_instructions: parser.getFormatInstructions() }
});

// Model
const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
  temperature: 0.3
});

// Chain
const chain = template.pipe(model).pipe(parser);

// Execute
try {
  const result = await chain.invoke({ topic: "Artificial Intelligence" });
  console.log(result);
} catch (error) {
  console.error("Error:", error);
}