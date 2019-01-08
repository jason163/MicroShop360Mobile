import * as Helper from "pages/helper-list.jsx";
import * as Test from "pages/test.jsx";
import {Setting, About} from "pages/setting.jsx";
export default {
    path: ""
    , childRoutes: [
        {
            path: "test"
            ,onEnter(routers,replace,callback){
            callback();
        }
            , component: Test
        }
        ,
        {
            path: "setting"
            , component: Setting
        }, {
            path: "about",
            component: About
        }, {
            path: "helperList"
            , indexRoute: {
                component: Helper.HelperIndex
            }
            , childRoutes: [{
                path: "helperDetail"
                , component: Helper.HelperDetail
            }]
        }]
};