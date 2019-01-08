let setCache=(key,value)=>{

	if(value instanceof Object){
		window.localStorage.setItem(key,JSON.stringify(value));
	}
	else{
		window.localStorage.setItem(key,value);
	}
}

let getCache=(key)=>{
	let value = window.localStorage.getItem(key);
	let result;
	try{
		result=JSON.parse(value);
	}
	catch(ex){
		result=value;
	}
	return result;
}

let removeCache=(key)=>{
	window.localStorage.removeItem(key);
}

let setSessionCache=(key,value)=>{
	try {
		if (value instanceof Object) {
			window.sessionStorage.setItem(key, JSON.stringify(value));
		}
		else {
			window.sessionStorage.setItem(key, value);
		}
	}
	catch(e) {
		console.log(e.toString());
	}
}

let getSessionCache=(key)=>{
	let value=window.sessionStorage.getItem(key);
	let result;
	try{
		result=JSON.parse(value);
	}
	catch(ex){
		result=value;
	}
	return result;
}

let removeSessionCache=(key)=>{
	window.sessionStorage.removeItem(key);
}

export {
	getCache,setCache,removeCache,
	getSessionCache,setSessionCache,removeSessionCache
}