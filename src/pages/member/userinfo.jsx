/**
 * Created by cd033 on 16/6/28.
 */

import PageLayout from "components/page-layout.jsx"
import {
    Header,
    Content
} from "components/header.jsx"
import RealNameAuth from "components/real-name-auth.jsx"

require("assets/css/base.css");
require("assets/css/form.css");


export default class UserInfoUpdate extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        let myOptions = {
            saveCallBack: (data) => {
                history.go(-1);
                return data;
            }
        }

        return (
            <PageLayout>
                <Header>维护实名信息</Header>
                <Content>
                    <RealNameAuth options={myOptions}></RealNameAuth>
                </Content>
            </PageLayout>
        );
    }
}