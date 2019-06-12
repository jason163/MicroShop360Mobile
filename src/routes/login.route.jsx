import * as Register from "pages/login/register.jsx";
import FindPassword from "pages/login/find-password.jsx";
import * as Cache from "utility/storage.jsx";
import clinetType from "utility/handler.jsx";
import keys from "config/keys.config.json";
import appConfig from "config/app.config.json";
import AuthService from "service/auth.service.jsx";
import reactCookie from "utility/react-cookie.js";


export default {
    path: ""
    , childRoutes: [
        {
            path: "login"
            , onEnter(routers, replace, callback){
            let returnurl=appConfig.mhost;
            let openid = window.reactCookie.load("match.weixin.openid");
            if (clinetType.isWechat&&(Object.is(openid,undefined)||Object.is(openid,null)||Object.is(openid,""))){
                let reqCode;
                let query = window.location.search.substring(1);
                if(query !==""){
                    let vars = query.split("&");
                    for (let i=0;i<vars.length;i++) {
                        let pair = vars[i].split("=");
                        if(pair[0] === 'code'){
                            reqCode=pair[1];
                        }
                    }
                }
                if(Object.is(reqCode,undefined) || Object.is(reqCode,"")||Object.is(reqCode,null)){
                    document.location.href = `http://appsvc.great-land.net/WeiXin/WXLogin?ReturnUrl=${returnurl}`;
                }else {
                    AuthService.weixinLoginBack(reqCode,`${returnurl}/?code=${reqCode}`);
                }
                router.replace("/");
                callback();
            }
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/login/login.jsx").default);
            });
        }
        }, {
            path: "findpassword"
            , component: FindPassword
        }, {
            path: "register"
            , indexRoute: {
                component: Register.Register
            }
            , childRoutes: [{
                path: "identity",
                onEnter(routers, replace, callback){
                    let path=routers.location.pathname;
                    _hmt.push(['_trackPageview', `/m/#/${path}`]);

                    if (Cache.getCache(keys.register) !== "registertrue") {
                        replace({
                            pathname: "/register"
                        });
                        callback();
                    }
                    callback();
                }
                , component: Register.RegisterIdentityCode
            }, {
                path: "account",
                onEnter(routers, replace, callback){
                    let path=routers.location.pathname;
                    _hmt.push(['_trackPageview', `/m/#/${path}`]);

                    if (Cache.getCache(keys.identity) !== "identitytrue") {
                        replace({
                            pathname: "/register"
                        });
                        callback();
                    }
                    callback();
                }
                , component: Register.RegisterAccount
            }, {
                path: "agreement"
                , component: Register.RegisterAgreement
            }]
        }
    ]
};
