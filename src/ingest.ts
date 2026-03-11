// 1st attempt only injestion no embedding and db storage

// import * as fs from "fs";
// import * as path from "path";
// import { MDocument } from "@mastra/rag";
// import pdfParse from "pdf-parse-fork";

// async function ingestLetters() {
//   console.log("Starting ingestion...");

//   const lettersDir = path.join(process.cwd(), "letters");

//   const files = fs
//     .readdirSync(lettersDir)
//     .filter((f: string) => f.endsWith(".pdf"));

//   console.log(`Found ${files.length} PDF files`);

//   for (const file of files) {
//     console.log(`Processing ${file}...`);

//     const filePath = path.join(lettersDir, file);
//     const buffer = fs.readFileSync(filePath);

//     const pdfData = await pdfParse(buffer);

//     const doc = MDocument.fromText(pdfData.text, {
//       metadata: {
//         source: file,
//         year: path.basename(file, ".pdf"),
//       },
//     });

//     const chunks = await doc.chunk({
//       strategy: "recursive",
//       maxSize: 500,
//       overlap: 50,
//     });

//     console.log(`Created ${chunks.length} chunks from ${file}`);
//   }

//   console.log("Ingestion complete!");
// }

// ingestLetters().catch(console.error);

// 2nd attempt : no api billing (open api)

// import "dotenv/config";
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("OPENAI_API_KEY is missing in .env");
// }
// import * as fs from "fs";
// import * as path from "path";
// import { MDocument } from "@mastra/rag";
// import { PgVector } from "@mastra/pg";
// import { embedMany } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
// import pdfParse from "pdf-parse-fork";

// // OpenAI embedding model
// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const embeddingModel = openai.embedding("text-embedding-3-small");

// // pgvector connection
// const pgVector = new PgVector({
//   id: "pg_vector_store",
//   connectionString: process.env.POSTGRES_CONNECTION_STRING!,
// });

// async function ingestLetters() {
//   console.log("Starting ingestion...");

//   await pgVector.createIndex({
//     indexName: "berkshire_letters",
//     dimension: 1536,
//   });

//   const lettersDir = path.join(process.cwd(), "letters");

//   const files = fs
//     .readdirSync(lettersDir)
//     .filter((f: string) => f.endsWith(".pdf"));

//   console.log(`Found ${files.length} PDF files`);

//   for (const file of files) {
//     console.log(`Processing ${file}...`);

//     const filePath = path.join(lettersDir, file);
//     const buffer = fs.readFileSync(filePath);

//     const pdfData = await pdfParse(buffer);

//     const doc = MDocument.fromText(pdfData.text, {
//       metadata: {
//         source: file,
//         year: path.basename(file, ".pdf"),
//       },
//     });

//     const chunks = await doc.chunk({
//       strategy: "recursive",
//       maxSize: 500,
//       overlap: 50,
//     });

//     console.log(`Created ${chunks.length} chunks from ${file}`);

//     const { embeddings } = await embedMany({
//       model: embeddingModel,
//       values: chunks.map((c) => c.text),
//     });

//     await pgVector.upsert({
//       indexName: "berkshire_letters",
//       vectors: embeddings,
//       metadata: chunks.map((c) => ({
//         text: c.text,
//         source: file,
//         year: path.basename(file, ".pdf"),
//       })),
//     });

//     console.log(`Saved ${chunks.length} chunks to database from ${file} ✅`);
//   }

//   console.log("🎉 All letters ingested successfully!");
// }

// ingestLetters().catch(console.error);

// 3rd attempt: unsing ollama form embedding

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { MDocument } from "@mastra/rag";
import { PgVector } from "@mastra/pg";
import pdfParse from "pdf-parse-fork";
import ollama from "ollama";

// pgvector connection
const pgVector = new PgVector({
  id: "pg_vector_store",
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
});

async function ingestLetters() {
  console.log("Starting ingestion...");

  await pgVector.createIndex({
    indexName: "berkshire_letters",
    dimension: 768,
  });

  const lettersDir = path.join(process.cwd(), "letters");

  const files = fs
    .readdirSync(lettersDir)
    .filter((f: string) => f.endsWith(".pdf"));

  console.log(`Found ${files.length} PDF files`);

  for (const file of files) {
    console.log(`Processing ${file}...`);

    const filePath = path.join(lettersDir, file);
    const buffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(buffer);

    const doc = MDocument.fromText(pdfData.text, {
      metadata: {
        source: file,
        year: path.basename(file, ".pdf"),
      },
    });

    const chunks = await doc.chunk({
      strategy: "recursive",
      maxSize: 500,
      overlap: 50,
    });

    console.log(`Created ${chunks.length} chunks from ${file}`);
    // (Caused error due to heavy chunking in file 2013-2014
    // const embeddings = await Promise.all(
    //   chunks.map(async (chunk) => {
    //     const res = await ollama.embeddings({
    //       model: "nomic-embed-text",
    //       prompt: chunk.text,
    //     });
    //     return res.embedding;
    //   })
    // );
    // const embeddings = [];
    const embeddings: number[][] = [];
for (const chunk of chunks) {
  const res = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: chunk.text,
  });

  embeddings.push(res.embedding);
}
    await pgVector.upsert({
      indexName: "berkshire_letters",
      vectors: embeddings,
      metadata: chunks.map((c) => ({
        text: c.text,
        source: file,
        year: path.basename(file, ".pdf"),
      })),
    });

    console.log(`Saved ${chunks.length} chunks to database from ${file} ✅`);
  }

  console.log("🎉 All letters ingested successfully!");
}

ingestLetters().catch(console.error);