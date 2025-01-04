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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../Schema/db");
const RandomHashGenerator_1 = require("../utils/RandomHashGenerator");
const UserMiddelware_1 = require("./../MiddelWares/UserMiddelware");
const express_1 = require("express");
const shareRouter = (0, express_1.Router)();
shareRouter.post("/share", UserMiddelware_1.userMiddelware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const share = req.body.share;
            if (share) {
                const exisistingLink = yield db_1.linkModel.findOne({
                    userId: req.userId
                });
                if (exisistingLink) {
                    res.status(200).json({
                        msg: "link already exists",
                        link: exisistingLink.hash
                    });
                    return;
                }
                const hash = (0, RandomHashGenerator_1.createHash)(20);
                const newLink = yield db_1.linkModel.create({
                    hash: hash,
                    userId: req.userId
                });
                res.status(200).json({
                    msg: "link created successfully",
                    link: newLink.hash
                });
            }
        }
        catch (error) {
            res.status(501).json({
                error: error,
                msg: "something went wrong"
            });
        }
    });
});
shareRouter.get("/:shareLink", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shareableLink = req.params.shareLink;
            const link = yield db_1.linkModel.findOne({
                hash: shareableLink
            });
            if (!link) {
                res.status(403).json({
                    msg: "link doesnt exxist",
                });
                return;
            }
            const content = yield db_1.contentModel.find({
                userId: link.userId
            });
            const user = yield db_1.userModel.findOne({
                _id: link.userId
            });
            if (!user) {
                res.status(403).json({
                    msg: "user doesnt exists"
                });
                return;
            }
            res.status(200).json({
                msg: "shareable link retrived successfully",
                content: content,
                userName: user.username
            });
        }
        catch (error) {
            res.status(501).json({
                msg: "something went wrong",
                error: error
            });
        }
    });
});
exports.default = shareRouter;
