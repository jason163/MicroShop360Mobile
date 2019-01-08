
import client from "utility/rest-client.jsx";
class RechargeService {
    /**
     * 充值列表
     * @param param
     * @returns {*|Request|Promise|Promise.<TResult>}
     */
    getRechargeListData(pageIndex) {
        let url = "/Customer/GetCustomerRechargeList";
        let data = {pageindex: pageIndex};
        return client.post(url, data).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
        /*
        if (param !== undefined && param !== -1) {
            url = `${url}/?pageIndex= ${param}`;
        }
        return client.get(url).then((res)=> {
            let retData = [];
            if (res.body.Success) {

                let items = res.body.Data.data;
                if (items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        let item = {};
                        item.SysNo = items[i].SysNo;
                        item.CustomerSysNo = items[i].CustomerSysNo;
                        item.RechargeAmount = items[i].RechargeAmount;
                        item.PayTypeID = items[i].PayTypeID;
                        item.RechargeSource = items[i].RechargeSource;
                        item.RechargeStatus=items[i].RechargeStatus;
                        item.SerialNumber = items[i].SerialNumber;
                        item.RechargeActionStr = items[i].RechargeActionStr;
                        item.Memo = items[i].Memo;
                        item.InDateStr = items[i].InDateStr;
                        item.InUserSysNo = items[i].InUserSysNo;
                        item.CompanyCode = items[i].CompanyCode;
                        item.PayTypeName = items[i].PayTypeName;

                        retData.push(item);
                    }
                }
            } else {
                showMessage(res.body.message);
            }
            return retData;
        });
*/
    }
     /*插入充值记录*/

    InsertRecharge(rechargeAmount){
        let url = `/Customer/InsertRecharge?rechargeAmount=${rechargeAmount}`;
        return client.post(url).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
}
export default new RechargeService();