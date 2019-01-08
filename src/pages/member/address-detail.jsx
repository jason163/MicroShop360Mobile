import AddressService from "service/shippingaddress.service.jsx";
import AddressDetailTemplate from "bm/address-detail.jsx"
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
require("assets/css/base.css");
require("assets/css/form.css");


export default class AddressDetail extends React.Component {

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
        this.options = {
            type: this.props.location.state.type,
            sysNo: this.props.location.state.addressSysNo,
            saveCallBack: (response) => {
                if (response.Success) {
                    history.go(-1);
                }
            }
        }
    }

    render() {
        return (
            <PageLayout>
                <Header>维护收货地址</Header>
                <AddressDetailTemplate options={this.options} />
            </PageLayout>
        )
    }

}

