//工人相关的service
import client from "utility/rest-client.jsx";
import authService from "./auth.service.jsx";

class worker {
    queryBadRecords() {
        return client.get("/workermgt/getworkerbadrecordslist").then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return null;
        });
    }

    queryGoodRecords() {
        return client.get("/WorkerMgt/GetWorkerGoodRecordsList").then((res)=> {
            return res.body.Data;
        });
    }

    queryTrainingRecords() {
        return client.get("/WorkerMgt/GetWorkerTrainingList").then((res)=> {
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return null;
        });
    }

    queryTrainingDetail(projectSysNo) {
        let data = [];
        return client.post("/WorkerMgt/GetWorkerTrainingDetail", {projectSysNo}).then((res)=> {
            if (res.body.Success) {
                if (res.body.Data.length > 0) {
                    data = res.body.Data;
                }
                return data;
            }
            throwError(res.body.Message);
            return data;
        });
    }

    /*修改密码*/
    changePassword(data) {
        return client.post("/Customer/ChangePwd", data).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
                authService.logout();
            }
            return res.body.Message;
        });
    }

    /*绑定邮箱*/
    bindEmail(emailAddress) {
        return client.post("/WorkerMgt/BindEmail", {email: emailAddress}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

    changePhoneNumber(phoneNumber, verifyCode) {
        return client.post("/Customer/UpdateCustomerTelphone", {cellphone: phoneNumber, validateCode: verifyCode}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

    getUserInfo() {
        let userFullInfo = {};
        return authService.getUserBasicInfo().then((user)=> {
            userFullInfo.user = user;
            return userFullInfo;
        });
    }

    sendVerifyCode(phoneNumber) {
        return client.post("/Common/ValidateTelWithCode", {newTel: phoneNumber}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

    updateUserName(name) {
        return client.post("/WorkerMgt/UpdateWorkerNickName", {nickName: name}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

    updateUserAvatar(avatarPath) {
        return client.post("/Customer/UpdateCustomerAvatar" , {path: avatarPath}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

    updateUserGender(gender) {
        return client.post("/Customer/UpdateCustomerGender" , {gender: gender}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }
    updateUserBirthday(birthday) {
        return client.post("/Customer/UpdateCustomerBirthday" , {brithday: birthday}).then((res)=> {
            if (!res.body.Success) {
                throwError(res.body.Message);
            }
            return res.body.Message;
        });
    }

}

export default new worker();