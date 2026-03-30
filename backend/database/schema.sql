CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_documents (

    id UUID PRIMARY KEY,

    content TEXT,

    embedding vector(1536),

    source TEXT

);

CREATE TABLE agent_memory (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    agent_id TEXT,

    content TEXT,

    embedding VECTOR(1536),

    created_at TIMESTAMP DEFAULT NOW()

);