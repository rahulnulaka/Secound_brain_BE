import {Document} from "mongoose";


interface Tag extends Document{
    title:string
}

export default Tag;