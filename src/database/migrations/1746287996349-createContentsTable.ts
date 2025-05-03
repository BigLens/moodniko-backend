import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContentsTable1746287996349 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "content_type_enum" AS ENUM('movie', 'music', 'podcast', 'book')
            `);
        await queryRunner.query(`
            CREATE TABLE "contents" (
                "id" SERIAL PRIMARY KEY,
                "external_id" VARCHAR NOT NULL,
                "title" VARCHAR NOT NULL,
                "description" TEXT,
                "image_url" VARCHAR NOT NULL,
                "type" "content_type_enum" NOT NULL,
                "moodtag" VARCHAR NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
                )
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "contents"
            `);
        await queryRunner.query(`
            DROP TYPE "content_type_enum"
            `);
    }
}
