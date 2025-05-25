import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSessionTable1747640015395 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the session table already exists
        const tableExists = await queryRunner.hasTable("session");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "session",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "token",
                            type: "varchar",
                        },
                        {
                            name: "deviceInfo",
                            type: "varchar",
                        },
                        {
                            name: "isActive",
                            type: "boolean",
                            default: true,
                        },
                        {
                            name: "createdAt",
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "lastActivity",
                            type: "timestamp",
                            default: "now()",
                        },
                        {
                            name: "expiresAt",
                            type: "timestamp",
                        },
                        {
                            name: "userId",
                            type: "int",
                        },
                    ],
                }),
                true
            );

            await queryRunner.createForeignKey(
                "session",
                new TableForeignKey({
                    columnNames: ["userId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",
                    onDelete: "CASCADE",
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("session");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("session", foreignKey);
            }
            await queryRunner.dropTable("session");
        }
    }
} 