export default class BusinessError {
	constructor(message,delay=3000,name="BusinessError"){
		this.message=message;
		this.delay=delay;
		this.name=name;
	}
}


