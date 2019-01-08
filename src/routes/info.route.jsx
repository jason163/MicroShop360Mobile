
export default {
    path: ""
    , childRoutes: [
        {
            path: "infoList/:type"
            ,onEnter(routers,replace,callback){
                /*debugger;*/
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
                callback();
            }
            ,getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/info/info-list.jsx").InfoIndex);
                });
            }
        },{
            path:"infodetail"
            ,onEnter(routers,replace,callback){
                let path=routers.location.pathname;
                _hmt.push(['_trackPageview', `/m/#/${path}`]);
                callback();
            }
            ,getComponent(location,callback){
                require.ensure([],(require)=>{
                    callback(null,require("pages/info/info-detail.jsx").infoDetail);
                })
            }
        }]
};