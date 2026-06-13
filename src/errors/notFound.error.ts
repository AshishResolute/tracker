export class NotFoundError extends Error{
    constructor(message:string,public statusCode:number, public internalMessage:string )
    {
        super(message)
        this.statusCode=statusCode
        this.internalMessage=internalMessage
    }
}