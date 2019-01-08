export default {
    path: ""
    , childRoutes: [
        {
        path: "countdown"
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/product/cd-list.jsx").default);
            });
        }
    }, {
        path: 'recommendproduct'
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
        require.ensure([], (require)=> {
            callback(null, require("pages/product/reproduct-list.jsx").default);
        });
        }

        },{
        path: 'promotion/:id'
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
        require.ensure([], (require)=> {
            callback(null, require("pages/product/promotion.jsx").default);
        });
        }
    }, {
        path: 'coupon/:id'
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
        require.ensure([], (require)=> {
            callback(null, require("pages/product/promotion.jsx").GetCoupon);
        });
        }
    }]
}