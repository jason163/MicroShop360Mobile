import client from "utility/rest-client.jsx";

class OrderDetailService{
    getOrderInfo(sosysno){
        return client.post("/order/GetOrderDetail",{"sosysno":sosysno}).then((res)=> {
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Message);
            return false;
        });
    }
    getRechargeOrderInfo(sosysno){
        return client.post("/order/GetRechargeOrderDetail",{"sosysno":sosysno}).then((res)=> {
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Message);
            return false;
        });
    }

    getOrderTracking(sosysno) {
        return client.post("/order/GetOrderLog", {sosysno}).then((res)=> {
            if (res.body.Success) {
                return res.body;
            }
            throwError(res.body.Message);
            return false;
        });
    }
    updateOrderPayType(soSysNo,payTypeID){
        return client.post("/order/UpdateSOPayType",{soSysNo,payTypeID}).then((res)=>{
            if(res.body.Success){
                return true;
            }
            throwError(res.body.Message);
            return false;
        })
    }
    updateRechargePayType(soSysNo,payTypeID){
        return client.post("/order/updateRechargePayType",{soSysNo,payTypeID}).then((res)=>{
            if(res.body.Success){
                return true;
            }
            throwError(res.body.Message);
            return false;
        })
    }
    callOnlinePay(soSysNo){
        return client.get(`/order/OnlinePay/${soSysNo}`).then((res)=>{
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Messages);
            return false;
        })
    }
    callWechatPay(soSysNo){
      return client.get(`/order/OnlinePay/${soSysNo}`).then((res)=>{
          if(res.body.Success){
              return res.body;
          }
          throwError(res.body.Messages);
          return false;
      })
    }
    callWechatRechargePay(soSysNo){
        return client.get(`/pay/OnlinePay/${soSysNo}`).then((res)=>{
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Messages);
            return false;
        })
    }
}
export default new OrderDetailService();