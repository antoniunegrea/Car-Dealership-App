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
exports.MarkExistingMigrations1747640015396 = void 0;
class MarkExistingMigrations1747640015396 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mark the user monitoring migration as completed
            yield queryRunner.query(`
            INSERT INTO "migrations" ("timestamp", "name")
            VALUES (1747640015394, 'MigrateUserMonitoring1747640015394')
            ON CONFLICT DO NOTHING;
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove the migration record
            yield queryRunner.query(`
            DELETE FROM "migrations"
            WHERE "name" = 'MigrateUserMonitoring1747640015394';
        `);
        });
    }
}
exports.MarkExistingMigrations1747640015396 = MarkExistingMigrations1747640015396;
