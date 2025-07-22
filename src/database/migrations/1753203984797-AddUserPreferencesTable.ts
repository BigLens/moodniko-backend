import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferencesTable1753203984797
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_preferences" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER UNIQUE NOT NULL,
                "theme" VARCHAR(50) NOT NULL DEFAULT 'light',
                "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
                "preferred_content_types" TEXT,
                "created_at" TIMESTAMP DEFAULT now() NOT NULL,
                "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
                CONSTRAINT "FK_user_preferences_user" FOREIGN KEY ("user_id") REFERENCES users(id) ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user_preferences"
        `);
  }
}
