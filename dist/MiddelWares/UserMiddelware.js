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
exports.userMiddelware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddelware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = req.headers["authorization"];
        if (!userToken) {
            res.status(401).json({
                msg: "user not authorized"
            });
        }
        else {
            const decodedToken = jsonwebtoken_1.default.verify(userToken, process.env.JWT_SECRET_TOKEN);
            req.userId = decodedToken.id;
            next();
        }
    }
    catch (error) {
        res.status(501).json({
            error: error,
            msg: "you are not authorized to access this route"
        });
    }
});
exports.userMiddelware = userMiddelware;
