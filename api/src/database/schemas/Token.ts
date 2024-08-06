import { Schema, model } from "mongoose";

const TokensBlackListSchema = new Schema({
    token: { type: String, required: true },  
})

export const TokensBlackList = model('tokens_blacklist', TokensBlackListSchema)