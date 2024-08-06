import { Schema, model } from "mongoose";

const requestSchema = new Schema({
    id: { type: String, require: true, id: true },
    type: { type: String, require: true },
    validUntil: { type: Date, require: true, default: new Date().setMinutes(new Date().getMinutes()+20) }
})

const Request = model('Rs', requestSchema)

type RequestTypeData = 'change-password'
const RequestType: { [key: string]: RequestTypeData } = {
    CHANGE_PASSWORD: 'change-password'
}

export { Request, RequestType, RequestTypeData }