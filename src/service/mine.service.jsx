import client from "utility/rest-client.jsx"
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";

class MineService {
    getaccountcenterinfo() {
        return client.get("/home/getaccountcenterinfo").then((res)=> {
            if (res.body.Success) {
                if (res.body.Data.Token&&!cache.getCache(keys.token)) {
                    cache.setCache(keys.token, res.body.Data.Token);
                }
                return res.body.Data;
            }
            throwError(res.body.Message);
            return null;
        });
    }
    //消费记录
    getconsumlist(pageIndex){
        let url = '/Customer/GetCustomerConsumList';
        let data = {pageindex: pageIndex};
        return client.post(url, data).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
    //预约记录
    getreservationlist(pageIndex){
        let url = '/Customer/GetCustomerReservationRecords';
        let data = {pageindex: pageIndex};
        return client.post(url, data).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
    //获取预约商品列表
    getReservationProduct() {
        return client.get("/Customer/GetReservationProduct")
            .then((res) => {
                if (res.body.Success) {
                    return res.body.Data;
                }
                throwError(res.body.Message);
                return false;
            })
    }
    //保存预约记录
    createReservationRecords(data) {
        return client.post('/Customer/InsertReservationRecords', data).then((response) => {
            if (response.body.Success) {
                return response.body.Data;
            }
            throwError(response.body.Message);
            return false;
        })
    }
    /* 确认消费记录，确认之后状态变成1*/
    confirmconsum(sysno,score){
        return client.post("/Customer/Confirmconsum",{sysno,score}).then((res)=>{
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
    queryfavoriteproduct(pageIndex) {
        let url = '/Customer/GetFavoriteProductList';
        let data = {pageindex: pageIndex};
        return client.post(url, data).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }

    removefavoriteproduct(productsysno) {
        let url = `/Customer/DeleteFavoriteProduct?productsysno=${productsysno}`;
        return client.get(url).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
}
export default new MineService();