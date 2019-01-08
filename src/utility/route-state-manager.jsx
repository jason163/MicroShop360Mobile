import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";

let getPreviousState=()=>{
	return cache.getSessionCache(keys.previousRouteState);
}
let setPreviousState=(state)=>{
	cache.setSessionCache(keys.previousRouteState,state);
}

let setPreviousPathname=(pathname)=>{
	cache.setSessionCache(keys.previousRoutePathname,pathname);
}

let getPreviousPathname=()=>{
	return cache.getSessionCache(keys.previousRoutePathname);
}

export default {
	getPreviousState
	,setPreviousState
	,getPreviousPathname
	,setPreviousPathname
}