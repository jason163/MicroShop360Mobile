
import Countdown from "components/countdown.jsx"


export default class CountdownItem extends React.Component {

    constructor(props){
        super(props);
        this.state={
            textContent:'开抢中'
        }
    }
    static get propTypes(){
        return {
          data:React.PropTypes.object
        };
    }

    static get contextTypes(){
        return{
            router:React.PropTypes.object.isRequired
        }
    }

    /*倒计时结束*/
    timeout(){
        this.setState({textContent:'已结束'})
    }

    render() {
        let timeout=this.props.data.TotalSecond;
        let isSoldOut = 0;
        let textContent = this.state.textContent;
        if(this.props.data.TotalSecond <= 0){
            timeout = 0;
            textContent="已结束";
        }
        if(this.props.data.CountDownTotal <= this.props.data.SoldQty){
            isSoldOut = 1;
            textContent="已抢光";
        }

        return(
            <li onClick={()=>{
                this.context.router.push(`/product/${this.props.data.ProductSysNo}`)
            }}>
                <a className="con-l" style={{backgroundImage:`url(${this.props.data.DefaultImage})`}}/>
                <div className="con-r">
                    <a className={`btn1 ${timeout===0||isSoldOut===1?" graybg":""}`}>{textContent}</a>
                    <div className="timer-out"><Countdown timeoutCallback={()=>{this.timeout()}} leftSeconds={timeout}></Countdown></div>
                    <div className="con-tt">{this.props.data.ProductName}</div>
                    <div className="con-price">
                        <em>{this.props.data.CountDownCurrentPrice}</em>
                        <del>{this.props.data.MarketPrice}</del>
                    </div>
                </div>
            </li>
        );
    }
}