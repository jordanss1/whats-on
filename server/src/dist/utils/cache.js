"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../services/redis"));
async function getOrSetCache(key, cb) {
    try {
        const data = await redis_1.default.get(key);
        if (data !== null)
            return JSON.parse(data);
        const freshData = await cb();
        await redis_1.default.set(key, JSON.stringify(freshData));
        return freshData;
    }
    catch (err) {
        throw err;
    }
}
exports.default = getOrSetCache;
