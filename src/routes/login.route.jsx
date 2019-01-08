import * as Register from "pages/login/register.jsx";
import FindPassword from "pages/login/find-password.jsx";
import * as Cache from "utility/storage.jsx";
import clinetType from "utility/handler.jsx";
import keys from "config/keys.config.json";
import appConfig from "config/app.config.json";
import reactCookie from "utility/react-cookie.js";

export default {
    path: ""
    , childRoutes: [
        {
            path: "login"
            , onEnter(routers, replace, callback){
            /*let openid = reactCookie.load("match.weixin.openid");
            if (clinetType.isWechat&&(Object.is(openid,undefined)||Object.is(openid,null)||Object.is(openid,""))) {
                let returnurl=appConfig.mhost;
                if(!Object.is(routers.location.state,null)&&!Object.is(routers.location.state.target,undefined)&&!Object.is(routers.location.state.target,null)&&!Object.is(routers.location.state.target,""))
                {
                    document.location.href = `http://m.yanghuolife.com/WeiXin/WXLogin?ReturnUrl=${returnurl}/#/${routers.location.state.target}`;
                }
                document.location.href = `http://m.yanghuolife.com/WeiXin/WXLogin?ReturnUrl=${returnurl}`;
            }*/
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
