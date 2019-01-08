/**
 * Created by liu.yao on 2016/6/27.
 */
import client from "utility/rest-client.jsx";
class RMARequestService {

    /**
     * 创建退换申请
     * @param param
     * @returns {Request|*|Promise|Promise.<TResult>}
     */
    createRMARequest(request) {
        if (!Object.is(request, null) && !Object.is(request, undefined)) {
            let url = "/RMA/CreateRMARequest";
            return client.post(url, {rma:JSON.stringify(request)}).then((response)=> {
                return response;
            });
        }
        return new Promise((resolve, reject)=>{reject();});
    }

    getRMAMaster(sosysno,productSysNo)
    {
        let url="/RMA/GetRMAMaster";
        if(!Object.is(sosysno, null) && !Object.is(sosysno, undefined)&&!Object.is(productSysNo, null) && !Object.is(productSysNo, undefined))
        {
            url=`${url}?sosysno=${sosysno}&productSysNo=${productSysNo}`;
            return client.get(url).then((response)=> {
                return response;
            });
        }
        return new Promise((resolve, reject)=>{reject();});
    }
}
export default new RMARequestService();