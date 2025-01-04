"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
console.log(process.env.MONGOOSE_URL);
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userAuthContents_1 = __importDefault(require("./routes/userAuthContents"));
const share_1 = __importDefault(require("./routes/share"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("<h1>Server is in running mode...</h1>");
});
console.log("hIii helloooo");
app.use("/api/v1", userAuthContents_1.default);
app.use("/api/v1/brain", share_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect("mongodb+srv://rahuls988:WigC1wwanfYU1GMB@cluster0.qbaab.mongodb.net/second_brain").then(() => {
                console.log("Connected to MongoDB");
                app.listen(3000, () => {
                    console.log("Server is running on port 3000");
                });
            });
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    });
}
main();
