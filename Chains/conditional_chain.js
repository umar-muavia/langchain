// import { ChatAnthropic } from "@langchain/anthropic";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser, StructuredOutputParser  } from "@langchain/core/output_parsers";
// import { RunnableBranch } from "@langchain/core/runnables";
// import { z } from "zod";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";

// // __dirname simulate karna (ESM me)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });

// const model = new ChatAnthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   model: "claude-3-5-haiku-20241022",
// });

// // Zod schema for structured output
// const FeedbackSchema = z.object({
//   sentiment: z.enum(["Positive", "Negative"]),
// });

// const parser = new StringOutputParser();
// const parser2 = StructuredOutputParser.fromZodSchema(FeedbackSchema);

// const prompt1 = new PromptTemplate({
//   template: "Classify the sentiment of the following feedback text into Positive or Negative.\nFeedback: {feedback}\nFormat: {format_instructions}",
//   inputVariables: ["feedback"],
//   partialVariables: {
//     format_instructions: parser2.getFormatInstructions(),
//   },
// });

// const prompt2 = new PromptTemplate({
//   template: "Write an appropriate response to this possitive feedback \n {feedback}",
//   inputVariables: ["feedback"],
// });

// const prompt3 = new PromptTemplate({
//   template: "Write an appropriate response to this negative feedback \n {feedback}",
//   inputVariables: ["feedback"],
// });

// // Chain
// const classifier_chain = prompt1.pipe(model).pipe(parser2);

// const branch_chain = RunnableBranch.from([
//   [
//     (input) => input.sentiment === "Positive",
//     prompt2.pipe(model).pipe(parser)
//   ],
//   [
//     (input) => input.sentiment === "Negative",
//     prompt3.pipe(model).pipe(parser)
//   ],
//   async () => "Could not determine sentiment"
// ]);

// // Final chain
// const final_chain = classifier_chain.pipe(branch_chain);

// const result = await final_chain.invoke({
//   feedback: "I love the new features of this product!",
// });

// console.log(result);
