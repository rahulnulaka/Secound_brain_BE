import mongoose, {Schema,model} from "mongoose";
import ContentTypes from "../Enums/TagsType";

const userSchema = new Schema({
    username:{type:String, required:true,unique:true},
    password:{type:String, required:true}
})


const contentSchema=new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: Object.values(ContentTypes), required: true },
    title: { type: String, required: true },
    tags: [{ type:String, ref: 'Tag' }],
    userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const tagSchema=new Schema({
    title:{type:String, required:true}
})


const linkSchema= new Schema({
    hash:{type:String, required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
})

const userModel=model("users", userSchema);
const contentModel=model("contents", contentSchema);
const tagModel=model("tags", tagSchema);
const linkModel=model("links", linkSchema);

export {userModel, contentModel, tagModel, linkModel};