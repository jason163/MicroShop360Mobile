/**
 * Created by cd033 on 16/6/28.
 */

import service from "service/userinfo.service.jsx"
import validation from "config/validation.config.jsx";
import helper from "utility/helper.jsx";
require("assets/css/base.css");
require("assets/css/form.css");

export class SelectWithTitle extends React.Component{

    constructor(props){
        super(props);
        this.state={
            sltValue:this.props.curValue
        }
    }

    static get propTypes(){
        return{
            start:React.PropTypes.number,
            end:React.PropTypes.number,
            txt:React.PropTypes.string,
            curValue:React.PropTypes.string,
            readonly:React.PropTypes.bool
        }
    }

    static get defaultProps(){
        return{
            readonly:false
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({sltValue:nextProps.curValue});
    }

    buildOpt(start,end,txt){
        let tempList=[];
        for(let i=end;i>=start;i--){
            tempList.push(i);
        }
        return tempList.map((item,index)=>{
            return <option key={index} value={item}>{`${item}${txt}`}</option>
        })
    }

    render(){
        if(this.props.end > this.props.start){
            return(
                <select disabled={this.props.readonly?'disabled':''} value={this.state.sltValue} onChange={(evt)=>{
                                        this.setState(Object.assign({},this.state,{sltValue:evt.target.value}));
                                    }} name="">
                    <option selected="selected">{`选择${this.props.txt}`}</option>
                    {
                        this.buildOpt(this.props.start,this.props.end,this.props.txt)
                    }
                </select>
            )
        }

        return null;
    }
}

export default class RealNameAuth extends React.Component {

    static get propTypes() {
        return {
            options: React.PropTypes.object
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            PhoneNumber: '',
            Name: '',
            IDCardNumber: '',
            Address: '',
            Email: '',
            Gender: -1,
            Birthday: '',
            BirthdayStr: '',
            Year:'',
            Month:'',
            Day:''
        };
    }

    componentDidMount() {
        service.getUserInfo().then((data) => {
            let newState = Object.assign({}, this.state);
            newState.PhoneNumber = data.PhoneNumber;
            newState.Name = data.Name;
            newState.IDCardNumber = data.IDCardNumber;
            newState.Address = data.Address;
            newState.Email = data.Email;
            newState.Gender = data.Gender;
            newState.Birthday = data.Birthday;
            newState.BirthdayStr = data.BirthdayStr;
            if (newState.BirthdayStr) {
                let birthArr = newState.BirthdayStr.split("-");
                newState.Year = birthArr[0];
                newState.Month = birthArr[1];
                newState.Day = birthArr[2];
            }
            this.setState(newState);

        }).catch(() => {

        });
    }

