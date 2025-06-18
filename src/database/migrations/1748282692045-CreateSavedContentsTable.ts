import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSavedContentsTable1748282692045
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create saved_contents table
    await queryRunner.query(`
      CREATE TABLE "saved_contents" (
        "id" SERIAL PRIMARY KEY,
        "content_id" INTEGER NOT NULL,
        "mood" VARCHAR(50) NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "FK_saved_contents_content" FOREIGN KEY ("content_id") 
          REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Add indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_SAVED_CONTENTS_CONTENT_ID" ON "saved_contents" ("content_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_SAVED_CONTENTS_MOOD" ON "saved_contents" ("mood")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_SAVED_CONTENTS_CREATED_AT" ON "saved_contents" ("created_at")
    `);

    // Add unique constraint for content_id + mood combination
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_SAVED_CONTENTS_UNIQUE" ON "saved_contents" ("content_id", "mood")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX "IDX_SAVED_CONTENTS_UNIQUE"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_SAVED_CONTENTS_CREATED_AT"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_SAVED_CONTENTS_MOOD"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_SAVED_CONTENTS_CONTENT_ID"
    `);

    // Drop table
    await queryRunner.query(`
      DROP TABLE "saved_contents"
    `);
  }
}
