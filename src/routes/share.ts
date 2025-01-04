import { ContentSchema } from '../Interfaces/Content';
import { contentModel, linkModel, userModel } from '../Schema/db';
import { createHash } from '../utils/RandomHashGenerator';
import { userMiddelware } from './../MiddelWares/UserMiddelware';
import { Router, Request, Response } from 'express';


const shareRouter = Router();

shareRouter.post("/share", userMiddelware,async function(req:Request,res:Response){
    try {
        const share=req.body.share;
        if(share){
            const exisistingLink=await linkModel.findOne({
                userId:req.userId
            })
            if(exisistingLink){
                res.status(200).json({
                    msg:"link already exists",
                    link:exisistingLink.hash
                })
                return;
            }
            const hash= createHash(20);
            const newLink=await linkModel.create({
                hash:hash,
                userId:req.userId
            })
            res.status(200).json({
                msg:"link created successfully",
                link:newLink.hash
            })
        }
    } catch (error) {
        res.status(501).json({
            error:error,
            msg:"something went wrong"
        })
    }
});


shareRouter.get("/:shareLink", async function(req:Request,res:Response){
    try {
        const shareableLink=req.params.shareLink;


        const link=await linkModel.findOne({
            hash:shareableLink
        })

        if(!link){
            res.status(403).json({
                msg:"link doesnt exxist",
            })
            return;
        }
        const content:ContentSchema[]=await contentModel.find({
            userId:link.userId
        })

        const user=await userModel.findOne({
            _id:link.userId
        })

        if(!user){
            res.status(403).json({
                msg:"user doesnt exists"
            })
            return;
        }
        res.status(200).json({
            msg:"shareable link retrived successfully",
            content:content,
            userName:user.username
        })

    } catch (error) {
        res.status(501).json({
            msg:"something went wrong",
            error:error
        })
    }
});

export default shareRouter;