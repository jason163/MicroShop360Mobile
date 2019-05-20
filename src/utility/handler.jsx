import auth from "service/auth.service.jsx";
import keys from "config/keys.config.json";
import * as cache from "utility/storage.jsx";

let requireAuth = (routes, replace, callback)=> {
	let location=routes.location;
	// rsm.setPreviousPathname(location.pathname);
	if (!auth.isLogin()) {
		replace({
			pathname:"/login",
			state:{
				target:location.pathname
			}
		});
        let path=location.pathname;
        _hmt.push(['_trackPageview', `/m/#/${path}`]);

		callback();
	}
}


let getPageTransitionName=(platform,version,userAgent)=>{
	// console.log(platform,version,userAgent);
	// let originalTransition={
	// 	transitionTimeout:500
	// 	,transitionEnterName:"animation-page"
	// 	,transitionBackName:"animation-page-back"
	// };
	// if(/iphone/i.test(platform)){
	// 	return originalTransition;
	// }
	// if(/android (4\.[4-9]+|[5-9]\.[0-9]+)/i.test(version)){
	// 	return originalTransition;
	// }
	// if(/macintel/i.test(platform)){
	// 	return originalTransition;
	// }
	return null;
}
let isOnline=()=>{
	return navigator.onLine;
}

let runtime=(value)=>{
	if(value){
		cache.setSessionCache(keys.runtime,value);
		return value;
	}
	return cache.getSessionCache(keys.runtime);
}
let clientType=()=> {
	return {
		isWechat: /micromessenger/.test(navigator.userAgent.toLowerCase()),
		isPhone: /beauty360 ios phone/i.test(navigator.userAgent.toLowerCase()),
		isAndorid: /beauty360 android phone/i.test(navigator.userAgent.toLowerCase())
	}
}

export {
	requireAuth
	,getPageTransitionName
	,isOnline
	,runtime
	,clientType
};
export default new clientType()