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
exports.CreateSessionTable1747640015395 = void 0;
const typeorm_1 = require("typeorm");
class CreateSessionTable1747640015395 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the session table already exists
            const tableExists = yield queryRunner.hasTable("session");
            if (!tableExists) {
                yield queryRunner.createTable(new typeorm_1.Table({
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
                }), true);
                yield queryRunner.createForeignKey("session", new typeorm_1.TableForeignKey({
                    columnNames: ["userId"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",
                    onDelete: "CASCADE",
                }));
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("session");
            if (table) {
                const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("session", foreignKey);
                }
                yield queryRunner.dropTable("session");
            }
        });
    }
}
exports.CreateSessionTable1747640015395 = CreateSessionTable1747640015395;
