
export default {
    path: ""
    , childRoutes: [
        {
            path: "activity/:id"
            ,onEnter(routers,replace,callback){
            let path=routers.location.pathname;
            _hmt.push(['_trackPageview', `/m/#/${path}`]);
            callback();
        }
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/activity/activity.jsx").default);
            });
        }
        }
    ]
};
