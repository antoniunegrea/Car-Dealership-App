"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateUserMonitoring1747640015394 = void 0;
const typeorm_1 = require("typeorm");
class MigrateUserMonitoring1747640015394 {
    constructor() {
        this.name = 'MigrateUserMonitoring1747640015394';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Create user_monitoring table
            yield queryRunner.createTable(new typeorm_1.Table({
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
            yield queryRunner.createForeignKey('user_monitoring', new typeorm_1.TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }));
            // 3. Migrate flagged data from users table to user_monitoring
            yield queryRunner.query(`
            INSERT INTO user_monitoring (user_id, flagged)
            SELECT id, flagged FROM users WHERE flagged = true
        `);
            // 4. Remove flagged column from users table
            yield queryRunner.query(`ALTER TABLE users DROP COLUMN flagged`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Add flagged column back to users
            yield queryRunner.query(`ALTER TABLE users ADD flagged boolean DEFAULT false`);
            // 2. Restore flagged status back to users table
            yield queryRunner.query(`
            UPDATE users
            SET flagged = true
            WHERE id IN (
                SELECT user_id FROM user_monitoring WHERE flagged = true
            )
        `);
            // 3. Drop foreign key first
            const table = yield queryRunner.getTable('user_monitoring');
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
            if (foreignKey) {
                yield queryRunner.dropForeignKey('user_monitoring', foreignKey);
            }
            // 4. Drop user_monitoring table
            yield queryRunner.dropTable('user_monitoring');
        });
    }
}
exports.MigrateUserMonitoring1747640015394 = MigrateUserMonitoring1747640015394;
