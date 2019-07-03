
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import routeStateManager from "utility/route-state-manager.jsx";
import strings from "config/strings.config.json";
import registerService from "service/register.service.jsx";
import smsService from "service/sms.service.jsx";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import appConfig from "config/app.config.json";
import Loading from "components/loading.jsx";
import validation from "config/validation.config.jsx";
import clinetType from "utility/handler.jsx";

require("assets/css/base.css");
require("assets/css/form.css");

//step 1
//input phone number
export class Register extends React.Component {
	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	static get propTypes() {
		return {
			location: React.PropTypes.any
		};
	}

	constructor(props) {
		super(props);
		this.phoneNumber = "";
		let state = routeStateManager.getPreviousState();
		if (state && state.phoneNumber) {
			this.phoneNumber = state.phoneNumber;
		}
	}

	render() {
		return (
			<PageLayout>
				<Header>注册</Header>
					<section className="registerBox form mt16">
						<form>
							<p>
								<input
									ref="txtPhoneNumber"defaultValue={this.phoneNumber}type="tel"maxLength="11"
										placeholder="请输入手机号码" />
							</p>
							<p className="btn"><a className="btnredbg" onClick={()=>{
							let phoneNumber=this.refs.txtPhoneNumber.value;
							registerService.checkPhoneIsRegister(phoneNumber).then((isRegister)=>{
								if(!isRegister){
									this.context.router.push({
										pathname:"/register/identity"
										,state:{
											phoneNumber:phoneNumber
										}
									})
								}
								else{
									showMessage(strings.phoneIsRegister);
								}
							})
						}}>下一步</a>
							</p>
						</form>
					</section>
			</PageLayout>
		);
	}
}

//step 2
//input identity code
export class RegisterIdentityCode extends React.Component {
	constructor(props) {
		super(props);
		this.phoneNumber = this.props.location.state.phoneNumber;
		this.timer = null;
		this.state = {
			isCountdown: false,
			second: appConfig.smsDelay
		};
	}

	countdown() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		let newSecond = this.state.second - 1;
		this.setState(Object.assign({}, this.state, {
			second: newSecond
		}));
		if (newSecond < 0) {
			this.setState(Object.assign({}, this.state, {
				second: appConfig.smsDelay,
				isCountdown: false
			}));
		}
		else {
			this.timer = setTimeout(()=> {
				this.countdown();
			}, 1000);
		}
	}

	static get propTypes() {
		return {
			location: React.PropTypes.any
		};
	}

	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	componentWillUnmount(){
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	render() {
		let btnVerifyCodeStyle = {};
		if (this.state.isCountdown) {
			btnVerifyCodeStyle.backgroundColor = "#aaa";
		}

		return (
			<PageLayout>
				<Header>注册</Header>
				<section className="registerBox form mt16">
					<form>
						<p className="formYzm">
							<input type="text"ref="txtVerifyCode"maxLength="6"placeholder="请输入验证码" />
							<input type="button" className="formYzmBtn" disabled={this.state.isCountdown}
							   style={btnVerifyCodeStyle}
							   onClick={()=>{
										smsService.fetchValidationCode(this.phoneNumber,0).then(()=>{
											this.setState(Object.assign({},this.state,{
												isCountdown:true
											}));
											this.countdown();
										});
							}}value={this.state.isCountdown ? `${this.state.second}秒重新获取` : "获取验证码"}/>
						</p>
						<p className="btn"><a className="btnredbg" onClick={()=>{
						        	let code=this.refs.txtVerifyCode.value;
									if (validation.containHtml.r.test(code)) {
											showMessage(validation.containHtml.m);
											this.refs.txtVerifyCode.value="";
											return;
										}
									this.refs.loading.loading();
						        	smsService.checkValidationCode(this.phoneNumber,code).then((result)=>{
						        		this.refs.loading.loaded();
						        		if(result.Success){
						        			this.context.router.push({
												pathname:"/register/account",
												state:this.props.location.state
											});
						        		}
						        		else{
						        			throwError({
						        				message:result.Message,
						        				delay:3000
						        			});
						        		}
						        	}).catch(()=>{
						        		this.refs.loading.loaded();
						        	});

						        }}>下一步</a></p>
					</form>
				</section>
				<Loading ref="loading"></Loading>
			</PageLayout>
		);
	}
}

