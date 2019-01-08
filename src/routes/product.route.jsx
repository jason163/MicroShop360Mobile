
export default {
    path: ""
    , childRoutes: [
        {
            path: "product/:id"
            ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
            ,getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/product/product.jsx").default);
                });
            }
        },{
            path: "bigPic/:id"
            ,getComponent(location,callback){
                require.ensure([],(require)=>{
                    callback(null,require("pages/product/productPic.jsx").default);
                })
            }
        }
    ]
};
