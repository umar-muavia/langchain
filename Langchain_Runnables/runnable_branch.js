// import { ChatAnthropic } from "@langchain/anthropic";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { RunnableSequence, RunnableParallel, RunnablePassthrough , RunnableBranch } from "@langchain/core/runnables";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import path from "path";

// // __dirname simulate karna (ESM me)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });

// const prompt1 = new PromptTemplate({
//   template: "Write a detailed report on {topic} without any extra text",
//   inputVariables: ["topic"],
// });

// const prompt2 = new PromptTemplate({
//    template: "Summarize the following text \n {text}",
//   inputVariables: ["text"],
// });

// const model = new ChatAnthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
//   model: "claude-3-5-haiku-20241022",
// });

// const parser = new StringOutputParser();

// const report_gen_chain = RunnableSequence.from([prompt1, model, parser]);

// const runnable_branch = RunnableBranch.from({
//     (lambda x: len(x.split()) > 500, RunnableSequence.from([prompt2, model, parser])),
//     new RunnablePassthrough()
// })

// const final_chain = RunnableSequence.from([ report_gen_chain, runnable_branch ]);

// const result = await final_chain.invoke({ topic: "Cricket" });
// console.log(result);
