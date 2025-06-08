"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const keys = {
    dbPass: process.env.DB_PASS,
    dbUser: process.env.DB_USER,
    dbName: process.env.DB_NAME,
    clientUrl: process.env.CLIENT_URL,
    host: process.env.HOST,
    apiKey: process.env.API_KEY,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
};
exports.default = keys;
