import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable11752924726988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "created_at" TIMESTAMP DEFAULT now() NOT NULL,
                "updated_at" TIMESTAMP DEFAULT now() NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "IDX_USERS_EMAIL"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
