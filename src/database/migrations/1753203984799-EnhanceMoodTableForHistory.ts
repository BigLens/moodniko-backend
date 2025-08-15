import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnhanceMoodTableForHistory1753203984799
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enhance the existing moods table with comprehensive tracking
    await queryRunner.query(`
      ALTER TABLE moods
      ADD COLUMN "intensity" INTEGER CHECK (intensity >= 1 AND intensity <= 10),
      ADD COLUMN "context" TEXT,
      ADD COLUMN "triggers" TEXT[],
      ADD COLUMN "notes" TEXT,
      ADD COLUMN "location" VARCHAR(255),
      ADD COLUMN "weather" VARCHAR(100),
      ADD COLUMN "activity" VARCHAR(255),
      ADD COLUMN "social_context" VARCHAR(100),
      ADD COLUMN "energy_level" INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
      ADD COLUMN "stress_level" INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
      ADD COLUMN "sleep_quality" INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
      ADD COLUMN "mood_duration_minutes" INTEGER,
      ADD COLUMN "mood_change_reason" VARCHAR(255)
    `);

    // Add indexes for performance on commonly queried fields
    await queryRunner.query(`
      CREATE INDEX "IDX_MOODS_INTENSITY" ON moods ("intensity")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_MOODS_CREATED_AT_USER" ON moods ("created_at", "userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_MOODS_FEELING_USER" ON moods ("feeling", "userId")
    `);

    // Set default values for existing records
    await queryRunner.query(`
      UPDATE moods 
      SET 
        intensity = 5,
        energy_level = 5,
        stress_level = 5,
        sleep_quality = 5
      WHERE intensity IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_MOODS_INTENSITY"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_MOODS_CREATED_AT_USER"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_MOODS_FEELING_USER"
    `);

    // Drop added columns
    await queryRunner.query(`
      ALTER TABLE moods
      DROP COLUMN IF EXISTS "intensity",
      DROP COLUMN IF EXISTS "context",
      DROP COLUMN IF EXISTS "triggers",
      DROP COLUMN IF EXISTS "notes",
      DROP COLUMN IF EXISTS "location",
      DROP COLUMN IF EXISTS "weather",
      DROP COLUMN IF EXISTS "activity",
      DROP COLUMN IF EXISTS "social_context",
      DROP COLUMN IF EXISTS "energy_level",
      DROP COLUMN IF EXISTS "stress_level",
      DROP COLUMN IF EXISTS "sleep_quality",
      DROP COLUMN IF EXISTS "mood_duration_minutes",
      DROP COLUMN IF EXISTS "mood_change_reason"
    `);
  }
}
