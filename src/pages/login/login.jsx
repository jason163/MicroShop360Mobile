import PageLayout from "components/page-layout.jsx";
import {Header} from "components/login-header.jsx";
import {Link} from "react-router";
import AuthService from "service/auth.service.jsx";
import Loading from "components/loading.jsx";
import * as Cache from "utility/storage.jsx";
require("assets/css/base.css");
require("assets/css/form.css");

export default class Login extends React.Component {

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
        this.state = {
            formData: {
                tel: "",
                pwd: ""
            },
            submited: false
        };
    }

    render() {
        return (
            <PageLayout>
                <Header>登录讯驰商城</Header>
                <section className="loginBox form mt16">
                    <p className={classNames({"validFail":this.state.submited&&this.state.formData.tel===""})}><input
                        type="tel"
                        maxLength="11"
                        value={this.state.formData.tel}
                        placeholder="手机号码"
                        onChange={(event)=>{
											let value=event.target.value;
											let newState=Object.assign({},this.state);
											newState.formData.tel=value;
											this.setState(newState);
										}}/></p>
                    <p className={classNames({"validFail":this.state.submited&&this.state.formData.pwd===""})}><input
                        type="password"
                        placeholder="密码"
                        maxLength="20"
                        value={this.state.formData.pwd} onChange={(event)=>{
									let value=event.target.value;
										let newState=Object.assign({},this.state);
										newState.formData.pwd=value;
										this.setState(newState);
								}}/></p>

                    <p className="btn">
                        <input type="submit" onClick={()=>{
							this.refs.loading.loading();
								let newState=Object.assign({},this.state);
								newState.submited=true;
								this.setState(newState);
							AuthService.login(this.state.formData).then((res)=>{
								this.refs.loading.loaded();
								// this.context.router.goBack();
								if(this.props.location.state){
									let target=this.props.location.state.target;
									this.context.router.replace(target);
								}
								else{
									// this.context.router.goBack();
									// cache.removeSessionCache(keys.tabPageActive);
									this.context.router.replace("/");
								}
							}).catch(()=>{
								this.refs.loading.loaded();
							});
						}} value="登 录"/>
                    </p>

                    <div className="row">
                        <div className="col col-e2"><Link to="/register">手机快速注册</Link></div>
                        <div className="col col-e2"><Link to="/findpassword">找回密码</Link></div>
                    </div>
                </section>

                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

