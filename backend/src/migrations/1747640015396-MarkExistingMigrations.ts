import { MigrationInterface, QueryRunner } from "typeorm";

export class MarkExistingMigrations1747640015396 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Mark the user monitoring migration as completed
        await queryRunner.query(`
            INSERT INTO "migrations" ("timestamp", "name")
            VALUES (1747640015394, 'MigrateUserMonitoring1747640015394')
            ON CONFLICT DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the migration record
        await queryRunner.query(`
            DELETE FROM "migrations"
            WHERE "name" = 'MigrateUserMonitoring1747640015394';
        `);
    }
} 