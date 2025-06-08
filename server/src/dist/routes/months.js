"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkApiKey_1 = __importDefault(require("../middleware/checkApiKey"));
const redis_1 = __importDefault(require("../services/redis"));
const axios_1 = require("../utils/axios");
const cache_1 = __importDefault(require("../utils/cache"));
const error_1 = __importDefault(require("../utils/error"));
const events_1 = __importDefault(require("../utils/events"));
const monthsRouter = (0, express_1.Router)();
monthsRouter.get('/', checkApiKey_1.default, getMonths);
async function getMonths(req, res) {
    try {
        const months = await (0, cache_1.default)('events/months', async () => {
            let events = await redis_1.default.get('events');
            let formattedEvents;
            if (events !== null) {
                formattedEvents = JSON.parse(events);
            }
            else {
                const { data } = await axios_1.eventsApi.get('');
                formattedEvents = (0, events_1.default)(data);
            }
            const months = formattedEvents.flatMap((event) => event.monthAndYear);
            const uniqueMonths = [...new Set(months)];
            await redis_1.default.set('events/months', JSON.stringify(uniqueMonths));
            return uniqueMonths;
        });
        res.status(200).json(months);
    }
    catch (err) {
        (0, error_1.default)(err, res);
    }
}
exports.default = monthsRouter;
