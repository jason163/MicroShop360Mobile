
import client from "utility/rest-client.jsx";
class InfoService {
    /**
     * 首页公司资讯列表
     * @param param
     * @returns {*|Request|Promise|Promise.<TResult>}
     */
    getInfoListData(type,obj) {
        let url = `/Topic/GetList?type=${type}&pageIndex=${obj}`;
        return client.get(url).then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });

    }
    /**
     * 详情
     * @param param
     * @returns {Request|*|Promise|Promise.<TResult>}
     */
    getHelperDetail(param) {
        let url = "/Topic/Detail";
        if (param !== undefined && param !== -1) {
            url = `${url}/?sysno= ${param}`;
        }
        console.log(url);
        return client.get(url).then((res)=> {
            let retData = {};
            if (res.body.Success) {
                let item = res.body.Data;
                retData = item
            }
            else {
                showMessage(res.body.Message);
            }
            return retData;
        });
    }
}
export default new InfoService();