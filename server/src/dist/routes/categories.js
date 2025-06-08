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
const categoriesRouter = (0, express_1.Router)();
categoriesRouter.get('/', checkApiKey_1.default, getCategories);
async function getCategories(req, res) {
    try {
        const categories = await (0, cache_1.default)('events/categories', async () => {
            let events = await redis_1.default.get('events');
            let formattedEvents;
            if (events !== null) {
                formattedEvents = JSON.parse(events);
            }
            else {
                const { data } = await axios_1.eventsApi.get('');
                formattedEvents = (0, events_1.default)(data);
            }
            const filteredGenres = formattedEvents.flatMap((event) => event.genre
                .map((g) => g.trim().toLowerCase())
                .filter((g) => g !== 'user preferences')
                .map((g) => g.charAt(0).toUpperCase() + g.slice(1)));
            const uniqueCategories = [...new Set(filteredGenres)];
            await redis_1.default.set('events/categories', JSON.stringify(uniqueCategories));
            return uniqueCategories;
        });
        res.status(200).json(categories);
    }
    catch (err) {
        (0, error_1.default)(err, res);
    }
}
exports.default = categoriesRouter;
