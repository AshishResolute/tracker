export class ValidatonError extends Error {
  public statusCode: number;
  public internalMessage: string[];
  // or just use constructor(message,public statusCode:number,public internalMessage:string)-> then no need to decalare the properties inside class ts declares and assigns the value
  constructor(message: string, statusCode: number, internalMessage: string[]) {
    super(message);
    ((this.statusCode = statusCode), (this.internalMessage = internalMessage.map((err):string=>err)));
  }
}
// here validationError is an child class that inherits all the properties and methods from the parent class Error
// one thing is inside the chlild class constructor we need to call the constructor of the parent class using super(parameters) make sure to pass the expected arguments
