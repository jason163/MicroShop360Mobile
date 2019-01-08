import client from "utility/rest-client.jsx";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import validation from "config/validation.config.jsx";
import strings from "config/strings.config.json";
import clinetType from "utility/handler.jsx";

class RegisterService {
	register(tel, pwd, nickName,agree) {
		function stringTrim(s) {
			return s.replace(/\s|\xA0/g,"");
		}
		if(!validation.nickName.r.test(stringTrim(nickName))){
			return new Promise((resolve,reject)=>{
				throwError(validation.nickName.m);
			});
		}
		if(!validation.phone.r.test(tel)){
			return new Promise((resolve,reject)=>{
				throwError(validation.phone.m);
			});
		}
		if(!validation.pwd.r.test(stringTrim(pwd))){
			return new Promise((resolve,reject)=>{
				throwError(validation.pwd.m);
			});
		}
		if(!agree){
			return new Promise((resolve,reject)=>{
				throwError(strings.pleaseAgreeContract);
			});

		}

		let channelid="";
		if(clinetType.isAndorid) {
			let responseData = window.baiduChannelId.getChannelId();
			channelid=responseData;
            cache.setCache('baiduChannelId',channelid);
		}

		if(clinetType.isPhone) {
			this.setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler('getChannelIdObjc', function responseCallback(responseData) {
					channelid=responseData;
                    cache.setCache('baiduChannelId',channelid);
                    let request={tel, pwd, nickName,channelid};
                    client.post("/Common/Register", request).then((res)=> {
                        if (res.body.Success) {
                            let token=res.headers[keys.cookieName.toLowerCase()];
                            if(!token){
                                token=res.body.Data;
                            }
                            cache.removeCache(keys.register);
                            cache.removeCache(keys.identity);
                            cache.setCache(keys.token,token);
                            return true;
                        }
                        throwError(res.body.Message);
                        return false;
                    });
				});
			});

			return true;
		}else{
            let openid = reactCookie.load("match.weixin.openid");
            let request={tel, pwd, nickName};
            if(!Object.is(openid,undefined)&&!Object.is(openid,null)&&!Object.is(openid,""))
            {
                request={tel, pwd, nickName,channelid,openid}
            }
            else {
                openid="";
                request={tel, pwd, nickName,channelid,openid};
            }
            return client.post("/Common/Register", request).then((res)=> {
                if (res.body.Success) {
                    let token=res.headers[keys.cookieName.toLowerCase()];
                    if(!token){
                        token=res.body.Data;
                    }
                    cache.removeCache(keys.register);
                    cache.removeCache(keys.identity);
                    cache.setCache(keys.token,token);
                    return true;
                }
                throwError(res.body.Message);
                return false;
            });
		}


	}
	checkPhoneIsRegister(tel){
		if(!tel || tel===""){
			return new Promise((resolve,reject)=>{
				throwError(strings.phoneNotEmpty);
			});
		}
		if(!validation.phone.r.test(tel)){
			return new Promise((resolve,reject)=>{
				throwError(validation.phone.m);
			});
		}
		console.log(tel);
		return client.post("/Common/CheckTelIsExist",{tel}).then((res)=>{
			if(res.body.Success){
				return true;
				// throwError(res.body.Message);
			}
			cache.setCache(keys.register,"registertrue");
			return false;
		});
	}

    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        let WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
        return null;
    }
}
export default new RegisterService();