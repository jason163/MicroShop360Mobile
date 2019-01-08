/**
 * Created by cd033 on 16/6/28.
 */
import client from "utility/rest-client.jsx"

class UserInfoService {
    getUserInfo() {
        return client.get("/Customer/LoadCustomerAuthentication").then((res)=>{
            let result = null;
            if(res.body.Success){
                result = res.body.Data;
            }else {
                showMessage(res.body.Message);
            }
            return result;
        })
    }

    updateUserInfo(PhoneNumber,Name,IDCardNumber,Address,Birthday,Email,Gender) {
        return client.post("/Customer/UpdateCustomerAuthentication",{
            PhoneNumber,
            Name,
            IDCardNumber,
            Address,
            Birthday,
            Email,
            Gender
        }).then((res)=>{
            return res.body;
        });
    }
}

export default new UserInfoService();