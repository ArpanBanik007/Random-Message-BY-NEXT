import mongoose ,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content : string,
    createdAt:Date,
}

const MessageSchema : Schema<Message> = new Schema({
 
    content: {
        type :String,
        required:true,
    },
    createdAt: {
        type :Date,
        required:true,
        default: Date.now
    },

})



export interface User extends Document{
    username : string,
    email:string,
    password:string,
    verifycode:string,
    verifycodeExpire:Date,
    isAcceptingMessage:boolean,
    message:Message[],
    isverified:boolean,
    createdAt:Date,
}


const UserSchema: Schema<User> = new Schema({

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },

    verifycode: {
        type: String,
        required: [true, "Verification code is required"],
    },

    verifycodeExpire: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    message: {
        type: [MessageSchema],
        default: [],
    },

    isverified:{
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});


const UserModel=(mongoose.models.User as mongoose.Model<User>)
|| mongoose.model<User>("User", UserSchema);

export default UserModel;


