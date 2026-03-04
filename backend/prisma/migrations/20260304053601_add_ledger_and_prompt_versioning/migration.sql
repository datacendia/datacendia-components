-- CreateTable: ledger_entries (Immutable Audit Ledger persistence)
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "entry_index" INTEGER NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "signature" TEXT,
    "nonce" TEXT,
    "merkle_root" TEXT,
    "block_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ledger_blocks (Merkle tree block persistence)
CREATE TABLE "ledger_blocks" (
    "block_number" INTEGER NOT NULL,
    "block_hash" TEXT NOT NULL,
    "previous_block_hash" TEXT NOT NULL,
    "merkle_root" TEXT NOT NULL,
    "entry_count" INTEGER NOT NULL,
    "first_entry_index" INTEGER NOT NULL,
    "last_entry_index" INTEGER NOT NULL,
    "witness" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_blocks_pkey" PRIMARY KEY ("block_number")
);

-- CreateTable: prompt_templates (Prompt versioning system)
CREATE TABLE "prompt_templates" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "variables" JSONB NOT NULL DEFAULT '[]',
    "model_config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id" TEXT,

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: prompt_usages (Prompt usage audit trail)
CREATE TABLE "prompt_usages" (
    "id" TEXT NOT NULL,
    "prompt_template_id" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "agent_code" TEXT,
    "mode" TEXT,
    "input_variables" JSONB NOT NULL DEFAULT '{}',
    "model_used" TEXT,
    "token_count" INTEGER,
    "response_quality" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_entry_index_key" ON "ledger_entries"("entry_index");
CREATE INDEX "ledger_entries_organization_id_created_at_idx" ON "ledger_entries"("organization_id", "created_at");
CREATE INDEX "ledger_entries_event_type_idx" ON "ledger_entries"("event_type");
CREATE INDEX "ledger_entries_hash_idx" ON "ledger_entries"("hash");
CREATE INDEX "ledger_entries_block_number_idx" ON "ledger_entries"("block_number");

CREATE UNIQUE INDEX "ledger_blocks_block_hash_key" ON "ledger_blocks"("block_hash");
CREATE INDEX "ledger_blocks_merkle_root_idx" ON "ledger_blocks"("merkle_root");

CREATE UNIQUE INDEX "prompt_templates_name_version_key" ON "prompt_templates"("name", "version");
CREATE INDEX "prompt_templates_category_idx" ON "prompt_templates"("category");
CREATE INDEX "prompt_templates_name_is_active_idx" ON "prompt_templates"("name", "is_active");
CREATE INDEX "prompt_templates_organization_id_idx" ON "prompt_templates"("organization_id");

CREATE INDEX "prompt_usages_prompt_template_id_idx" ON "prompt_usages"("prompt_template_id");
CREATE INDEX "prompt_usages_deliberation_id_idx" ON "prompt_usages"("deliberation_id");
CREATE INDEX "prompt_usages_created_at_idx" ON "prompt_usages"("created_at");

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_block_number_fkey" FOREIGN KEY ("block_number") REFERENCES "ledger_blocks"("block_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_usages" ADD CONSTRAINT "prompt_usages_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
