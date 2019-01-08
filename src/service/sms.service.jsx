import client from "utility/rest-client.jsx";
import validation from "config/validation.config.jsx";
import strings from "config/strings.config.json";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";

class SMSService {
	fetchValidationCode(tel,type) {
		return client.post("/Common/SendSMS", {tel,type}).then((res)=> {
			if(res.body.Success){
				return true;
			}
			throwError(res.body.Message);
			return false;
		});
	}

	checkValidationCode(tel, code) {
		if(!validation.phone.r.test(tel)){
			return new Promise((resolve,reject)=>{
				throwError(validation.phone.m);
			});
		}
		if(!code || code===""){
			return new Promise((resolve,reject)=>{
				throwError(strings.verifyCodeNotEmpty);
			});
		}
		return client.post("/Common/ValidateTelWithCode", {tel, code}).then((res)=> {
			if(res.body.Success){
				cache.setCache(keys.identity,"identitytrue");
				return res.body;
			}
			throwError(res.body.Message);
			return null;
		});
	}

	 
}

export default new SMSService();