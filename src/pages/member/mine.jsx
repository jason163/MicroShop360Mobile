import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import {ListKeyValueEditCell} from "bm/list-view.jsx";
import appConfig from "config/app.config.json";
import Loading from "components/loading.jsx";
import validation from "config/validation.config.jsx";
import strings from "config/strings.config.json";
import workerService from "service/worker.service.jsx"
import smsService from "service/sms.service.jsx"
import Auth from "service/auth.service.jsx"
import {UploaderBtn} from "components/uploaderbtn.jsx"

require("assets/css/base.css");
require("assets/css/account.css");
require("assets/css/form.css");

export class MineBindEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    sendEmail() {
        workerService.bindEmail(this.state.email).then(() => {
            showMessage("验证邮件已发送,请按邮箱提示进行验证");
        });
    }

    render() {
        return (
            <PageLayout>
                <Header>绑定邮箱</Header>
                <Content>
                    <div className="mine-update-phone">
                        <div className="mine-update-phone-header">
                            <div className="mine-update-phone-header-content">
                                <img style={{ margin: "2rem" }} src=""/>
                                <p>当前设置修改邮箱后, 我们将向这个邮箱</p>
                                <p>发一封验证邮件, 请按邮箱提示进行验证</p>
                            </div>
                        </div>
                        <div className="min-update-phone-form">
                            <div>
                                <i className="iconfont icon-youxiang"></i>
                                <input type="tel" maxLength="50" placeholder="绑定邮箱" onChange={(evt) => {
                                    this.setState({ email: evt.target.value });
                                } }/>
                            </div>
                            <div>
                                <button className="btn-ok" onClick={() => {
                                    this.sendEmail();
                                } }>确定
                                </button>
                            </div>
                        </div>
                    </div>
                </Content>
            </PageLayout>
        );
    }
}

