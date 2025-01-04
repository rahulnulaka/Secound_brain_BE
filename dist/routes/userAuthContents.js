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
const User_1 = require("./../Interfaces/User");
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../Schema/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Content_1 = require("../Interfaces/Content");
const UserMiddelware_1 = require("../MiddelWares/UserMiddelware");
dotenv_1.default.config();
const userAuthContentsRouter = (0, express_1.Router)();
userAuthContentsRouter.post("/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedData = User_1.requiredBody.safeParse(req.body);
            if (!parsedData.success) {
                res.status(411).json({
                    msg: parsedData.error
                });
                return;
            }
            const { username, password } = req.body;
            const user = yield db_1.userModel.findOne({
                username: username
            });
            if (user) {
                res.sendStatus(403).json({
                    msg: "user already exists"
                });
                return;
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 5);
            const newUser = yield db_1.userModel.create({
                username: username,
                password: hashedPassword
            });
            if (!newUser) {
                res.status(403).json({
                    msg: "user creation failed"
                });
                return;
            }
            res.status(201).json({
                msg: "user created"
            });
        }
        catch (error) {
            res.status(500).json({
                msg: "Server error",
                error: error
            });
        }
    });
});
userAuthContentsRouter.post("/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedData = User_1.requiredBody.safeParse(req.body);
            if (!parsedData.success) {
                res.status(411).json({
                    msg: parsedData.error
                });
                return;
            }
            const { username, password } = req.body;
            //console.log("username:",username);
            const user = yield db_1.userModel.findOne({
                username: username
            });
            if (!user) {
                res.status(403).json({
                    msg: "user doesnt exists"
                });
            }
            else {
                const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordCorrect) {
                    res.status(403).json({
                        msg: "password is incorrect"
                    });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN);
                res.status(200).json({
                    msg: "user signed in",
                    token: token
                });
            }
        }
        catch (error) {
            res.status(500).json({
                error: error,
                msg: "something went wrong"
            });
        }
    });
});
userAuthContentsRouter.post("/content", UserMiddelware_1.userMiddelware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedData = Content_1.ContentsBody.safeParse(req.body);
            if (!parsedData.success) {
                res.status(411).json({
                    msg: parsedData.error
                });
                return;
            }
            const { link, type, title, tags } = req.body;
            const hashSet = new Set();
            tags === null || tags === void 0 ? void 0 : tags.forEach((tag) => {
                hashSet.add(tag);
            });
            const tagsAfterFiltering = Array.from(hashSet);
            const content = yield db_1.contentModel.create({
                link: link,
                type: type,
                title: title,
                tags: tagsAfterFiltering,
                userId: req.userId
            });
            res.status(200).json({
                msg: "content has been pushed to the db successfully"
            });
        }
        catch (error) {
            res.status(501).json({
                error: error,
                msg: "something went wrong"
            });
        }
    });
});
userAuthContentsRouter.get("/content", UserMiddelware_1.userMiddelware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const content = yield db_1.contentModel.find({ userId: userId });
            res.status(200).json({
                msg: "Content retrived successfullty from db",
                content: content
            });
        }
        catch (error) {
            res.status(501).json({
                msg: "failed while retriving the data",
                error: error
            });
        }
    });
});
userAuthContentsRouter.delete("/content", UserMiddelware_1.userMiddelware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contentId = req.body.contentId;
            yield db_1.contentModel.deleteMany({
                _id: contentId
            });
            res.status(200).json({
                msg: `content with id ${contentId} has been deleted successfully`
            });
        }
        catch (error) {
            res.status(501).json({
                error: error,
                msg: "something happened while deleting the data in db"
            });
        }
    });
});
exports.default = userAuthContentsRouter;
