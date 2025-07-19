import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdConstraintWithDataUpdate1752963803193
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, ensure we have at least one user
    const usersResult = await queryRunner.query('SELECT id FROM users LIMIT 1');

    if (usersResult.length === 0) {
      // Create a default user if none exists
      await queryRunner.query(`
        INSERT INTO users (email, password) 
        VALUES ('default@example.com', 'hashedpassword')
      `);
    }

    // Get the first user ID
    const userResult = await queryRunner.query('SELECT id FROM users LIMIT 1');
    const userId = userResult[0].id;

    // Update all moods that have null userId
    await queryRunner.query(
      `
      UPDATE moods 
      SET "userId" = $1 
      WHERE "userId" IS NULL
    `,
      [userId],
    );

    // Now set the NOT NULL constraint
    await queryRunner.query(`
      ALTER TABLE moods
      ALTER COLUMN "userId" SET NOT NULL;
    `);

    // Add the foreign key constraint
    await queryRunner.query(`
      ALTER TABLE moods
      ADD CONSTRAINT "FK_moods_user" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE moods DROP CONSTRAINT "FK_moods_user";
    `);
    await queryRunner.query(`
      ALTER TABLE moods ALTER COLUMN "userId" DROP NOT NULL;
    `);
  }
}
