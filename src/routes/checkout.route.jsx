import {requireAuth} from "utility/handler.jsx";

export default {
    path: "",
    childRoutes:
        [
            {
                path: "thankyou/:sosysno",
                getComponent(location, callback){
                    require.ensure([], (require)=> {
                        callback(null, require("pages/member/thankyou.jsx").default);
                    });
                },
                onEnter(...args){
                    requireAuth(...args);
                }
            },
            {
                path: "recharge/:sosysno",
                getComponent(location, callback){
                    require.ensure([], (require)=> {
                        callback(null, require("pages/member/recharge.jsx").default);
                    });
                },
                onEnter(...args){
                    requireAuth(...args);
                }
            },
            {
                path: "checkout",
                getComponent(location, callback){
                    require.ensure([], (require)=> {
                        callback(null, require("pages/shopping/checkout.jsx").default);
                    });
                },
                onEnter(...args){
                    requireAuth(...args);
                }
            },
            {
                path: "paysuccess/:sosysno",
                getComponent(location, callback){
                    require.ensure([], (require)=> {
                        callback(null, require("pages/shopping/paysuccess.jsx").default);
                    });
                }
            }
        ]
};
