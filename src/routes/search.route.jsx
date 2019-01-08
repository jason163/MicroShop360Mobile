
export default {
    path: ""
    , childRoutes: [{
        path: "category"
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/product/category.jsx").Categorizer);
            });
        }
    }, {
        path: "search"
        ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
        ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/product/search.jsx").default);
            });
        }
    }]
}