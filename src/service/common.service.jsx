import client from "utility/rest-client.jsx";
class Common {

    /**
     * 证书类型
     */
    getCredentiaTypes() {

    }

    /**
     * 证书等级
     */
    getCredentiaLevels() {
        let url = "/WorkerMgt/GetDictListByDictTypeKey";
        let data = {
            dictTypeKey: '015'
        };
        return client.post(url, {projectSysNo: data}).then((ret) => {
            let retData = [];
            if (ret.body.Success) {


            }
            else {
                showMessage(ret.body.Message);
            }

            return retData;
        });
    }

    /**
     * 获取数据库字典表配置项
     * @param param
     * @returns {*|Request|Promise.<T>}
     */
    getDicList(param) {
        let url = "/WorkerMgt/GetDictListByDictTypeKey";
        let data = {
            dictTypeKey: param
        };
        return client.post(url, {projectSysNo: data}).then((ret) => {

            let retData = [];
            if (ret.body.Success) {


            }
            else {
                showMessage(ret.body.Message);
            }

            return retData;
        });
    }
}