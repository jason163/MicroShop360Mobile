export default (location, callback)=> {
    require.ensure([], (require)=> {
            callback(null, [
                require("routes/product.route.jsx").default
                , require("routes/login.route.jsx").default
                , require("routes/mine.route.jsx").default
                , require("routes/checkout.route.jsx").default
                , require("routes/shoppingcart.route.jsx").default
                , require("routes/search.route.jsx").default
                , require("routes/promotion.route.jsx").default
                , require("routes/other.route.jsx").default
                , require("routes/info.route.jsx").default
                , require("routes/404.route.jsx").default
            ]);
    });

};



