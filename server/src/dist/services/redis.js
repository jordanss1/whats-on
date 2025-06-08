"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const keys_1 = __importDefault(require("../config/keys"));
const redisHost = keys_1.default.redisHost;
const redisPort = +keys_1.default.redisPort;
const client = (0, redis_1.createClient)({
    socket: {
        host: redisHost,
        port: redisPort,
    },
});
client.on('error', (err) => console.log('Redis Client Error', err));
async function startRedis() {
    await client.connect();
}
startRedis();
exports.default = client;
