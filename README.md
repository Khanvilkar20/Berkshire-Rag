## Berkshire Hathaway RAG Application
 
> A production-grade **Retrieval-Augmented Generation (RAG)** pipeline that answers questions about Warren Buffett's investment philosophy — grounded in all **48 Berkshire Hathaway shareholder letters (1977–2024)**.
 
![Tech Stack](https://img.shields.io/badge/Stack-Mastra%20%7C%20Groq%20%7C%20Ollama%20%7C%20pgvector-blue)
![Node](https://img.shields.io/badge/Node.js-v18%2B-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
 
---
## 🧠 Overview
 
This project ingests 48 years of Warren Buffett's shareholder letters, converts them into semantic vector embeddings, and stores them in a PostgreSQL vector database. At query time, it retrieves the most contextually relevant passages and synthesizes a precise, citation-backed answer using a large language model.
 
**Key capabilities:**
- Semantic search across 8,000+ text chunks from PDF documents
- Locally-run embeddings (zero API cost) via Ollama
- LLM-powered Q&A via Groq's free-tier API
- Fully containerized database with Docker + pgvector
- Interactive agent UI via Mastra Studio
---
## 🏗️ System Architecture
 
``` 
User Question
     │
     ▼
Embed question (Ollama → nomic-embed-text)
     │
     ▼
Vector similarity search (PostgreSQL + pgvector)
     │
     ▼
Retrieve top-k relevant chunks from Berkshire letters
     │
     ▼
Prompt construction (chunks + question)
     │
     ▼
LLM inference (Groq → llama-3.3-70b-versatile)
     │
     ▼
Structured answer with letter citations
```
 
---
 
## 🗂️ Project Structure
 
```
berkshire-rag/
│
├── letters/                 # 48 Berkshire Hathaway PDFs (1977–2024)
│
├── src/
│   ├── ingest.ts            # PDF → chunk → embed → store (run once)
│   │
│   └── mastra/
│       ├── agents/
│       │   ├── berkshire-agent.ts  # Core RAG agent
│       │   └── weather-agent.ts    # Sample agent
│       │
│       ├── tools/           # Custom tool definitions
│       ├── workflows/       # Mastra workflows
│       └── index.ts         # App entrypoint & config
│
├── src/type/
│   └── pdf-parse-fork.d.ts  # TypeScript type declarations
│
├── .env                     # API keys & DB URL (not committed)
├── package.json
└── README.md
```
 
---
 
## 🛠️ Tech Stack
 
| Layer | Technology | Purpose |
|---|---|---|
| **Agent Framework** | [Mastra](https://mastra.ai) | Agent orchestration & Studio UI |
| **LLM** | Groq (`llama-3.3-70b-versatile`) | Free-tier inference for Q&A |
| **Embeddings** | Ollama (`nomic-embed-text`) | Local, zero-cost vector generation |
| **Vector Store** | PostgreSQL + pgvector | Similarity search over chunks |
| **Infrastructure** | Docker | Portable, containerized DB setup |
| **PDF Parsing** | `pdf-parse-fork` | Text extraction from letter PDFs |
| **Language** | TypeScript + Node.js | Type-safe runtime |
 
---
## ⚙️ Prerequisites
 
Ensure the following are installed before proceeding:
 
- [Node.js v18+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Ollama](https://ollama.com)
- Git
---
 
## 🚀 Setup Guide
 
### 1. Clone the Repository
 
```bash
git clone <repo-url>
cd berkshire-rag
```
 
### 2. Install Dependencies
 
```bash
npm install
```
 
### 3. Configure Environment Variables
 
Create a `.env` file in the project root:
 
```env
GROQ_API_KEY=your_groq_api_key_here
POSTGRES_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/mastra_rag_db
```
 
> Get your free Groq API key at [console.groq.com](https://console.groq.com)
 
### 4. Start PostgreSQL with pgvector (Docker)
 
```bash
# Pull and start the container
docker run -d \
  --name pgvector-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  pgvector/pgvector:pg16
```
 
### 5. Initialize the Database
 
```bash
docker exec -it pgvector-db psql -U postgres
```
 
Inside the psql shell:
 
```sql
CREATE DATABASE mastra_rag_db;
\c mastra_rag_db
CREATE EXTENSION vector;
\q
```
 
### 6. Pull the Embedding Model
 
```bash
ollama pull nomic-embed-text
```
 
### 7. Add PDF Letters
 
Place all 48 Berkshire Hathaway shareholder letter PDFs inside the `letters/` directory.
 
### 8. Run the Ingestion Pipeline
 
> ⚠️ **One-time operation.** Takes approximately 20–30 minutes.
 
```bash
npx tsx src/ingest.ts
```
 
This pipeline will:
1. Parse all 48 PDFs and extract raw text
2. Chunk text into semantically meaningful segments
3. Generate vector embeddings via Ollama (locally)
4. Store all chunks + embeddings in PostgreSQL
---
 
## 🔄 Daily Startup Workflow
 
After initial setup, follow these steps each time you resume work:
 
```bash
# 1. Open Docker Desktop
 
# 2. Start the database container
docker start pgvector-db
 
# 3. Ensure Ollama is running
ollama serve
 
# 4. Start the Mastra development server
npm run dev
 
# 5. Open Mastra Studio
# Navigate to: http://localhost:4111
```
 
---
 
## 💬 Using the Agent
 
1. Open [http://localhost:4111](http://localhost:4111) in your browser
2. Select **Berkshire Hathaway Agent** from the agents list
3. Ask questions grounded in Buffett's letters:
```
"What does Warren Buffett say about long-term investing?"
"What was Buffett's biggest acknowledged mistake?"
"How does Buffett evaluate whether a business is worth buying?"
"How has Buffett's view on technology investments changed over time?"
```
### Demo
 
<img width="1903" height="920" alt="Screenshot 2026-04-19 194746" src="https://github.com/user-attachments/assets/e6a607b0-c022-49f5-931a-499c85ffc4fc" />
<br>

> *Agent answering a live question — pulling context directly from shareholder letters via vector search, then synthesizing with Groq LLM.*
 
---
 
 
## 📦 Package Reference
 
```bash
# Core framework
npm install
 
# PDF processing
npm install pdf-parse-fork
 
# RAG & vector storage
npm install @mastra/rag @mastra/pg
 
# Local embeddings
npm install ollama
 
# PostgreSQL client
npm install pg @types/pg
 
# AI SDK
npm install @ai-sdk/groq @ai-sdk/openai ai
```
 
---
 
## 🐳 Docker Reference
 
```bash
docker ps                        # List running containers
docker start pgvector-db         # Start the DB container
docker stop pgvector-db          # Stop the DB container
docker ps -a                     # Show all containers (including stopped)
docker logs pgvector-db          # View container logs
 
# Access the database shell
docker exec -it pgvector-db psql -U postgres -d mastra_rag_db
```
 
---
 
## 🗄️ Database Reference
 
```sql
\dt                                       -- List all tables
SELECT COUNT(*) FROM berkshire_letters;   -- Count stored chunks
DROP TABLE IF EXISTS berkshire_letters;   -- Reset ingestion data
\q                                        -- Exit psql shell
```
 
---
 
## 🤖 Ollama Reference
 
```bash
ollama list                  # List installed models
ollama pull nomic-embed-text # Download embedding model
ollama serve                 # Start Ollama server manually
ollama --version             # Print installed version
```
 
---
 
## 📊 Ingestion Statistics
 
| Year Range | Letters | Avg. Chunks/Letter |
|---|---|---|
| 1977–1990 | 14 | ~150 |
| 1991–2005 | 15 | ~180 |
| 2006–2024 | 19 | ~200 |
| **Total** | **48** | **8,000+ chunks** |
 
---
 
## 🔧 Troubleshooting
 
| Issue | Resolution |
|---|---|
| `Ollama connection refused` | Run `ollama serve` in a separate terminal |
| `Docker container not found` | Run `docker ps -a` — recreate if missing (see Step 4) |
| `dimension mismatch` error | Drop and re-ingest: `DROP TABLE IF EXISTS berkshire_letters;` then re-run `ingest.ts` |
| `Port 11434 already in use` | Ollama is already running — this is expected ✅ |
| `Port 5432 already in use` | Run `docker ps` — if `pgvector-db` is up, you're good ✅ |
 
---
 
## 🙏 Acknowledgements
 
- **Warren Buffett** — for 48 years of publicly available investment wisdom
- [Mastra](https://mastra.ai) — AI agent framework powering the pipeline
- [Groq](https://groq.com) — Free-tier LLM inference
- [Ollama](https://ollama.com) — Local embedding model hosting
- [pgvector](https://github.com/pgvector/pgvector) — Vector similarity search for PostgreSQL
  
