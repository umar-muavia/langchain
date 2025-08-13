import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";
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
  template: "Write a joke about {topic} without any extra text or explanations.",
  inputVariables: ["topic"],
});

const prompt2 = new PromptTemplate({
   template: "Explain the following joke - {text} without any extra text or explanations.",
  inputVariables: ["text"],
});

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = new StringOutputParser();

const joke_gen_chain = RunnableSequence.from([prompt1, model, parser]);

const parallel_chain = RunnableParallel.from({
  "joke": new RunnablePassthrough(),
  "explanation": RunnableSequence.from([    
   (joke) => ({ text: joke }),
    prompt2, model, parser]),
});

const final_chain = RunnableSequence.from([ joke_gen_chain, parallel_chain ]);

const result = await final_chain.invoke({ topic: "Cricket" });
console.log(result);
