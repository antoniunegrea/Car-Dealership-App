import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class MigrateUserMonitoring1747640015394 implements MigrationInterface {
    name = 'MigrateUserMonitoring1747640015394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create user_monitoring table
        await queryRunner.createTable(new Table({
            name: 'user_monitoring',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'user_id',
                    type: 'int',
                    isUnique: true,
                },
                {
                    name: 'flagged',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'actionCount',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'lastChecked',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        // 2. Add foreign key constraint to users(id)
        await queryRunner.createForeignKey('user_monitoring', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        // 3. Migrate flagged data from users table to user_monitoring
        await queryRunner.query(`
            INSERT INTO user_monitoring (user_id, flagged)
            SELECT id, flagged FROM users WHERE flagged = true
        `);

        // 4. Remove flagged column from users table
        await queryRunner.query(`ALTER TABLE users DROP COLUMN flagged`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Add flagged column back to users
        await queryRunner.query(`ALTER TABLE users ADD flagged boolean DEFAULT false`);

        // 2. Restore flagged status back to users table
        await queryRunner.query(`
            UPDATE users
            SET flagged = true
            WHERE id IN (
                SELECT user_id FROM user_monitoring WHERE flagged = true
            )
        `);

        // 3. Drop foreign key first
        const table = await queryRunner.getTable('user_monitoring');
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
        if (foreignKey) {
            await queryRunner.dropForeignKey('user_monitoring', foreignKey);
        }

        // 4. Drop user_monitoring table
        await queryRunner.dropTable('user_monitoring');
    }
}
