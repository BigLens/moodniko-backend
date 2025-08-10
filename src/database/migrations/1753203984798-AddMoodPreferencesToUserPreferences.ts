import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoodPreferencesToUserPreferences1753203984798
  implements MigrationInterface
{
  name = 'AddMoodPreferencesToUserPreferences1753203984798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_preferences" 
      ADD COLUMN "mood_preferences" JSON,
      ADD COLUMN "mood_intensity_settings" JSON,
      ADD COLUMN "custom_mood_categories" TEXT[],
      ADD COLUMN "default_intensity_levels" INTEGER NOT NULL DEFAULT 5,
      ADD COLUMN "enable_mood_intensity" BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN "enable_custom_mood_categories" BOOLEAN NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_preferences" 
      DROP COLUMN "mood_preferences",
      DROP COLUMN "mood_intensity_settings", 
      DROP COLUMN "custom_mood_categories",
      DROP COLUMN "default_intensity_levels",
      DROP COLUMN "enable_mood_intensity",
      DROP COLUMN "enable_custom_mood_categories"
    `);
  }
}
