import { requiredBody, UserSchema } from './../Interfaces/User';
import { Router, Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import { z } from 'zod';
import { contentModel, userModel } from '../Schema/db';
import {ObjectId} from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { ContentsBody, ContentSchema } from '../Interfaces/Content';
import { userMiddelware } from '../MiddelWares/UserMiddelware';

dotenv.config();
const userAuthContentsRouter = Router();


userAuthContentsRouter.post("/signup",async function(req:Request,res:Response){
    try{

        const parsedData=requiredBody.safeParse(req.body);

        if(!parsedData.success){
            res.status(411).json({
                msg:parsedData.error
            })
            return;
        }

        const { username, password } :UserSchema = req.body;


        const user= await userModel.findOne({
            username:username
        });

        if(user){
            res.sendStatus(403).json({
                msg:"user already exists"
            })
            return;
        }

        const hashedPassword=await bcrypt.hash(password,5);

        const newUser=await userModel.create({
            username:username,
            password:hashedPassword
        });

        if(!newUser){
            res.status(403).json({
                msg:"user creation failed"
            })
            return;
        }
        res.status(201).json({
            msg:"user created"
        })
    }
    catch(error){
        res.status(500).json({
            msg:"Server error",
            error: error
        })
    }

});

userAuthContentsRouter.post("/signin", async function(req:Request, res:Response){
    try {

        const parsedData=requiredBody.safeParse(req.body);

        if(!parsedData.success){
            res.status(411).json({
                msg:parsedData.error
            })
            return;
        }

        const {username, password}: UserSchema=req.body;


        //console.log("username:",username);

        const user=await userModel.findOne({
            username:username
        });

        if(!user){
            res.status(403).json({
                msg:"user doesnt exists"
            })
        }
        else{
        const isPasswordCorrect=await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            res.status(403).json({
                msg:"password is incorrect"
            })
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN);
        res.status(200).json({
            msg:"user signed in",
            token:token
        })
        }
    } catch (error) {
        res.status(500).json({
            error: error,
            msg:"something went wrong"
        })
    }
});

userAuthContentsRouter.post("/content", userMiddelware, async function(req:Request,res:Response){
    try {
        const parsedData=ContentsBody.safeParse(req.body);

        if(!parsedData.success){
            res.status(411).json({
                msg:parsedData.error
            })
            return;
        }

        const {link, type, title, tags}: ContentSchema=req.body;


        const hashSet= new Set<string>();

        tags?.forEach((tag)=>{
            hashSet.add(tag);
        })

        const tagsAfterFiltering:string[]=Array.from(hashSet);
        const content=await contentModel.create({
            link:link,
            type:type,
            title:title,
            tags:tagsAfterFiltering,  
            userId:req.userId
        })

        res.status(200).json({
            msg:"content has been pushed to the db successfully"
        })
    } catch (error) {
        res.status(501).json({
            error:error,
            msg:"something went wrong"
        })
    }
});

userAuthContentsRouter.get("/content", userMiddelware , async function(req:Request,res:Response){
    try {
        const userId=req.userId;
        const content:ContentSchema[]=await contentModel.find({userId:userId});
        res.status(200).json({
            msg:"Content retrived successfullty from db",
            content:content
        })
    } catch (error) {
        res.status(501).json({
            msg:"failed while retriving the data",
            error:error
        })
    }
});


userAuthContentsRouter.delete("/content", userMiddelware , async function(req:Request,res:Response){
    try {
        const contentId =req.body.contentId;
        
        await contentModel.deleteMany({
            _id:contentId
        })

        res.status(200).json({
            msg:`content with id ${contentId} has been deleted successfully`
        })
    } catch (error) {
        res.status(501).json({
            error:error,
            msg:"something happened while deleting the data in db"
        })
    }
});


export default userAuthContentsRouter;