import mongoose from "mongoose";


const chatSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
}, 
{
    timestamps: true
}

)


export default mongoose.model("Chat", chatSchema);