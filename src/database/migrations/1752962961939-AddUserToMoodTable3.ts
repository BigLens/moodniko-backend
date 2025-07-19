import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToMoodTable31752962961939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE moods
      ADD COLUMN "userId" INTEGER;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE moods DROP COLUMN "userId";
    `);
  }
}
