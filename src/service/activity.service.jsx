
import client from "utility/rest-client.jsx";


export class activityService{

    /*商品详细页服务*/
    getActivityDetail(sysNo){
        return client.get(`/Activity/ActivityDetail?sysNo=${sysNo}`).then((res)=>{
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Message);
            return false;
        });
    }

}

export default new activityService();