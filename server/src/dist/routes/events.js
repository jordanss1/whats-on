"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkApiKey_1 = __importDefault(require("../middleware/checkApiKey"));
const logRequest_1 = __importDefault(require("../middleware/logRequest"));
const sanitizeQuery_1 = __importStar(require("../middleware/sanitizeQuery"));
const axios_1 = require("../utils/axios");
const cache_1 = __importDefault(require("../utils/cache"));
const error_1 = __importDefault(require("../utils/error"));
const events_1 = __importDefault(require("../utils/events"));
const eventRouter = (0, express_1.Router)();
eventRouter.get('/', checkApiKey_1.default, sanitizeQuery_1.default, logRequest_1.default, getEvents);
async function getEvents(req, res) {
    let cacheName = 'events';
    let key = null;
    let value = null;
    sanitizeQuery_1.allowedParamKeys.forEach((allowedKey) => {
        if (req[allowedKey]) {
            key = allowedKey;
            value = req[allowedKey];
            cacheName += `?${allowedKey}=${encodeURIComponent(req[allowedKey])}`;
        }
    });
    //this func pulls events from API if the event key isn't already cached in redis
    try {
        const events = await (0, cache_1.default)(cacheName, 
        // this function runs if events arent cached, pulls events and formats them
        async () => {
            const { data } = await axios_1.eventsApi.get('');
            const formattedEvents = (0, events_1.default)(data, key);
            // this key and value pulled from the query params determine how the events are filtered for cache and then sent to frontend
            if (key && value) {
                switch (key) {
                    case 'category':
                        return formattedEvents.filter((e) => e.genre.some((g) => g.toLowerCase().includes(value)));
                    case 'search':
                        return formattedEvents.filter((e) => e.title.toLowerCase().includes(value) ||
                            e.description.toLowerCase().includes(value));
                    case 'month':
                        return formattedEvents.filter((e) => e.monthAndYear.toLowerCase() === value);
                    case 'hospitality':
                        return formattedEvents.filter((e) => e.hospitalityPackage);
                    case 'panthers':
                        return formattedEvents.filter((e) => e.genre.some((g) => g.toLowerCase().includes('panthers')));
                    default:
                        return formattedEvents;
                }
            }
            return formattedEvents;
        });
        res.status(200).json(events);
    }
    catch (err) {
        (0, error_1.default)(err, res);
    }
}
exports.default = eventRouter;