    render() {
        let curYear = (new Date()).getFullYear();
        return (
            
                    <section className="form mt16">
                        
                    <p><input type="text" maxLength={8} placeholder="姓名" value={this.state.Name} onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{Name:evt.target.value}));
                                }}/></p>                   
                    <p><input type="text" maxLength={18} placeholder="身份证号" value={this.state.IDCardNumber}
                              onChange={(evt)=>{
                                    if(evt.target.value.length === 18){
                                          let curDate = new Date();
                                          let sex = parseInt(evt.target.value.substr(16,1),10)%2;
                                          let year = parseInt(evt.target.value.substr(6,4),10);
                                          if(year > curDate.getFullYear()){
                                            year = curDate.getFullYear();
                                          }
                                          let month = parseInt(evt.target.value.substr(10,2),10);
                                          if(month > 12){
                                            month = 12;
                                          }
                                          let day = parseInt(evt.target.value.substr(12,2),10);
                                          if(day > 31){
                                            day = 31;
                                          }
                                          this.setState(Object.assign({},this.state,{Gender:sex,Year:year,Month:month,Day:day,IDCardNumber:evt.target.value}));
                                          return;
                                      }
                                    this.setState(Object.assign({},this.state,{IDCardNumber:evt.target.value}));
                               }}/></p>
                    <p>
                        <label>性别：</label>
                        <span className="radioBox">
                            <input type="radio" name="formSex" checked='checked' className={this.state.Gender===1?"on":''} value='1' onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{Gender:~~evt.target.value}));
                                }} /><label htmlFor="formSex">男</label>
                            <input type="radio" name="formSex" value='0' className={this.state.Gender===0?'on':''} onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{Gender:~~evt.target.value}));
                                }}/><label htmlFor="formSex">女</label>
                        </span>
                    </p>
                    <p className="">
                        <label>出生日期：</label>
                        <span className="selectBox row">
                            <span className="col col-e3">
                                <SelectWithTitle readonly={true} start={1950} end={curYear} curValue={parseInt(this.state.Year,10)} txt="年"></SelectWithTitle>
                            </span>
                            <span className="col col-e3">
                                <SelectWithTitle readonly={true} start={1} end={12} curValue={parseInt(this.state.Month,10)} txt="月"></SelectWithTitle>
                            </span>
                            <span className="col col-e3">
                                <SelectWithTitle readonly={true} start={1} end={31} curValue={parseInt(this.state.Day,10)} txt="日"></SelectWithTitle>
                            </span>
                        </span>
                    </p>
                    <p className=""><input type="tel" name="PhoneNumber" placeholder="联系电话" maxLength="11" value={this.state.PhoneNumber} onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{PhoneNumber:evt.target.value}));
                                }}/></p>
                    {/*<em className="error">* 输入的电话格式不正确</em>*/}
                    <p style={{display:'none'}} className=""><input type="email" placeholder="邮箱" value={this.state.Email} onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{Email:evt.target.value}));
                                }}/></p>
                    {/*<em className="error">* 输入的邮箱格式不正确</em>*/}
                    <p className=""><input type="text" maxLength={64} placeholder="地址" value={this.state.Address} onChange={(evt)=>{
                                    this.setState(Object.assign({},this.state,{Address:evt.target.value}));
                                }}/></p>
                    <em>* 因涉及国家监管部门规定，需要对购买人信息实名备案<br />洋火网站将保护消费者隐私信息，请放心填写。 </em>
                    <p className="btn"><input type="submit" id="cer_submit" onClick={()=>{
                            if (!validation.realName.r.test(this.state.Name)) {
                                showMessage(validation.realName.m);
                                return;
                            }
                             if (!validation.idCard.r.test(this.state.IDCardNumber)) {
                                throwError(validation.idCard.m);
                            }
                            if (this.state.Gender === -1) {
                                showMessage("性别不能保密!");
                                return;
                            }
                            if (!validation.phone.r.test(this.state.PhoneNumber)) {
                                showMessage(validation.phone.m);
                                return;
                            }
                           let strArray = [];
                           let birthStr = '';
                           strArray.push(this.state.Year);
                           strArray.push(this.state.Month);
                           strArray.push(this.state.Day);
                           birthStr = strArray.join('-');

                            service.updateUserInfo(this.state.PhoneNumber,
                                this.state.Name,
                                this.state.IDCardNumber,
                                this.state.Address,
                                birthStr,
                                this.state.Email,
                                this.state.Gender).then((data) => {
                                if (data.Success) {
                                    if (this.props.options.saveCallBack !== undefined
                                || this.props.options.saveCallBack !== null) {
                                this.props.options.saveCallBack({PhoneNumber:this.state.PhoneNumber,
                                    Name:this.state.Name,
                                    IDCardNumber:this.state.IDCardNumber,
                                    Address:this.state.Address,
                                    BirthdayStr:birthStr,
                                    Email:this.state.Email,
                                    Gender:this.state.Gender
                                });
                            }
                                } else {
                                    throwError(data.Message);
                                }
                            }).catch(() => {

                            })
                        }} value="点击认证"/></p>
                    </section>
        );
    }
}