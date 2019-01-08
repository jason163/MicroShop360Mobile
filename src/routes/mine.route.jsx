import {requireAuth} from "utility/handler.jsx";
import UserInfoUpdate from "pages/member/userinfo.jsx"
import receiveAddress from "pages/member/receiveaddress.jsx";
import receiveAddressDetail from "pages/member/address-detail.jsx";
import * as RMARequest from "pages/member/rma_request_page.jsx";
import Evaluation from "pages/member/evaluation.jsx";
import CouponPage from "pages/member/coupon.jsx";
import OrderListPage from "pages/member/orderlist.jsx";
import * as order from "pages/member/order-detail.jsx";
import FavoriteList from "pages/member/favorite-list.jsx";

export default {
    path: "mine"
    , onEnter(...args){
        requireAuth(...args);
    }
    , indexRoute: {
        getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/member/mine.jsx").AccountManagement);
            });
        }
    }
    , childRoutes: [
        {
            path: "changepwd",
            getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/member/mine.jsx").ChangePwd);
                });
            }
        }, {
            path: "updatephone"
            , getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/member/mine.jsx").MineUpdatePhone);
                });
            }
        }, {
            path: "updatename"
            , getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/member/mine.jsx").MineUpdateName);
                });
            }
        }, {
            path: "authentication"
            , component: UserInfoUpdate
        }, {
            path: "receiveaddress"
            , component: receiveAddress
        }, {
            path: "receiveaddress/detail"
            , component: receiveAddressDetail
        }, {
            path: "rmarequest"
            , indexRoute: {
                component: RMARequest.RMARequestIndex
            }
            , childRoutes: [{
                path: "childrequest"
                , component: RMARequest.ChildRequest
            }]
        }, {
            path: "evaluation"
            , component: Evaluation
        }, {
            path: "coupon"
            , component: CouponPage
        }, {
            path: "orderlist"
            , component: OrderListPage
        }, {
            path: "orderdetail/:sosysno"
            , component: order.OrderDetail
        }, {
            path: "orderlogistic/:sosysno"
            , component: order.OrderLogistic
        }, {
            path: "favorite"
            , component: FavoriteList
        }, {
            path: "updategender"
            , getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/member/mine.jsx").UpdateGender);
                });
            }
        }, {
            path: "updatebirthday"
            , getComponent(location, callback){
                require.ensure([], (require)=> {
                    callback(null, require("pages/member/mine.jsx").UpdateBirthday);
                });
            }
        }, {
            path: "rechargeList"
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/recharge/recharge-list.jsx").RechargeIndex);
            });
        }
        },
        {
            path: "consumList"
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/member/consumlist.jsx").ConsumIndex);
            });
        }
        },
        {
            path: "reservationRecordsList"
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/member/reservationrecords-list.jsx").ReservationIndex);
            });
        }
        },
        {
            path: "reservationRecords"
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/member/reservationrecords-detail.jsx").reservationDetail);
            });
        }
        },
        {
            path: "recharge"
            ,getComponent(location, callback){
            require.ensure([], (require)=> {
                callback(null, require("pages/recharge/recharge-detail.jsx").rechargeDetail);
            });
        }
        }, {
            path: "welfare/:id"
            , getComponent(location, callback){
                require.ensure([], (require) => {
                    callback(null, require("pages/product/promotion.jsx").default);
                });
            }
        }
    ]
};



