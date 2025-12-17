-- =============================================================================
-- POSTGRESQL INITIALIZATION - Sovereign Extensions
-- =============================================================================

-- Enable pgvector for AI embeddings (RAG memory)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable cryptographic functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create additional databases for services
CREATE DATABASE keycloak;
CREATE DATABASE unleash;
CREATE DATABASE airbyte;

-- =============================================================================
-- VECTOR TABLES FOR CENDIAGNOSIS™ (Document Memory)
-- =============================================================================

-- Document embeddings for RAG
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id VARCHAR(255) NOT NULL,
    document_id VARCHAR(255) NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI-compatible dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector 
ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Index for organization lookup
CREATE INDEX IF NOT EXISTS idx_document_embeddings_org 
ON document_embeddings(organization_id);

-- =============================================================================
-- DECISION EMBEDDINGS FOR COUNCIL MEMORY
-- =============================================================================

CREATE TABLE IF NOT EXISTS decision_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id VARCHAR(255) NOT NULL,
    decision_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255),
    content TEXT NOT NULL,
    embedding vector(1536),
    outcome VARCHAR(50),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_embeddings_vector 
ON decision_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_decision_embeddings_org 
ON decision_embeddings(organization_id);

-- =============================================================================
-- AGENT MEMORY (Long-term context)
-- =============================================================================

CREATE TABLE IF NOT EXISTS agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    memory_type VARCHAR(50) NOT NULL, -- 'episodic', 'semantic', 'procedural'
    content TEXT NOT NULL,
    embedding vector(1536),
    importance DECIMAL(3,2) DEFAULT 0.5,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_agent_memory_vector 
ON agent_memory USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_agent_memory_agent 
ON agent_memory(organization_id, agent_id);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to find similar documents
CREATE OR REPLACE FUNCTION find_similar_documents(
    query_embedding vector(1536),
    org_id VARCHAR(255),
    match_count INTEGER DEFAULT 5,
    similarity_threshold DECIMAL DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    document_id VARCHAR(255),
    content TEXT,
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        de.id,
        de.document_id,
        de.content,
        (1 - (de.embedding <=> query_embedding))::DECIMAL as similarity
    FROM document_embeddings de
    WHERE de.organization_id = org_id
      AND (1 - (de.embedding <=> query_embedding)) > similarity_threshold
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Function to find similar decisions
CREATE OR REPLACE FUNCTION find_similar_decisions(
    query_embedding vector(1536),
    org_id VARCHAR(255),
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    decision_id VARCHAR(255),
    content TEXT,
    outcome VARCHAR(50),
    similarity DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        de.id,
        de.decision_id,
        de.content,
        de.outcome,
        (1 - (de.embedding <=> query_embedding))::DECIMAL as similarity
    FROM decision_embeddings de
    WHERE de.organization_id = org_id
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cendia;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cendia;