export class MineUpdatePhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPhoneNumber: '',
            verifyCode: '',
            second: appConfig.smsDelay,
            isCountdown: false
        };
        this.inc = null;
        this.checkPhoneNumber = () => {
            if (!validation.notEmpty.r.test(this.state.newPhoneNumber)) {
                throwError(strings.phoneNotEmpty);
            }
            if (!validation.phone.r.test(this.state.newPhoneNumber)) {
                throwError(`${validation.phone.m}`);
            }
        }
    }

    countdown() {
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
            this.inc = setTimeout(() => {
                this.countdown();
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.inc);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    /*发送验证码*/
    getVerifyCode() {
        this.checkPhoneNumber();
        smsService.fetchValidationCode(this.state.newPhoneNumber, 2).then(() => {
            showMessage(`验证码已发送到手机${this.state.newPhoneNumber}`);
            this.setState(Object.assign({}, this.state, { isCountdown: true }));
            this.countdown();
        });
    }

    updatePhone() {
        this.checkPhoneNumber();
        if (!validation.notEmpty.r.test(this.state.verifyCode)) {
            throwError(strings.verifyCodeNotEmpty);
        }
        this.refs.loading.loading();
        workerService.changePhoneNumber(this.state.newPhoneNumber, this.state.verifyCode).then((msg) => {
            this.refs.loading.loaded();
            showMessage(msg);
            Auth.logout();
            this.context.router.push("/login");
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    render() {
        let btnVerifyCodeClass = "formYzmBtn";
        if (this.state.isCountdown) {
            btnVerifyCodeClass = "formYzmBtn graybg";
        }
        return (
            <PageLayout>
                <Header>修改手机号码</Header>
                <Content>
                    <section className="form mt16">
                        <span className="phone_text">您当前的手机号码为{this.props.location.state.Tel}<br/>更换后可用新手机号登录</span>
                            <p><input type="tel" maxLength="11" placeholder="新手机号码" onChange={(evt) => {
                                this.setState(
                                    Object.assign({}, this.state, { newPhoneNumber: evt.target.value })
                                );
                            } }/></p>
                            <p className="formYzm"><input type="text" placeholder="验证码" maxLength="4" onChange={(evt) => {
                                this.setState(
                                    Object.assign({}, this.state, { verifyCode: evt.target.value })
                                );
                            } }/><a className={btnVerifyCodeClass} disabled={this.state.isCountdown}
                                onClick={() => {
                                if (!this.state.isCountdown) {
                                    this.getVerifyCode();
                                    }
                                } }>{this.state.isCountdown ? `${this.state.second}秒重新获取` : "获取验证码"}</a></p>
                            <p className="btn"><input type="submit" value="确定" onClick={() => {
                                this.updatePhone();
                            } }/></p>
                    </section>
                </Content>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

export class MineUpdateName extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.location.state
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    updateNickName() {
        if (!validation.nickName.r.test(this.state.userName)) {
            throwError(validation.nickName.m);
        }
        this.refs.loading.loading();
        workerService.updateUserName(this.state.userName).then((msg) => {
            this.refs.loading.loaded();
            showMessage(msg);
            this.context.router.goBack();
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    render() {
        return (
            <PageLayout>
                <Header>昵称</Header>
                <Content>
                    <div className="mine-update-name">
                        <div className="min-update-name-form">
                            <input type="text" placeholder="昵称" value={this.state.userName} onChange={(evt) => {
                                this.setState({ userName: evt.target.value });
                            } }/>
                            <div className="btn">
                                <button className="btn-ok" onClick={this.updateNickName.bind(this) }>确定
                                </button>
                            </div>
                        </div>
                    </div>
                </Content>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

export class AccountManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "",
            mobile: "",
            gender: "",
            birthday: ""
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    componentDidMount() {
        this.refs.loading.loading();
        workerService.getUserInfo().then((userFullInfo) => {
            this.refs.loading.loaded();
            let newState = Object.assign(this.state);
            let user = userFullInfo.user;
            newState.avatar = user.HeadImage ? user.HeadImage :
                require("assets/img/default_head.png");
            newState.mobile = user.MobliePhone;
            newState.birthday = user.BirthdayStr;

            switch (user.Gender) {
                case 1:
                    newState.gender = "男";
                    break;
                case 0:
                    newState.gender = "女";
                    break;
                case -1:
                    newState.gender = "保密";
                    break;
                default:
                    newState.gender = "";
                    break;
            }
            this.setState(newState);
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    updateUserHeadImg(url) {
        workerService.updateUserAvatar(url).then((msg) => {
            this.setState(Object.assign({}, this.state, { avatar: appConfig.contentSourceUrl + url.replace("Original","p160") }))
        });
    }
    onupload() {
        let newState = Object.assign(this.state);
        newState.avatar = require("assets/img/uploading.gif");
        this.setState(newState);
    }
    render() {
        return (
            <PageLayout>
                <Header>账户管理</Header>
                <Content>
                    <section className="centerper_list mt10">
                        <div className="centerper_item">
                            <div className="box-line-t box-line-b">
                                <div className="c_list clearFix">
                                    <div className="c_list_left"><span className="span_default_head">头像</span></div>
                                    <div className="c_list_right"><span className="colorGrey c_arrow_r"><span
                                        className="c_default_head">
                                        <UploaderBtn uploadtype="avatar" onupload={() => { this.onupload() } }
                                            callback={(img) => this.updateUserHeadImg(img) }></UploaderBtn><i style={{ backgroundImage: `url(${this.state.avatar})` }}></i></span></span></div>
                                </div>
                            </div>
                        </div>
                        <div className="centerper_item">
                            <div className="box-line-b">
                                <a onClick={() => {
                                    this.context.router.push({
                                        pathname: "/mine/updatephone",
                                        state: { Tel: this.state.mobile }
                                    })
                                } } className="c_list clearFix">
                                    <div className="c_list_left"><span>手机号</span></div>
                                    <div className="c_list_right"><span
                                        className="colorGrey c_arrow_r">{this.state.mobile}</span></div>
                                </a>
                            </div>
                            <div className="box-line-b">
                                <a onClick={() => {
                                    this.context.router.push({
                                        pathname: "/mine/updategender",
                                        state: { gender: this.state.gender }
                                    })
                                } } className="c_list clearFix">
                                    <div className="c_list_left"><span>性别</span></div>
                                    <div className="c_list_right"><span
                                        className="colorGrey c_arrow_r">{this.state.gender}</span></div>
                                </a>
                            </div>
                            <div className="box-line-b">
                                <a onClick={() => {
                                    this.context.router.push({
                                        pathname: "/mine/updatebirthday",
                                        state: { birthday: this.state.birthday }
                                    })
                                } } className="c_list clearFix">
                                    <div className="c_list_left"><span>出生年月</span></div>
                                    <div className="c_list_right"><span
                                        className="colorGrey c_arrow_r">{this.state.birthday}</span></div>
                                </a>
                            </div>
                        </div>
                    </section>
                </Content>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

export class ChangePwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            passwordConfirm: '',
            errorMsg: ''
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    update() {
        let hasError = false;
        if (!validation.pwd.r.test(this.state.password)) {
            hasError = true;
            throwError(validation.pwd.m);

        }
        if (this.state.password !== this.state.passwordConfirm) {
            hasError = true;
            throwError(strings.pwdNotAgree);

        }

        if (!hasError) {
            this.refs.loading.loading();
            workerService.changePassword(this.state).then((res) => {
                if (res) {
                    this.refs.loading.loaded();
                    this.context.router.push("/login");
                } else {
                    showMessage(res);
                }

            }).catch(() => {
                this.refs.loading.loaded();
            });
        }
    }

    render() {
        return (
            <PageLayout>
                <Header>修改密码</Header>
                <section className="form mt16">
                    <div>
                        <p><input type="password" id="" name="PhoneNumber" placeholder="输入新密码" maxLength="20" onChange={(evt) => {
                            this.setState(Object.assign({}, this.state, { password: evt.target.value.replace(/\s/g, '') }));
                        } }/></p>
                        <p className={Object.is(this.state.errorMsg, "") ? "" : "validFail"}><input type="password"
                            placeholder="再次输入新密码"
                            maxLength="20"
                            onChange={(evt) => {
                                this.setState(Object.assign({}, this.state, { passwordConfirm: evt.target.value }));
                            } }/></p>

                        <p className="btn"><input type="submit" id="" value="确认修改" onClick={() => { this.update(); } }/></p>
                    </div>
                </section>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

 
export class UpdateGender extends React.Component {

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    updateGender(gender) {
        this.refs.loading.loading();
        workerService.updateUserGender(gender).then((msg) => {
            this.refs.loading.loaded();
            this.context.router.goBack();
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    render() {
        return (
            <PageLayout>
                <Header>选择性别</Header>
                <section className="gender_con mt10">
                    <div className="centerper_item box-line-t">
                        <div className="box-line-b">
                            <a onClick={() => {
                                this.updateGender(1)
                            } } className="c_list clearFix">
                                <span>男</span>
                            </a>
                        </div>
                        <div className="box-line-b">
                            <a onClick={() => {
                                this.updateGender(0)
                            } } className="c_list clearFix">
                                <span>女</span>
                            </a>
                        </div>
                        <div className="box-line-b">
                            <a onClick={() => {
                                this.updateGender(-1)
                            } } className="c_list clearFix">
                                <span>保密</span>
                            </a>
                        </div>
                    </div>

                </section>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}

export class UpdateBirthday extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Year: '',
            Month: '',
            Day: ''
        };
    }

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    componentWillMount() {
        let newState = Object.assign({}, this.state);
        if (this.props.location.state.birthday) {
            let birthArr = this.props.location.state.birthday.split("-");
            newState.Year = birthArr[0];
            newState.Month = birthArr[1];
            newState.Day = birthArr[2];
        }
        this.setState(newState);
    }

    updateBirthday() {
        this.refs.loading.loading();
        workerService.updateUserBirthday(`${this.state.Year}-${this.state.Month}-${this.state.Day}`).then((msg) => {
            this.refs.loading.loaded();
            this.context.router.goBack();
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    render() {
        return (
            <PageLayout>
                <Header>出生日期</Header>
                <section className="form mt16">

                    <p>
                        <span className="selectBox row">
                            <span className="col col-e1">
                                <select value={this.state.Year} onChange={(evt) => {
                                    this.setState(Object.assign({}, this.state, { Year: evt.target.value }));
                                } } name="">
                                    <option value="">选择年</option>
                                    <option value="2016">2016年</option>
                                    <option value="2015">2015年</option>
                                    <option value="2014">2014年</option>
                                    <option value="2013">2013年</option>
                                    <option value="2012">2012年</option>
                                    <option value="2011">2011年</option>
                                    <option value="2010">2010年</option>
                                    <option value="2009">2009年</option>
                                    <option value="2008">2008年</option>
                                    <option value="2007">2007年</option>
                                    <option value="2006">2006年</option>
                                    <option value="2005">2005年</option>
                                    <option value="2004">2004年</option>
                                    <option value="2003">2003年</option>
                                    <option value="2002">2002年</option>
                                    <option value="2001">2001年</option>
                                    <option value="2000">2000年</option>
                                    <option value="1999">1999年</option>
                                    <option value="1998">1998年</option>
                                    <option value="1997">1997年</option>
                                    <option value="1996">1996年</option>
                                    <option value="1995">1995年</option>
                                    <option value="1994">1994年</option>
                                    <option value="1993">1993年</option>
                                    <option value="1992">1992年</option>
                                    <option value="1991">1991年</option>
                                    <option value="1990">1990年</option>
                                    <option value="1989">1989年</option>
                                    <option value="1988">1988年</option>
                                    <option value="1987">1987年</option>
                                    <option value="1986">1986年</option>
                                    <option value="1985">1985年</option>
                                    <option value="1984">1984年</option>
                                    <option value="1983">1983年</option>
                                    <option value="1982">1982年</option>
                                    <option value="1981">1981年</option>
                                    <option value="1980">1980年</option>
                                    <option value="1979">1979年</option>
                                    <option value="1978">1978年</option>
                                    <option value="1977">1977年</option>
                                    <option value="1976">1976年</option>
                                    <option value="1975">1975年</option>
                                    <option value="1974">1974年</option>
                                    <option value="1973">1973年</option>
                                    <option value="1972">1972年</option>
                                    <option value="1971">1971年</option>
                                    <option value="1970">1970年</option>
                                    <option value="1969">1969年</option>
                                    <option value="1968">1968年</option>
                                    <option value="1967">1967年</option>
                                    <option value="1966">1966年</option>
                                    <option value="1965">1965年</option>
                                    <option value="1964">1964年</option>
                                    <option value="1963">1963年</option>
                                    <option value="1962">1962年</option>
                                    <option value="1961">1961年</option>
                                    <option value="1960">1960年</option>
                                    <option value="1959">1959年</option>
                                    <option value="1958">1958年</option>
                                    <option value="1957">1957年</option>
                                    <option value="1956">1956年</option>
                                    <option value="1955">1955年</option>
                                    <option value="1954">1954年</option>
                                    <option value="1953">1953年</option>
                                    <option value="1952">1952年</option>
                                    <option value="1951">1951年</option>
                                    <option value="1950">1950年</option>
                                </select>
                            </span>
                        </span>
                    </p>
                    <p>
                        <span className="selectBox row">
                            <span className="col col-e1">
                                <select value={this.state.Month} onChange={(evt) => {
                                    this.setState(Object.assign({}, this.state, { Month: evt.target.value }));
                                } }>
                                    <option value="">选择月</option>
                                    <option value="01">1月</option>
                                    <option value="02">2月</option>
                                    <option value="03">3月</option>
                                    <option value="04">4月</option>
                                    <option value="05">5月</option>
                                    <option value="06">6月</option>
                                    <option value="07">7月</option>
                                    <option value="08">8月</option>
                                    <option value="09">9月</option>
                                    <option value="10">10月</option>
                                    <option value="11">11月</option>
                                    <option value="12">12月</option>
                                </select>
                            </span>
                        </span>
                    </p>
                    <p><span className="selectBox row">
                        <span className="col col-e1">
                            <select value={this.state.Day} onChange={(evt) => {
                                this.setState(Object.assign({}, this.state, { Day: evt.target.value }));
                            } }>
                                <option value="">选择日</option>
                                <option value="01">1日</option>
                                <option value="02">2日</option>
                                <option value="03">3日</option>
                                <option value="04">4日</option>
                                <option value="05">5日</option>
                                <option value="06">6日</option>
                                <option value="07">7日</option>
                                <option value="08">8日</option>
                                <option value="09">9日</option>
                                <option value="10">10日</option>
                                <option value="11">11日</option>
                                <option value="12">12日</option>
                                <option value="13">13日</option>
                                <option value="14">14日</option>
                                <option value="15">15日</option>
                                <option value="16">16日</option>
                                <option value="17">17日</option>
                                <option value="18">18日</option>
                                <option value="19">19日</option>
                                <option value="20">20日</option>
                                <option value="21">21日</option>
                                <option value="22">22日</option>
                                <option value="23">23日</option>
                                <option value="24">24日</option>
                                <option value="25">25日</option>
                                <option value="26">26日</option>
                                <option value="27">27日</option>
                                <option value="28">28日</option>
                                <option value="29">29日</option>
                                <option value="30">30日</option>
                                <option value="31">31日</option>
                            </select>
                        </span>
                    </span>
                    </p>

                    <p className="btn" onClick={() => {
                        this.updateBirthday();
                    } }><input type="submit" value="确 定"/></p>
                </section>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }
}