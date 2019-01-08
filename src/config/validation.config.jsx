import strings from "config/strings.config.json";
export default{
	phone:{
		r:/^1[0-9]{10}$/
		,	m:strings.invalidPhoneNumber
	}
	,pwd:{
		r:/^.{6,20}$/
		,m:strings.invalidPwd
	}
	,nickName:{
		r:/^.{1,10}$/
		,m:strings.invalidNickName
	}
	,notEmpty:{
		r:/^.+$/
		,m:strings.notEmpty
	}
	,idCard: {
		r: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
		, m: strings.invalidIDCard
	}
	,realName:{
		r:/^[\u4E00-\u9FA5]{2,8}$/
		,m:strings.invalidRealName
	},
	containHtml:{
		r:/^<([^>]*)>$/
		,m:strings.invalidInput
	}
}