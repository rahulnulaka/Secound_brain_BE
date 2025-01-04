import { z } from 'zod';
import ContentTypes from '../Enums/TagsType';
import mongoose from 'mongoose';

export const ContentsBody= z.object({
    link: z.preprocess((value)=>
        typeof value === "string" && value.trim() === "" ? undefined : value,
      z.string().url({ message: "Link must be a valid URL" }).optional()
    ),
    type: z.enum(ContentTypes)
    .refine((val) => ContentTypes.includes(val), {
      message: `Type must be one of ${ContentTypes.join(", ")}`,
    }),
    title: z.string().min(10, "title should be atleast 10 letters").max(50, "title should not exceed 50 characters"),
    tags: z
    .array(z.string())
    .max(20, { message: "Tags must be at most 20 characters" })
    .optional(),
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid contentId",
      })
})


export type ContentSchema=z.infer<typeof ContentsBody>;