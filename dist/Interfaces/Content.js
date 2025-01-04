"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentsBody = void 0;
const zod_1 = require("zod");
const TagsType_1 = __importDefault(require("../Enums/TagsType"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.ContentsBody = zod_1.z.object({
    link: zod_1.z.preprocess((value) => typeof value === "string" && value.trim() === "" ? undefined : value, zod_1.z.string().url({ message: "Link must be a valid URL" }).optional()),
    type: zod_1.z.enum(TagsType_1.default)
        .refine((val) => TagsType_1.default.includes(val), {
        message: `Type must be one of ${TagsType_1.default.join(", ")}`,
    }),
    title: zod_1.z.string().min(10, "title should be atleast 10 letters").max(50, "title should not exceed 50 characters"),
    tags: zod_1.z
        .array(zod_1.z.string())
        .max(20, { message: "Tags must be at most 20 characters" })
        .optional(),
    userId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid contentId",
    })
});
