
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";



export const userMiddelware=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const userToken =req.headers["authorization"];
        if(!userToken){
            res.status(401).json({
                msg:"user not authorized"
            })
        }
        else{
        const decodedToken=jwt.verify(userToken,process.env.JWT_SECRET_TOKEN)
        req.userId=(decodedToken as JwtPayload).id;
        next();
        }
    } catch (error) {
        res.status(501).json({
            error:error,
            msg:"you are not authorized to access this route"
        })
    }
}