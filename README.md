📈 Berkshire Hathaway RAG Application
A Retrieval-Augmented Generation (RAG) application that answers questions about Warren Buffett's investment philosophy using all 48 Berkshire Hathaway shareholder letters (1977–2024).
Built with Mastra, Groq, Ollama, and PostgreSQL + pgvector.

🧠 What This Project Does

Reads all 48 Berkshire Hathaway shareholder letters (PDF format)
Splits them into small chunks of text
Converts each chunk into vector embeddings using Ollama (locally, for free!)
Stores everything in a PostgreSQL database with pgvector
When you ask a question, it finds the most relevant chunks and uses Groq AI to answer


🗂️ Project Structure
berkshire-rag/
├── letters/              ← 48 PDF files (1977–2024)
├── src/
│   ├── ingest.ts         ← Script to process PDFs and store in DB
│   ├── mastra/
│   │   ├── agents/
│   │   │   ├── berkshire-agent.ts   ← Our Berkshire AI Agent
│   │   │   └── weather-agent.ts     ← Default sample agent
│   │   ├── tools/
│   │   ├── workflows/
│   │   └── index.ts      ← Mastra configuration
│   └── type/
│       └── pdf-parse-fork.d.ts   ← TypeScript type declaration
├── .env                  ← API keys and DB connection
├── package.json
└── README.md

🛠️ Tech Stack
ToolPurposeMastraAI agent frameworkGroqFree LLM API (llama-3.3-70b-versatile)OllamaLocal embedding model (nomic-embed-text)PostgreSQL + pgvectorVector database storageDockerRuns PostgreSQL containerpdf-parse-forkExtracts text from PDFsTypeScriptProgramming languageNode.jsRuntime environment

⚙️ Prerequisites
Make sure these are installed on your machine:

Node.js v18+
Docker Desktop
Ollama
Git


🚀 First Time Setup
1. Clone the project
bashgit clone <your-repo-url>
cd berkshire-rag
2. Install dependencies
bashnpm install
3. Setup environment variables
Create a .env file in root folder:
envGROQ_API_KEY=your_groq_api_key_here
POSTGRES_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/mastra_rag_db
Get your free Groq API key at: https://console.groq.com
4. Start PostgreSQL with pgvector using Docker
bash# First time only - create the container
docker run -d \
  --name pgvector-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  pgvector/pgvector:pg16
5. Create the database
bash# Enter the container
docker exec -it pgvector-db psql -U postgres

# Inside psql, run:
CREATE DATABASE mastra_rag_db;
\c mastra_rag_db
CREATE EXTENSION vector;
\q
6. Download Ollama embedding model
bashollama pull nomic-embed-text
7. Add PDF letters
Place all 48 Berkshire Hathaway PDF letters in the letters/ folder.
8. Run ingestion (ONE TIME ONLY!)
bashnpx tsx src/ingest.ts
This will:

Read all 48 PDFs
Extract text
Create embeddings using Ollama
Store everything in PostgreSQL

⚠️ This takes 20–30 minutes. Only needs to be done once!

🔄 Daily Startup (Every Time You Work)
bash# 1. Start Docker Desktop (open the app)

# 2. Start the database container
docker start pgvector-db

# 3. Make sure Ollama is running (it auto-starts usually)
ollama serve

# 4. Start Mastra development server
npm run dev

# 5. Open Mastra Studio in browser
# Go to: http://localhost:4111

💬 Using The Agent

Open http://localhost:4111
Click on Berkshire Hathaway Agent
Ask questions like:

"What does Warren Buffett say about long term investing?"
"What was Buffett's biggest mistake?"
"How does Buffett evaluate a business?"
"What does Buffett think about stock market volatility?"




📦 All NPM Packages Installed
bash# Core Mastra packages (auto-installed with create-mastra)
npm install

# PDF processing
npm install pdf-parse-fork

# RAG and vector storage
npm install @mastra/rag @mastra/pg

# Ollama for local embeddings
npm install ollama

# PostgreSQL client
npm install pg @types/pg

