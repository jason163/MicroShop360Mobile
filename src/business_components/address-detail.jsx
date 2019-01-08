import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import AddressService from "service/shippingaddress.service.jsx";
require("assets/css/base.css");
require("assets/css/form.css");


class AddressCombox extends React.Component {

    static get propTypes() {
        return {
            id: React.PropTypes.string,
            onChange: React.PropTypes.func,
            data: React.PropTypes.array,
            selectedCode: React.PropTypes.any,
            codeField: React.PropTypes.string,
            valueField: React.PropTypes.string,
            defaultSelect: React.PropTypes.any
        };
    }

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <select
                id={this.props.id}
                style={{background:'#fff'}}
                value={this.props.selectedCode}
                onChange={() => {
                    this.props.onChange();
                } }>
                <option value={this.props.defaultSelect.code}>{this.props.defaultSelect.value}</option>
                {
                    this.props.data.map((item) => {
                        return (
                            <option value={item[this.props.codeField]}>{item[this.props.valueField]}</option>
                        )
                    })
                }
            </select>
        )
    }
}

/**
 * Type 是 N 表示新增，Type 是 M 表示修改
 */
export default class AddressDetailComponent extends React.Component {

    static get propTypes() {
        return {
            options: React.PropTypes.object
        };
    }

    constructor(props) {


        super(props);

        this.state = {
            addressDetail: {
                SysNo: 0,
                CustomerSysNo: 0,
                IsDefault: 0,
                ReceiveName: '',
                ReceiveCellPhone: '',
                ReceiveAreaSysNo: 0,
                AreaInfo: {
                    SysNo: 0,
                    ProvinceSysNo: 0,
                    CitySysNo: 0
                },
                ReceiveAddress: '',
                ReceiveZip: ''
            },
            provinceList: [],
            cityList: [],
            areaList: [],
            validMessage: {
                ReceiveName: {
                    isValid: true,
                    validMessage: ''
                },
                ReceiveCellPhone: {
                    isValid: true,
                    validMessage: ""
                },
                ReceiveZip: {
                    isValid: true,
                    validMessage: ""
                },
                AreaInfo: {
                    provinceValid: true,
                    cityValid: true,
                    areaValid: true,
                    isValid: true,
                    validMessage: ''
                },
                ReceiveAddress: {
                    isValid: true,
                    validMessage: ''
                }
            }
        }

        if (!this.isNew()) {
            this.loadSourceCount = 3;
        } else {
            this.loadSourceCount = 1;
        }

        this.initData();
    }

    isNew() {

        switch (this.props.options.type) {
            case 'N': return true;
            case 'M': return false;
            default: return false;
        }
    }

    initData() {


        let newState = Object.assign({}, this.state)

        if (!this.isNew()) {

            let sysNo = this.props.options.sysNo;
            AddressService.getAddressDetail(sysNo, (detail) => {
                newState.addressDetail = detail;
                let areaInfo = detail.AreaInfo;
                AddressService.getCityList(areaInfo.ProvinceSysNo, (list) => {
                    newState.cityList = list;
                    this.loadSourceCount--;
                    this.loadComplete(newState);
                })

                AddressService.getAreaList(areaInfo.ProvinceSysNo, areaInfo.CitySysNo, (list) => {
                    newState.areaList = list;
                    this.loadSourceCount--;
                    this.loadComplete(newState);
                })
            });
        }

        AddressService.getProvinceList((list) => {
            newState.provinceList = list;
            this.loadSourceCount--;
            this.loadComplete(newState);
        })
    }

    buildIsDefaultCompent() {

        let defaultCss = this.state.addressDetail.IsDefault ? 'checkbox on' : 'checkbox';

        return (
            <p className="checkboxOuter">
                <span className={defaultCss}>
                    <input type="checkbox" onClick={(event) => {
                        let newState = Object.assign({}, this.state);
                        newState.addressDetail.IsDefault = newState.addressDetail.IsDefault === 1 ? 0 : 1;
                        this.setState(newState);
                    } } />
                    <i></i>
                </span>
                <label>设为默认地址</label>
            </p>
        );
    }

    loadComplete(newState) {
        if (this.loadSourceCount === 0) {
            this.setState(newState);
        }
    }

    updateValue(event, propertyName) {
        let value = event.target.value.trim();
        let newState = Object.assign({}, this.state);
        newState.addressDetail[propertyName] = value;
        this.setState(newState);
    }

    removeHighLight(propertyName) {
        let newState = Object.assign({}, this.state);
        newState.validMessage[propertyName].isValid = true;
        newState.validMessage[propertyName].validMessage = '';
        this.setState(newState);
    }

    checkIsNullOrWhitespace(value) {
        return value === undefined || value === null || value.trim() === '';
    }

    checkAddress() {

        let newState = Object.assign({}, this.state);
        let isValid = true;
        if (this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveName)) {
            newState.validMessage.ReceiveName.isValid = false;
            newState.validMessage.ReceiveName.validMessage = '*收货人不能为空';
            isValid = false;
        }

