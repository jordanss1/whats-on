"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsApi = void 0;
const axios_1 = __importDefault(require("axios"));
const dev_1 = __importDefault(require("../config/dev"));
exports.eventsApi = axios_1.default.create({
    baseURL: 'https://whatson.motorpointarenanottingham.com/api/challenge',
    headers: {
        'X-API-Key': dev_1.default.apiKey,
    },
});