# AI SDK packages
npm install @ai-sdk/groq @ai-sdk/openai ai

🐳 Docker Commands Reference
bash# Check if container is running
docker ps

# Start the database container
docker start pgvector-db

# Stop the database container
docker stop pgvector-db

# Enter the database (psql shell)
docker exec -it pgvector-db psql -U postgres -d mastra_rag_db

# Check all containers (including stopped)
docker ps -a

# View container logs
docker logs pgvector-db

🗄️ Database Commands Reference
bash# Enter database
docker exec -it pgvector-db psql -U postgres -d mastra_rag_db

# Inside psql:
\dt                          # list all tables
SELECT COUNT(*) FROM berkshire_letters;   # count stored chunks
DROP TABLE IF EXISTS berkshire_letters;   # delete all data
\q                           # exit psql

🤖 Ollama Commands Reference
bash# Check installed models
ollama list

# Download embedding model
ollama pull nomic-embed-text

# Start Ollama server manually
ollama serve

# Check Ollama version
ollama --version

🔧 Troubleshooting
Ollama connection refused
bash# Ollama is not running, start it:
ollama serve
Docker container not found
bash# Check if container exists
docker ps -a

# If missing, recreate it (see First Time Setup step 4)
Database dimension mismatch error
bash# Delete old table and re-ingest
docker exec -it pgvector-db psql -U postgres -d mastra_rag_db
DROP TABLE IF EXISTS berkshire_letters;
\q
npx tsx src/ingest.ts
Port 11434 already in use (Ollama)
This is fine! It means Ollama is already running ✅
Port 5432 already in use (PostgreSQL)
bash# Check what's using it
docker ps
# If pgvector-db is already running, you're good!

📊 Ingestion Stats
Year RangeLettersAvg Chunks1977–199014~150 chunks each1991–200515~180 chunks each2006–202419~200 chunks eachTotal48~8,000+ chunks

🏗️ How RAG Works In This Project
User Question
     ↓
Convert question to vector embedding (Ollama)
     ↓
Search PostgreSQL for similar vectors
     ↓
Retrieve top matching text chunks
     ↓
Send chunks + question to Groq (llama-3.3-70b)
     ↓
Get answer with citations from Buffett's letters

🙏 Credits

Warren Buffett's shareholder letters — Berkshire Hathaway
Mastra — AI agent framework
Groq — Free LLM API
Ollama — Local AI models
pgvector — Vector similarity search

# OG Readme file ..............................................................................

# berkshire-rag

Welcome to your new [Mastra](https://mastra.ai/) project! We're excited to see what you'll build.

## Getting Started

Start the development server:

```shell
npm run dev
```

Open [http://localhost:4111](http://localhost:4111) in your browser to access [Mastra Studio](https://mastra.ai/docs/getting-started/studio). It provides an interactive UI for building and testing your agents, along with a REST API that exposes your Mastra application as a local service. This lets you start building without worrying about integration right away.

You can start editing files inside the `src/mastra` directory. The development server will automatically reload whenever you make changes.

## Learn more

To learn more about Mastra, visit our [documentation](https://mastra.ai/docs/). Your bootstrapped project includes example code for [agents](https://mastra.ai/docs/agents/overview), [tools](https://mastra.ai/docs/agents/using-tools), [workflows](https://mastra.ai/docs/workflows/overview), [scorers](https://mastra.ai/docs/evals/overview), and [observability](https://mastra.ai/docs/observability/overview).

If you're new to AI agents, check out our [course](https://mastra.ai/course) and [YouTube videos](https://youtube.com/@mastra-ai). You can also join our [Discord](https://discord.gg/BTYqqHKUrf) community to get help and share your projects.

## Deploy on Mastra Cloud

[Mastra Cloud](https://cloud.mastra.ai/) gives you a serverless agent environment with atomic deployments. Access your agents from anywhere and monitor performance. Make sure they don't go off the rails with evals and tracing.

Check out the [deployment guide](https://mastra.ai/docs/deployment/overview) for more details.
