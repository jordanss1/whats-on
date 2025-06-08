"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const handleError = (err, res) => {
    if (err instanceof axios_1.AxiosError) {
        if (err.response) {
            const status = err.response.status;
            if (status === 400) {
                res
                    .status(400)
                    .json({ error: 'Request was malformed please try again' });
            }
            else if (status === 401) {
                res.status(401).json({ error: 'You are not authorised for this data' });
            }
            else if (status === 404) {
                res.status(400).json({ error: 'Resource you requested was not found' });
            }
            else if (status === 429) {
                res.status(400).json({
                    error: 'Too many requests in a short time - try again later',
                });
            }
            else {
                res.status(500).json({ error: 'Server error please try again later' });
            }
        }
        else if (err.request) {
            res
                .status(503)
                .json({ error: 'Server unreachable now - please try again later.' });
        }
        else {
            res.status(500).json({ error: 'Server error please try again later' });
        }
    }
    else {
        res.status(500).json({ error: 'Server error please try again later' });
    }
};
exports.default = handleError;
