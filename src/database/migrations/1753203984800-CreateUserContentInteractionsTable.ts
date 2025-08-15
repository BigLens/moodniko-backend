import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserContentInteractionsTable1753203984800
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_content_interactions table for comprehensive interaction tracking
    await queryRunner.query(`
      CREATE TABLE "user_content_interactions" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "content_id" INTEGER NOT NULL,
        "interaction_type" VARCHAR(50) NOT NULL CHECK (interaction_type IN ('like', 'dislike', 'save', 'share', 'skip', 'play', 'complete', 'rate')),
        "interaction_value" INTEGER CHECK (interaction_value >= 1 AND interaction_value <= 10),
        "mood_at_interaction" VARCHAR(50),
        "mood_intensity_at_interaction" INTEGER CHECK (mood_intensity_at_interaction >= 1 AND mood_intensity_at_interaction <= 10),
        "interaction_duration_seconds" INTEGER,
        "context" TEXT,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "FK_user_content_interactions_user" FOREIGN KEY ("user_id") REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT "FK_user_content_interactions_content" FOREIGN KEY ("content_id") REFERENCES contents(id) ON DELETE CASCADE
      )
    `);

    // Add indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_USER_CONTENT_INTERACTIONS_USER_ID" ON "user_content_interactions" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_CONTENT_INTERACTIONS_CONTENT_ID" ON "user_content_interactions" ("content_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_CONTENT_INTERACTIONS_TYPE" ON "user_content_interactions" ("interaction_type")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_CONTENT_INTERACTIONS_CREATED_AT" ON "user_content_interactions" ("created_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_CONTENT_INTERACTIONS_MOOD" ON "user_content_interactions" ("mood_at_interaction")
    `);

    // Add unique constraint to prevent duplicate interactions of the same type for the same user-content combination
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_USER_CONTENT_INTERACTIONS_UNIQUE" ON "user_content_interactions" ("user_id", "content_id", "interaction_type")
    `);

    // Add trigger to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_user_content_interactions_updated_at 
      BEFORE UPDATE ON "user_content_interactions" 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_user_content_interactions_updated_at ON "user_content_interactions"
    `);

    // Drop function
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column()
    `);

    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_UNIQUE"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_MOOD"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_CREATED_AT"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_TYPE"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_CONTENT_ID"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_USER_CONTENT_INTERACTIONS_USER_ID"
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE "user_content_interactions"
    `);
  }
}
