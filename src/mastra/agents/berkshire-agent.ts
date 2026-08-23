// import "dotenv/config";
// import { Agent } from "@mastra/core/agent";
// import { createGroq } from "@ai-sdk/groq";
// import { PgVector } from "@mastra/pg";
// import { createVectorQueryTool } from "@mastra/rag";
// const ollamaProvider = createOllama();

// const groq = createGroq({
//   apiKey: process.env.GROQ_API_KEY!,
// });

// const pgVector = new PgVector({
//   id: "pg_vector_store",
//   connectionString: process.env.POSTGRES_CONNECTION_STRING!,
// });

// import ollama from "ollama";

// import { createOllama } from "ollama-ai-provider";
// const berkshireTool = createVectorQueryTool({
//   vectorStore: pgVector,
//   indexName: "berkshire_letters",
//   model: {
//     async doEmbed(texts: string[]) {
//       const vectors: number[][] = [];

//       for (const text of texts) {
//         const res = await ollama.embeddings({
//           model: "nomic-embed-text",
//           prompt: text,
//         });

//         vectors.push(res.embedding);
//       }

//       return vectors;
//     },
//   },
// });

// export const berkshireAgent = new Agent({
//   id: "berkshire-agent",
//   name: "Berkshire Hathaway Agent",

//   instructions: `You are an expert financial analyst specializing in Warren Buffett's 
// investment philosophy and Berkshire Hathaway's business strategy.

// You have access to Warren Buffett's shareholder letters from 1977 to 2024.

// When answering questions:
// - Always cite which year's letter you're referencing
// - Be specific and use actual quotes when possible
// - Explain concepts in simple terms
// - Focus on timeless investment principles`,

//   // model: groq.languageModel("llama-3.3-70b-versatile"),
//   model: ollamaProvider("llama3:latest"),

//   tools: {
//     berkshireTool,
//   },
// });

// import "dotenv/config";
// import { Agent } from "@mastra/core/agent";
// import { PgVector } from "@mastra/pg";
// import { createVectorQueryTool } from "@mastra/rag";
// import ollama from "ollama";
// import { createOllama } from "ollama-ai-provider";

// const ollamaProvider = createOllama();

// const pgVector = new PgVector({
//   id: "pg_vector_store",
//   connectionString: process.env.POSTGRES_CONNECTION_STRING!,
// });

// // const berkshireTool = createVectorQueryTool({
// //   vectorStore: pgVector,
// //   indexName: "berkshire_letters",
// //   model: {
// //     async doEmbed(texts: string[]) {
// //       const vectors: number[][] = [];

// //       for (const text of texts) {
// //         const res = await ollama.embeddings({
// //           model: "nomic-embed-text",
// //           prompt: text,
// //         });

// //         vectors.push(res.embedding);
// //       }

// //       return vectors;
// //     },
// //   },
// // });
// const berkshireTool = createVectorQueryTool({
//   vectorStore: pgVector,
//   indexName: "berkshire_letters",
//   model: ollamaProvider.embedding("nomic-embed-text"),
// });

// export const berkshireAgent = new Agent({
//   id: "berkshire-agent",
//   name: "Berkshire Hathaway Agent",

//   instructions: `You are an expert financial analyst specializing in Warren Buffett's 
// investment philosophy and Berkshire Hathaway's business strategy.

// You have access to Warren Buffett's shareholder letters from 1977 to 2024.

// When answering questions:
// - Always cite which year's letter you're referencing
// - Be specific and use actual quotes when possible
// - Explain concepts in simple terms
// - Focus on timeless investment principles`,

//   model: ollamaProvider("qwen/qwen3.6-27b"),

//   tools: {
//     berkshireTool,
//   },
// });

import "dotenv/config";
import { Agent } from "@mastra/core/agent";
import { createGroq } from "@ai-sdk/groq";
import { PgVector } from "@mastra/pg";
import { createVectorQueryTool } from "@mastra/rag";
import { createOllama } from "ollama-ai-provider";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

const ollamaProvider = createOllama();

const pgVector = new PgVector({
  id: "pg_vector_store",
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
});

const berkshireTool = createVectorQueryTool({
  vectorStore: pgVector,
  indexName: "berkshire_letters",
  model: ollamaProvider.embedding("nomic-embed-text"),
});

export const berkshireAgent = new Agent({
  id: "berkshire-agent",
  name: "Berkshire Hathaway Agent",

  instructions: `You are an expert financial analyst specializing in Warren Buffett's 
investment philosophy and Berkshire Hathaway's business strategy.

You have access to Warren Buffett's shareholder letters from 1977 to 2024.

When answering questions:
- Always cite which year's letter you're referencing
- Be specific and use actual quotes when possible
- Explain concepts in simple terms
- Focus on timeless investment principles`,

  model: groq.languageModel("qwen/qwen3.6-27b"),

  tools: {
    berkshireTool,
  },
});