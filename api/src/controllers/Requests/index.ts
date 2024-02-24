import { Request, RequestType, RequestTypeData } from "../../database/schemas/Request";

export default class RequestController {
    private validTimeInMin: number
    
    constructor(){
        this.validTimeInMin = 20
    }

    async fromThisDevice(deviceId: string) {
        const requests = await Request.find({ deviceId })
        const numberOfRequests = requests.filter((d) => (d.validUntil.getTime() - new Date().getTime()) > 0)

        return numberOfRequests.length
    }

    register(deviceId: string, type: RequestTypeData) {
        const validTime = new Date(new Date().getMinutes()+this.validTimeInMin)

        Request.create({
            id: deviceId,
            validUntil: validTime,
            type
        }).catch((err) => { throw new Error(err) })
    }
}
