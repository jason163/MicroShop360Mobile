import client from "utility/rest-client.jsx";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import appConfig from "config/app.config.json";
import strings from "config/strings.config.json";
import validation from "config/validation.config.jsx";
import clinetType from "utility/handler.jsx";

class Auth {
    login(userInfo) {
		let user = userInfo;
        if (user.tel === "") {
            return new Promise((resolve, reject)=> {
                throwError(strings.phoneNotEmpty);
            });
        }
        if (!validation.phone.r.test(user.tel)) {
            return new Promise((resolve, reject)=> {
                throwError(validation.phone.m);
            });
        }
        if (!validation.pwd.r.test(user.pwd)) {
            return new Promise((resolve, reject)=> {
                throwError(validation.pwd.m);
            });
        }
        if(clinetType.isAndorid) {
            let responseData = window.baiduChannelId.getChannelId();
            user = Object.assign(user,{chanelID:responseData});
        }
        else if(clinetType.isPhone) {
            this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('getChannelIdObjc', function responseCallback(responseData) {
                    user = Object.assign(user,{chanelID:responseData});
                });
            });
        }

        let openid = reactCookie.load("match.weixin.openid");
        if(!Object.is(openid,undefined)&&!Object.is(openid,null)&&!Object.is(openid,""))
        {
            user.openID=openid;
        }

        return client.post("/Common/Login", user).then((res)=> {
            if (res.body.Success) {
                //登录成功后清除之前的用于判断是否是认证用户的缓存
                cache.removeCache(keys.isWorker);
                let token = res.headers[keys.cookieName.toLowerCase()];
                if (!token) {
                    token = res.body.Data;
                }
                if (token) {
                    cache.setCache(keys.token, token);
                }
                else {
                    throwError(strings.invalidToken)
                }             
            }
            else {
                throwError(res.body.Message);
            }
            // console.log(token);
            // window._token_=token;
            //save token
        });
    }

    weixinLoginBack(code,returnurl){
        return client.post(`/WeiXin/WXLoginBack`,{code}).then((res)=> {
            if (res.body.Success) {
                //登录成功后清除之前的用于判断是否是认证用户的缓存
                cache.removeCache(keys.isWorker);
                let token = res.headers[keys.cookieName.toLowerCase()];
                if (!token) {
                    token = res.body.Data.Token;
                }
                if (token) {
                    cache.setCache(keys.token, token);
                }
                else {
                    throwError(strings.invalidToken)
                }
                let openid = res.body.Data.OpenID;
                if(openid){
                    cache.setCache("match.weixin.openid", openid);
                    window.reactCookie.save("match.weixin.openid",openid,{ path: '/', maxAge: 3600 * 24 * 30 });
                }
                return true;
            }
        });
    }

    logout() {
        cache.removeCache(keys.token);
        cache.removeSessionCache(keys.tabPageActive);
        cache.removeSessionCache(keys.previousRoutePathname);
        cache.removeSessionCache(keys.previousRouteState);
        reactCookie.remove("match_customer_auth","/");
        reactCookie.remove("match.weixin.openid","/");
    }


    isLogin() {
        let token = cache.getCache(keys.token);
        return token ? true : false;
    }

 

    findPassword(tel, newPassword, code) {
        function stringTrim(s) {
            return s.replace(/\s|\xA0/g, "");
        }

        if (tel === "") {
            return new Promise((resolve, reject)=> {
                throwError(strings.phoneNotEmpty);
            });
        }
        if (!validation.phone.r.test(tel)) {
            return new Promise((resolve, reject)=> {
                throwError(validation.phone.m);
            });
        }
        if (!validation.notEmpty.r.test(code)) {
            return new Promise((resolve, reject)=> {
                throwError(strings.verifyCodeNotEmpty);
            });
        }
        if (!validation.pwd.r.test(stringTrim(newPassword))) {
            return new Promise((resolve, reject)=> {
                throwError(validation.pwd.m);

            });
        }

        return client.post("/Common/FindPassword", {tel, newPassword, code}).then((res)=> {
            if (res.body.Success) {
                return true;
            }
            throwError(res.body.Message);
            return false;
        });
    }

    getUserBasicInfo() {
        return client.get("/Customer/GetCustomerInfo").then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            if (res.body.Code !== 401) {
                throwError(res.body.Message);
            }

            return null;
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
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
        return null;
    }
}

export default new Auth();