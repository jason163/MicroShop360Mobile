
import PageLayout from "components/page-layout.jsx";
import {BannerSlider} from "bm/home-banner.jsx";
import {ProBigPic} from "bm/product-common.jsx"
import {getCache,setCache} from "utility/storage.jsx"
require("assets/css/base.css");
require("assets/css/product.css");

export default class PoductPicPage extends React.Component {

    constructor(props){
        super(props);
    }

    static get propTypes(){
        return{
            params:React.PropTypes.object.isRequired
        };
    }

    static get contextTypes(){
        return{
            router:React.PropTypes.object.isRequired
        }
    }

    buildContent(){
        let imageList = getCache("bigPic");
        return (
        <PageLayout>

            <section id="details_header">
                <div className="header clearFix">
                    <a className="return_graybg fl" onClick={() => {
                        this.context.router.goBack();
                    } }></a>
                </div>
            </section>

            <div className="pro_bigPic">
                <div className="slick-slider-box">
                    <BannerSlider banners={imageList}></BannerSlider>
                </div>
            </div>
        </PageLayout>
        )
    }

    render(){
        return this.buildContent()
    }
}