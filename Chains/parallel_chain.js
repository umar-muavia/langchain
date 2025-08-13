import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";
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
  template: "Generate short and simple notes from the following text:\n{text}",
  inputVariables: ["text"], 
});

const prompt2 = new PromptTemplate({
  template: "Generate 5 short question and answers from the following text:\n{text}",
  inputVariables: ["text"],
});

const prompt3 = new PromptTemplate({
  template: "Merge the provided notes and questions into a single document:\nNotes:\n{notes}\n\nQuestions:\n{questions}",
  inputVariables: ["notes", "questions"],
});

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-haiku-20241022",
});

const parser = new StringOutputParser();

const parallel_chain = RunnableParallel.from({
  notes: prompt1.pipe(model).pipe(parser),
  questions: prompt2.pipe(model).pipe(parser),
});

const merge_chain = prompt3.pipe(model).pipe(parser);

const chain = parallel_chain.pipe(merge_chain);

const result = await chain.invoke({
  text: `One cannot deny the popularity of motorcycles in Pakistan. It can be easily judged by looking at any road in Pakistan that motorbikes are more preferred than cars. As the sales reports from Fiscal Year 2015-16 have made it pretty clear that bikes outsold the cars by a huge margin. There are many factors influencing this preference of motorbikes, primarily among them are the economical prices, chaotic traffic and the interest shown by the country’s youth.`,
});

console.log(result);
