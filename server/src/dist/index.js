"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const keys_1 = __importDefault(require("./config/keys"));
const categories_1 = __importDefault(require("./routes/categories"));
const events_1 = __importDefault(require("./routes/events"));
const months_1 = __importDefault(require("./routes/months"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: keys_1.default.clientUrl,
    allowedHeaders: ['Content-Type', 'X-API-Key'],
}));
app.use('/api/events', events_1.default);
//retrieve categories for select dropdown
app.use('/api/events/categories', categories_1.default);
//retrieve months for select dropdown
app.use('/api/events/months', months_1.default);
const PORT = process.env.PORT || 3000;
process.env.NODE_ENV = 'production';
app.listen(PORT);