        if (this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveCellPhone)) {
            newState.validMessage.ReceiveCellPhone.isValid = false;
            newState.validMessage.ReceiveCellPhone.validMessage = "*电话号码不能为空";
            isValid = false;
        }

        if (!this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveCellPhone)) {
            let re = /^1[3|5|7|8]\d{9}$/;
            if (!re.test(newState.addressDetail.ReceiveCellPhone.trim())) {
                newState.validMessage.ReceiveCellPhone.isValid = false;
                newState.validMessage.ReceiveCellPhone.validMessage = '*电话号码格式不对';
                isValid = false;
            }
        }

        if (this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveAddress)) {
            newState.validMessage.ReceiveAddress.isValid = false;
            newState.validMessage.ReceiveAddress.validMessage = '*详细地址不能为空';
            isValid = false;
        }

        if (newState.addressDetail.AreaInfo.SysNo === '0'
            || newState.addressDetail.AreaInfo.SysNo === 0
            || newState.addressDetail.AreaInfo.ProvinceSysNo === '0'
            || newState.addressDetail.AreaInfo.ProvinceSysNo === 0
            || newState.addressDetail.AreaInfo.CitySysNo === '0'
            || newState.addressDetail.AreaInfo.CitySysNo === 0) {
            newState.validMessage.AreaInfo.isValid = false;
            newState.validMessage.AreaInfo.validMessage = '*请选择完地址列表'
            isValid = false;
        }

        if (this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveZip)) {
            newState.validMessage.ReceiveZip.isValid = false;
            newState.validMessage.ReceiveZip.validMessage = '*邮政编码不能为空';
            isValid = false;
        }

        if (!this.checkIsNullOrWhitespace(newState.addressDetail.ReceiveZip)) {
            let re = /^[1-9][0-9]{5}$/;
            if (!re.test(newState.addressDetail.ReceiveZip.trim())) {
                newState.validMessage.ReceiveZip.isValid = false;
                newState.validMessage.ReceiveZip.validMessage = '*邮政编码格式不对';
                isValid = false;
            }
        }

        if (!isValid) {
            this.setState(this.state);
        }

        return isValid;
    }

    getComboxNameById(list, sysNo) {

        if (Array.isArray(list)) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].SysNo === sysNo) {
                    return list[index].Name;
                }
            }
        }
        return '';
    }

    getDistrictName() {

        let districtName = '';

        let areaInfo = this.state.addressDetail.AreaInfo;

        if (areaInfo.CityName.startsWith(areaInfo.ProvinceName)) {
            districtName = areaInfo.CityName + areaInfo.DistrictName;
        } else {
            districtName = areaInfo.ProvinceName + areaInfo.CityName + areaInfo.DistrictName;

        }

        return districtName;
    }

    render() {

        return (
            <section className="c_address_edit form mt16">
                <p className={ this.state.validMessage.ReceiveName.isValid ? "" : "validFail" }>
                    <input type="text" maxLength="10"
                        placeholder="收货人"
                        value={this.state.addressDetail.ReceiveName}
                        onChange={(event) => {
                            this.updateValue(event, 'ReceiveName');
                            this.removeHighLight('ReceiveName');
                        } }
                        />
                </p>
                <em className="error">{this.state.validMessage.ReceiveName.validMessage}</em>
                <p className={ this.state.validMessage.ReceiveCellPhone.isValid ? "" : "validFail" }>
                    <input type="text" placeholder="联系电话" maxLength="11"
                        value={this.state.addressDetail.ReceiveCellPhone}
                        onChange={(event) => {
                            this.updateValue(event, 'ReceiveCellPhone');
                            this.removeHighLight('ReceiveCellPhone');
                        } } />
                </p>
                <em className="error">{this.state.validMessage.ReceiveCellPhone.validMessage}</em>
                <p className={ this.state.validMessage.AreaInfo.isValid ? "" : "validFail" }>
                    <span className='selectBox row'>
                        <span className='col col-e3'>
                            <AddressCombox id='provinceCom'
                                data={this.state.provinceList}
                                codeField='SysNo'
                                valueField='Name'
                                defaultSelect = { { code: 0, value: '选择省' } }
                                key = '1'
                                selectedCode={this.state.addressDetail.AreaInfo.ProvinceSysNo}
                                onChange={() => {

                                    let thisCom = document.getElementById('provinceCom');

                                    let provinceSysNo = thisCom.value;
                                    if (provinceSysNo === 0) {
                                        let newState = Object.assign({}, this.state);
                                        newState.addressDetail.AreaInfo.ProvinceSysNo = provinceSysNo;
                                        newState.cityList = [];
                                        newState.addressDetail.AreaInfo.CitySysNo = 0;
                                        newState.areaList = [];
                                        newState.addressDetail.AreaInfo.SysNo = 0;
                                        newState.addressDetail.AreaInfo.ProvinceName = '';
                                        this.setState(newState);
                                    } else {
                                        AddressService.getCityList(provinceSysNo, (data) => {
                                            let newState = Object.assign({}, this.state);
                                            newState.addressDetail.AreaInfo.ProvinceSysNo = provinceSysNo;
                                            newState.cityList = data;
                                            newState.addressDetail.AreaInfo.CitySysNo = 0;
                                            newState.areaList = [];
                                            newState.addressDetail.AreaInfo.SysNo = 0;
                                            newState.addressDetail.AreaInfo.ProvinceName = this.getComboxNameById(newState.provinceList, Number(provinceSysNo));
                                            this.setState(newState);
                                        })
                                    }




                                    this.removeHighLight('AreaInfo');
                                } }/>
                        </span>
                        <span className="col col-e3">
                            <AddressCombox id='cityCom' data={this.state.cityList}
                                key = '2'
                                codeField='SysNo'
                                valueField='Name'
                                defaultSelect = { { code: 0, value: '选择市' } }
                                selectedCode={this.state.addressDetail.AreaInfo.CitySysNo}
                                onChange={() => {
                                    let thisCom = document.getElementById('cityCom');
                                    let citySysNo = thisCom.value;
                                    if (citySysNo === 0) {
                                        let newState = Object.assign({}, this.state);
                                        newState.addressDetail.AreaInfo.CitySysNo = citySysNo;
                                        newState.addressDetail.AreaInfo.SysNo = 0;
                                        newState.areaList = [];
                                        newState.addressDetail.AreaInfo.CityName = '';
                                        this.setState(newState);
                                    } else {
                                        AddressService.getAreaList(
                                            this.state.addressDetail.AreaInfo.ProvinceSysNo,
                                            citySysNo
                                            , (data) => {
                                                let newState = Object.assign({}, this.state);
                                                newState.addressDetail.AreaInfo.CitySysNo = citySysNo;
                                                newState.addressDetail.AreaInfo.SysNo = 0;
                                                newState.areaList = data;
                                                newState.addressDetail.AreaInfo.CityName = this.getComboxNameById(newState.cityList, Number(citySysNo));
                                                this.setState(newState);
                                            })
                                    }

                                    this.removeHighLight('AreaInfo');
                                } }/>
                        </span>
                        <span className="col col-e3">
                            <AddressCombox id='areaCom' data={this.state.areaList}
                                codeField='SysNo'
                                valueField='Name'
                                defaultSelect = { { code: 0, value: '选择区' } }
                                key = '3'
                                selectedCode={this.state.addressDetail.AreaInfo.SysNo}
                                onChange={() => {
                                    let thisCom = document.getElementById('areaCom');
                                    let newState = Object.assign({}, this.state);
                                    newState.addressDetail.AreaInfo.SysNo = thisCom.value;
                                    newState.addressDetail.ReceiveAreaSysNo = thisCom.value;
                                    newState.addressDetail.AreaInfo.DistrictName = this.getComboxNameById(newState.areaList, Number(thisCom.value));
                                    this.setState(newState);
                                    this.removeHighLight('AreaInfo');
                                } }/>
                        </span>
                    </span>
                </p>
                <em className="error">{this.state.validMessage.AreaInfo.validMessage}</em>
                <p className={this.state.validMessage.ReceiveAddress.isValid ? "" : "validFail"}>
                    <input type="text" placeholder="详细地址" maxLength="50"
                        value={this.state.addressDetail.ReceiveAddress}
                        onChange={(event) => {
                            this.updateValue(event, 'ReceiveAddress');
                            this.removeHighLight('ReceiveAddress');
                        } } />
                </p>
                <em className="error">{this.state.validMessage.ReceiveAddress.validMessage}</em>
                <p className={this.state.validMessage.ReceiveZip.isValid ? "" : "validFail"}>
                    <input type="text" placeholder="邮政编码" maxLength="6"
                        value={this.state.addressDetail.ReceiveZip}
                        onChange={(event) => {
                            this.updateValue(event, 'ReceiveZip');
                            this.removeHighLight('ReceiveZip');
                        } } />
                </p>
                <em className="error">{this.state.validMessage.ReceiveZip.validMessage}</em>
                { this.buildIsDefaultCompent() }
                <p className="btn"><input type="submit" id="" value="保存" onClick={() => {
                    if (this.checkAddress()) {
                        let type = this.isNew() ? 'N' : 'M';
                        AddressService.saveAddress(this.state.addressDetail, type, (response) => {

                            if (this.props.options.saveCallBack !== undefined
                                || this.props.options.saveCallBack !== null) {

                                if (response.Data !== undefined || response.Data !== null) {
                                    response.Data.DistrictName = this.getDistrictName();
                                }

                                this.props.options.saveCallBack(response);
                            }
                        })
                    }
                } }/></p>
            </section>
        )
    }
}