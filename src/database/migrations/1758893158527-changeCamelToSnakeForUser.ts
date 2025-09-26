import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCamelToSnakeForUser1758893158527
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "moods" RENAME COLUMN "userId" TO "user_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "moods" RENAME COLUMN "user_id" TO "userId"`,
    );
  }
}