//step 3
//input account name & password
export class RegisterAccount extends React.Component {
	componentDidMount() {
		if(Object.is(this.props.location.state.phoneNumber,undefined)||Object.is(this.props.location.state.phoneNumber,null)||Object.is(this.props.location.state.phoneNumber,"")
		||Object.is(this.state.agree,undefined)||Object.is(this.state.agree,null)||Object.is(this.state.agree,"")) {
			this.context.router.push("/register");
		}
	}
	static get propTypes() {
		return {
			location: React.PropTypes.object
		};
	}

	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	constructor(props) {
		super(props);
		let pstate = routeStateManager.getPreviousState();
		this.state = {
			agree: pstate.agree || true,
			nickName: pstate.nickName || "",
			pwd: pstate.pwd || "",
			disabledSubmit: false
		};
	}

	render() {
		let btncheckboxStyle = {};
		if (this.state.agree) {
			btncheckboxStyle.backgroundColor = "#D90B0B";
		}
		return (
			<PageLayout>
				<Header>注册</Header>
				<section className="registerBox form mt16">
					<p><input defaultValue={this.state.nickName} onChange={(event)=>{
									let newState=Object.assign({},this.state);
									newState.nickName=event.target.value;
									this.setState(newState);
								}} type="text" placeholder="昵称"/></p>
					<p><input defaultValue={this.state.pwd} onChange={(event)=>{
									let newState=Object.assign({},this.state);
									newState.pwd=event.target.value;
									this.setState(newState);
								}} type="password"maxLength="20" placeholder="密码"/></p>
					<p className="checkboxOuter">
                        <span className={this.state.agree?"checkbox on":"checkbox"}
                        ><input checked={this.state.agree}
								style={btncheckboxStyle}
								onChange={(event)=>{
								let newState=Object.assign({},this.state);
								newState.agree=event.target.checked;
								this.setState(newState);
							}} type="checkbox"/><i></i></span>我已阅读并同意遵守<a onClick={()=>{
								this.context.router.push({
									pathname:"/register/agreement"
									,state:Object.assign({},this.state)
								});
							}}>《用户注册协议》</a>
					</p>
					<p className="btn"><a className="btnredbg" disabled={this.state.disabledSubmit}
										  onClick={(event)=>{
									this.setState(Object.assign({},this.state,{
										disabledSubmit:true
									}));

									  registerService.register(this.props.location.state.phoneNumber,this.state.pwd,this.state.nickName,this.state.agree).then((result)=>{
										  cache.removeSessionCache(keys.tabPageActive);

										  this.context.router.replace("/");
									  }).catch(()=>{
										  this.setState(Object.assign({},this.state,{
											  disabledSubmit:false
										  }));
									  });

								}}>注册</a></p>
				</section>
			</PageLayout>
		);
	}
}

