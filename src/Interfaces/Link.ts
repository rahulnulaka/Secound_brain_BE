import mongoose, {Document} from "mongoose";

interface Link extends Document{
    hash:string,
    userId: mongoose.Schema.Types.ObjectId
}


export default Link;