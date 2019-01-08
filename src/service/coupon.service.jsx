/**
 * Created by cd033 on 16/6/27.
 */
import client from "utility/rest-client.jsx";

class CouponService {
    getCouponList(pageIndex) {
        return client.get(`/Customer/GetCouponsList?pageindex=${pageIndex}`).then((res)=>{
            if (res.body.Success){
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        })
    }
}
export default new CouponService();