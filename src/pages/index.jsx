import {TabPageLayout, TabPageContent} from "components/tab-page-layout.jsx";
import {Content} from "components/header.jsx";
import PageLayout from "components/page-layout.jsx";
import Home from "bm/home.jsx";
import Categorizer from "pages/product/category.jsx";
import ShoppingCart from "pages/shopping/shopping-cart.jsx";
import OrderService from "service/order.service.jsx";
import {MineIndex} from "pages/member/mine-index.jsx";
import authService from "service/auth.service.jsx";
export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartProductCount: OrderService.getShoppingCartProductCount()
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    componentDidMount() {
        //this.setState({ShoppingCartProductCount: OrderService.getShoppingCartProductCount()});
    }

    render() {
        return (
            <PageLayout isHome={1} isIndex={1}>
                <Content>
                    <TabPageLayout isHome={true} tabs={[{
                        iconClassName:'a1'
                        ,text:''
                    },{
                        iconClassName:'a2'
                        ,text:''
                    },{
                        iconClassName:'a3',
                        text:this.state.ShoppingCartProductCount
                    },{
                        iconClassName:'a4',
                        text:''
                    }]} ref="tab_page_layout">
                        <TabPageContent zIndex={10} eleId="tab_home">
                            <Home></Home>
                        </TabPageContent>
                        <TabPageContent eleId="tab_cat">
                            <Categorizer goBackCallback={()=>{
                                this.refs.tab_page_layout.ActiveFirstTab();
                            }}></Categorizer>
                        </TabPageContent>
                        <TabPageContent eleId="tab_shopping">
                            <ShoppingCart IsSamePageWithIndex={true} goBackCallback={()=>{
                                this.refs.tab_page_layout.ActiveFirstTab();
                            }} refreshShoppingCartCount={()=>{this.setState({ShoppingCartProductCount: OrderService.getShoppingCartProductCount()});}}>

                            </ShoppingCart>
                        </TabPageContent>
                        <TabPageContent eleId="tab_mine">
                            <MineIndex IsSamePageWithIndex={true} loginCallback={()=>{
                            if(authService.isLogin()){
                            let loginbtn=document.getElementsByClassName("login");
                                if(!Object.is(loginbtn,undefined)&&loginbtn.length>0)
                                {
                                    loginbtn[0].style.display="none";
                                }
                            }}}></MineIndex>
                        </TabPageContent>
                    </TabPageLayout>
                </Content>
            </PageLayout>
        );
    }

}