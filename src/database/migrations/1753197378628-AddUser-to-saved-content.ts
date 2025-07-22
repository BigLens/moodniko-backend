import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToSavedContent1753197378628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add user_id column (nullable for now)
        await queryRunner.query(`
            ALTER TABLE "saved_contents"
            ADD COLUMN "user_id" INTEGER;
        `);

        // 2. Ensure at least one user exists
        const usersResult = await queryRunner.query('SELECT id FROM users LIMIT 1');
        let userId;
        if (usersResult.length === 0) {
            // Create a default user if none exists
            await queryRunner.query(`
                INSERT INTO users (email, password)
                VALUES ('default@example.com', 'hashedpassword')
            `);
            const newUser = await queryRunner.query('SELECT id FROM users WHERE email = $1', ['default@example.com']);
            userId = newUser[0].id;
        } else {
            userId = usersResult[0].id;
        }

        // 3. Populate user_id for all existing saved_contents
        await queryRunner.query(
            `UPDATE "saved_contents" SET "user_id" = $1 WHERE "user_id" IS NULL`,
            [userId]
        );

        // 4. Set user_id as NOT NULL
        await queryRunner.query(`
            ALTER TABLE "saved_contents"
            ALTER COLUMN "user_id" SET NOT NULL;
        `);

        // 5. Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "saved_contents"
            ADD CONSTRAINT "FK_saved_contents_user" FOREIGN KEY ("user_id") REFERENCES users(id) ON DELETE CASCADE;
        `);

        // 6. Drop old unique index and create new one including user_id
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_SAVED_CONTENTS_UNIQUE";
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_SAVED_CONTENTS_UNIQUE" ON "saved_contents" ("content_id", "mood", "user_id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop new unique index
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_SAVED_CONTENTS_UNIQUE";
        `);
        // Drop foreign key
        await queryRunner.query(`
            ALTER TABLE "saved_contents" DROP CONSTRAINT IF EXISTS "FK_saved_contents_user";
        `);
        // Drop user_id column
        await queryRunner.query(`
            ALTER TABLE "saved_contents" DROP COLUMN IF EXISTS "user_id";
        `);
        // Recreate old unique index
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_SAVED_CONTENTS_UNIQUE" ON "saved_contents" ("content_id", "mood");
        `);
    }

}
