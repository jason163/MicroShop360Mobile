import client from "utility/rest-client.jsx";

 class CountdownService{

    /*限时抢购列表服务*/
    getCountdownList(idx,size){
        return client.get(`/Promotion/CountdownList?idx=${idx}&sz=${size}`).then((res)=>{
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
     /*限时抢购列表服务*/
     getRecommendProductList(idx,size){
         return client.get(`/Promotion/RecommendProduct?idx=${idx}&sz=${size}`).then((res)=>{
             if (res.body.Success) {
                 return res.body.Data;
             }
             throwError(res.body.Message);
             return false;
         });
     }
     /*促销模板服务*/
     getPromotionTemplate(sysno){
         return client.post("/Promotion/LoadPromotionTemplate",{sysno}).then((res)=>{
             if(res.body.Success){
                 return res.body.Data;
             }

             throwError(res.body.Message);
             return false;
         })
     }


     getcouponinfo(sysno){
         return client.post("/Promotion/GetCoupon",{sysno}).then((res)=>{
             if(res.body.Success){
                 return res.body.Data;
             }

             throwError(res.body.Message);
             return false;
         })
     }

     receivecoupon(couponActivitySysNo){
         return client.get(`/Customer/ReceiveCoupons?couponActivitySysNo=${couponActivitySysNo}`).then((res)=>{
             return res;             
         })
     }
}


export default new CountdownService();