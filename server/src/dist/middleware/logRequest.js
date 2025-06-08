"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logPath = path_1.default.join(__dirname, '../../audit.log');
const logRequest = (req, res, next) => {
    const time = new Date().toISOString();
    const line = `${time} | ${req.ip} |  ${req.originalUrl}\n`;
    fs_1.default.appendFileSync(logPath, line);
    next();
};
exports.default = logRequest;
