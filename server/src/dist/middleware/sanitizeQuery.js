"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedParamKeys = void 0;
exports.allowedParamKeys = [
    'category',
    'search',
    'hospitality',
    'month',
    'panthers',
];
const sanitizeQuery = (req, res, next) => {
    for (const [key, value] of Object.entries(req.query)) {
        if (exports.allowedParamKeys.includes(key)) {
            if (typeof value === 'string') {
                req[key] = value;
            }
        }
    }
    next();
};
exports.default = sanitizeQuery;
