"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("../services/mysql"));
const checkApiKey = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (!apiKey) {
        res
            .status(403)
            .json({ error: 'You must provide an api key in X-API-Key header' });
        return;
    }
    const [rows] = await mysql_1.default.query(`SELECT api_key FROM api_keys WHERE api_key=?`, [apiKey]);
    if (!rows?.length) {
        res.status(403).json({ error: 'Invalid API key' });
        return;
    }
    next();
};
exports.default = checkApiKey;
