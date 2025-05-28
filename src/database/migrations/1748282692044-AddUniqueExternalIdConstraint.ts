import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueExternalIdConstraint1748282692044
  implements MigrationInterface
{
  name = 'AddUniqueExternalIdConstraint1748282692044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, remove any duplicate entries keeping the first occurrence
    await queryRunner.query(`
            DELETE FROM contents a
            USING (
                SELECT MIN(id) as id, external_id, type
                FROM contents
                GROUP BY external_id, type
            ) b
            WHERE a.external_id = b.external_id 
            AND a.type = b.type 
            AND a.id != b.id
        `);

    // Then add the unique constraint
    await queryRunner.query(`
            ALTER TABLE contents 
            ADD CONSTRAINT "UQ_contents_external_id_type" 
            UNIQUE (external_id, type)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE contents 
            DROP CONSTRAINT "UQ_contents_external_id_type"
        `);
  }
}
