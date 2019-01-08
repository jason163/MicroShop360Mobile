import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import authService from "service/auth.service.jsx";
import appConfig from "config/app.config.json";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import smsService from "service/sms.service.jsx";
import registerService from "service/register.service.jsx";
import strings from "config/strings.config.json";
import Loading from "components/loading.jsx";

export default class FindPassword extends React.Component {
	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	constructor(props) {
		super(props);
		this.state = {
			phoneNumber: "",
			smsSent: false,
			countdown: appConfig.smsDelay
		};
		// authService.getUserBasicInfo().then((userBasicInfo)=>{
		// 	// set phone number
		// 	this.setState(Object.assign({},this.state,{
		// 		phoneNumber:userBasicInfo.Tel
		// 	}));
		// });
		this.timer=null;
	}

	runCountdown() {
		let newCountdown = this.state.countdown - 1;
		if (newCountdown < 0) {
			this.setState(Object.assign({}, this.state, {
				smsSent: false,
				countdown: appConfig.smsDelay
			}));
		}
		else {
			this.setState(Object.assign({}, this.state, {
				countdown: newCountdown
			}));
			this.timer=setTimeout(()=> {
				this.runCountdown();
			}, 1000);
		}
	}

	componentWillUnmount(){
		if(this.timer){
			clearTimeout(this.timer);
		}
	}

	submitNewPassword() {
		this.refs.loading.loading();
		// try {
			authService.findPassword(this.state.phoneNumber, this.refs.txtPwd.value, this.refs.txtCode.value).then((result)=> {
				this.refs.loading.loaded();
				if (result) {
					// remove auth
					cache.removeCache(keys.token);
					// navigate to login
					this.context.router.replace("/login");
				}
			}).catch(()=> {
				this.refs.loading.loaded();
			});
		// }
		// catch(ex){
		// 	console.log(ex);
		// 	this.refs.loading.loaded();
		// }
	}

	render() {
		let btnfindpwsVerifyCodeStyle = {};
		if (this.state.smsSent) {
			btnfindpwsVerifyCodeStyle.backgroundColor = "#aaa";
		}
		return (
			<PageLayout>
				<Header>找回密码</Header>
				<section className="loginBox form mt16">
					<from>
						<p><input className="PhoneNumber" type="tel" placeholder="请输入手机号码" maxLength="11" value={this.state.phoneNumber}
								  onChange={(event)=>{
									let newState=Object.assign({},this.state);
									newState.phoneNumber=event.target.value;
									this.setState(newState);
								}} /></p>
						<p className="formYzm"><input ref="txtCode"maxLength="6"placeholder="请输入验证码" />
							<input type="button" className="formYzmBtn" disabled={this.state.smsSent}
							   style={btnfindpwsVerifyCodeStyle}
							   onClick={()=>{
											this.refs.loading.loading();
											registerService.checkPhoneIsRegister(this.state.phoneNumber).then((isRegister)=>{
												if(isRegister){
													return smsService.fetchValidationCode(this.state.phoneNumber,1).then((result)=>{
														this.refs.loading.loaded();
														if(result){
															this.setState(Object.assign({},this.state,{smsSent:true}));
															this.runCountdown();
														}
													}).catch(()=>{
														this.refs.loading.loaded();
													});
												}
												this.refs.loading.loaded();
												showMessage(strings.phoneIsNotRegister);
												return null;
											}).catch(()=>{
												this.refs.loading.loaded();
											});
										}}value={this.state.smsSent ? `${this.state.countdown}秒重新获取` : "获取验证码"}/>
						</p>
						<p><input ref="txtPwd" type="password"maxLength="20" placeholder="请输入新密码(6~20位)" /></p>
						<p className="btn"><input type="button" onClick={this.submitNewPassword.bind(this)} value="提交" /></p>
						</from>
				</section>
				<Loading ref="loading"></Loading>
			</PageLayout>
		);
	}
}