export default {
    path: "",
    childRoutes:
        [
            {
                path: "shoppingcart",
                getComponent(location, callback){
                    require.ensure([], (require)=> {
                        callback(null, require("pages/shopping/shopping-cart.jsx").default);
                    });
                }
            }
        ]
};