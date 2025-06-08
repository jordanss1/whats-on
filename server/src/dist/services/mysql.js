"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const keys_1 = __importDefault(require("../config/keys"));
const db = promise_1.default.createPool({
    host: keys_1.default.host,
    user: keys_1.default.dbUser,
    password: keys_1.default.dbPass,
    database: keys_1.default.dbName,
    waitForConnections: true,
    connectionLimit: 10,
});
exports.default = db;