export class RegisterAgreement extends React.Component {
	render(){
		return (
			<PageLayout>
				<Header>讯驰商城用户注册协议</Header>
				<Content>
					<div className="register_agreement" style={{padding:"1rem"}}>
						<p>本协议是您与讯驰商城之间就讯驰商城服务等相关事宜所订立的契约，请您仔细阅读本注册协议，您点击“同意以下协议，提交”按钮后，本协议即构成对双方有约束力的法律文件。</p>
						<h2>第1条 本站服务条款的确认和接纳 </h2>
						<p>1.1本站的各项电子服务的所有权和运作权归讯驰商城所有。用户同意所有注册协议条款并完成注册程序，才能成为本站的正式用户。用户确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。 </p>
						<p>1.2用户点击同意本协议的，即视为用户确认自己具有享受本站服务的相应的权利能力和行为能力，并能够独立承担法律责任。 </p>
						<p>1.3如果您在18周岁以下，您只能在父母或监护人的监护参与下才能使用本站。 </p>
						<p>1.4讯驰商城保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容的权利。 </p>
						<h2>第2条 本站服务</h2>
						<p>2.1讯驰商城通过互联网依法为用户提供互联网信息服务，用户在完全同意本协议及本站规定的情况下，方有权使用本站的相关服务。 </p>
						<p>2.2用户必须自行准备如下设备和承担如下开支：</p>
						<p>（1）上网设备，包括并不限于电脑或者其他上网终端、调制解调器及其他必备的上网装置；</p>
						<p>（2）上网开支，包括并不限于网络接入费、上网设备租用费、手机流量费等。</p>
						<h2>第3条 用户信息</h2>
						<p>3.1用户应自行诚信向本站提供注册资料，用户同意其提供的注册资料真实、准确、完整、合法有效，用户注册资料如 有变动的，应及时更新其注册资料。如果用户提供的注册资料不合法、不真实、不准确、不详尽的，用户需承担因此引起的相应责任及后果，并且讯驰商城保留终止用户使用讯驰商城各项服务的权利。 </p>
						<p>3.2用户在本站进行浏览、搜索商品等活动时，涉及用户真实姓名/名称、通信地址、联系电话、电子邮箱等隐私信息的，本站将予以严格保密，除非得到用户的授权或法律另有规定，本站不会向外界披露用户隐私信息。 </p>
						<p>3.3用户注册成功后，将产生用户名和密码等账户信息，您可以根据本站规定改变您的密码。用户应谨慎合理的保存、使用其用户名和密码。用户若发现任何非法使用用户账号或存在安全漏洞的情况，请立即通知本站并向公安机关报案。 </p>
						<p>3.4用户同意，讯驰商城拥有通过邮件、短信电话等形式，向在本站注册用户发送促销活动等告知信息的权利。 </p>
						<p>3.5用户不得将在本站注册获得的账户借给他人使用，否则用户应承担由此产生的全部责任，并与实际使用人承担连带责任。 </p>
						<p>3.6用户同意，讯驰商城有权使用用户的注册信息、用户名、密码等信息，登录进入用户的注册账户，进行证据保全，包括但不限于公证、见证等。 </p>
						<h2>第4条 用户依法言行义务</h2>
						<p>本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务： </p>
						<p>（1）不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论； </p>
						<p>（2）从中国大陆向境外传输资料信息时必须符合中国有关法规； </p>
						<p>（3）不得利用本站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动； </p>
						<p>（4）不得干扰本站的正常运转，不得侵入本站及国家计算机信息系统； </p>
						<p>（5）不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料； </p>
						<p>（6）不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论； </p>
						<p>（7）不得教唆他人从事本条所禁止的行为； </p>
						<p>（8）不得利用在本站注册的账户进行牟利性经营活动； </p>
						<p>（9）不得发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容； </p>
						<p>用户应不时关注并遵守本站不时公布或修改的各类合法规则规定。 </p>
						<p>本站保有删除站内各类不符合法律政策或不真实的信息内容而无须通知用户的权利。 </p>
						<p>若用户未遵守以上规定的，本站有权作出独立判断并采取暂停或关闭用户帐号等措施。用户须对自己在网上的言论和行为承担法律责任。 </p>
						<h2>第5条 商品信息</h2>
						<p>本站上的商品信息随时都有可能发生变动，本站不作特别通知。由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由 于众所周知的互联网技术因素等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解；讯驰商城欢迎纠错，并会视情况给予纠错 者一定的奖励。 </p>
						<p>为表述便利，商品和服务简称为"商品"或"货物"。 </p>
						<h2>第6条 所有权及知识产权条款</h2>
						<p>6.1用户一旦接受本协议，即表明该用户主动将其在任何时间段在本站发表的任何形式的信息内容 （包括但不限于客户评价、客户咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、 展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利），全部独家且不可撤销地转让 给讯驰商城所有，用户同意讯驰商城有权就任何主体侵权而单独提起诉讼。 </p>
						<p>6.2本协议已经构成《中华人民共和国著作权法》第二十五条（条文序号依照2011年版著作权法确定）及相关法律规定的著作财产权等权利转让书面协议，其效力及于用户在讯驰商城网站上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。 </p>
						<p>6.3用户同意并已充分了解本协议的条款，承诺不将已发表于本站的信息，以任何形式发布或授权其它主体以任何方式使用（包括但限于在各类网站、媒体上使用）。 </p>
						<p>6.4讯驰商城是本站的制作者,拥有此网站内容及资源的著作权等合法权利,受国家法律保护,有权不时地对本协议及本站的内容进行修改，并在本站张贴，无须另行通知用户。在法律允许的最大限度范围内，讯驰商城对本协议及本站内容拥有解释权。 </p>
						<p>6.5除法律另有强制性规定外，未经讯驰商城明确的特别书面许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本站的信息内容，否则，讯驰商城有权追究其法律责任。 </p>
						<p>6.6本站所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软 件），均是讯驰商城或其内容提供者的财产，受中国和国际版权法的保护。本站上所有内容的汇编是讯驰商城的排他财产，受中国和国际版权法的保护。本站上所有软件 都是讯驰商城或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。 </p>
						<h2>第7条 责任限制及不承诺担保</h2>
						<p>除非另有明确的书面说明,本站及其所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务，均是在"按现状"和"按现有"的基础上提供的。 </p>
						<p>除非另有明确的书面说明,讯驰商城不对本站的运营及其包含在本网站上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。 </p>
						<p>讯驰商城不担保本站所包含的或以其它方式通过本站提供给您的全部信息、内容、材料、产品（包括软件）和服务、其服务器或从本站发出的电子信件、信息没有病毒或其他有害成分。 </p>
						<p>如因不可抗力或其它本站无法控制的原因使本站销售系统崩溃或无法正常使用导致网上交易无法完成或丢失有关的信息、记录等，讯驰商城会合理地尽力协助处理善后事宜。 </p>
						<h2>第8条 协议更新及用户关注义务</h2>
						<p>根据国家法律法规变化及网站运营需要，讯驰商城有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在本站上即生效，并代替原来的协议。用户可随时登陆查阅最新协议；用户有义务不时关注并阅读最新版的协议及网站公告。如用户不同意更新后的协议，可以且应立即停止接受讯驰商城网站依据本协议提供的服务；如用户继续使用本网站提供的服务的，即视为同意更新后的协议。讯驰商城建议您在使用本站之前阅读本协议及本站的公告。 如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。 </p>
						<h2>第9条 法律管辖和适用</h2>
						<p>本协议的订立、执行和解释及争议的解决均应适用在中华人民共和国大陆地区适用之有效法律（但不包括其冲突法规则）。 如发生本协议与适用之法律相抵触时，则这些条款将完全按法律规定重新解释，而其它有效条款继续有效。 如缔约方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向讯驰商城所有者所在地人民法院提起诉讼。 </p>
						<h2>第10条 其他</h2>
						<p>10.1讯驰商城尊重用户和消费者的合法权利，本协议及本网站上发布的各类规则、声明等其他内容，均是为了更好的、更加便利的为用户和消费者提供服务。本站欢迎用户和社会各界提出意见和建议，讯驰商城将虚心接受并适时修改本协议及本站上的各类规则。</p>
						<p>10.2您点击本协议上方的"同意以下协议，提交"按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。</p>
						<h2>对进口商品及产地直销的说明:</h2>
						<p>1） 进口商品：国外商品进口时向海关及检验检疫以一般贸易方式进行申报，海关按个人物品行邮税征税，检验检疫按照有关要求进行检验监管；</p>
						<p>2） 产地直销：按照海关56号公告规定国外的商品进口时，要求在自贸区内备案，参照个人行邮物品向海关及检验检疫进行申请。海关和检验检疫参照个人行邮物品有关规定进行征税和监管。</p>
						<h2>消费者须知：</h2>
						<p>1） 消费者承诺所购商品为个人自用，不作二次销售使用；</p>
						<p>2） 消费者承诺已知晓所购商品的质量、性能、安全与卫生标准；自愿承担商品的质量、性能、安全与卫生标准与中国法定标准不一致所隐含的风险。如需购买符合中国产品标准的商品请至进口产品专区。</p>
						<p>3） 产地直销的商品页面上要标注：符合生产国标准，如需购买符合中国标准商品，请选择进口商品；
							进口商品的页面上要标注：符合中国标准，如需购买符合生产国标准商品，请选择产地直销。</p>
						<p>以上信息也在详情页面上展示，如果是产地直销的商品显示产地直销说明，反之如果是进口商品显示进口商品标注。</p>
					</div>
				</Content>
			</PageLayout>
		);
	}
}