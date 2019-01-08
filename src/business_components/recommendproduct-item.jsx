

export default class RecommendProductListItem extends React.Component {

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
    render() {
        return(
            <li onClick={()=>{
                this.context.router.push(`/product/${this.props.data.ProductSysNo}`)
            }}>
                <a>
                    <div className="img" style={{backgroundImage:`url(${this.props.data.DefaultImage})`}}></div>
                    <div className="text">
                        <p className="name">{this.props.data.ProductName}</p>
                        <p className="sales_word">{this.props.data.ProductNote}</p>
                        <p className="price">
                            <span className="mr5"><em>{this.props.data.CurrentPrice}</em></span>
                        </p>
                    </div>
                    <em className="add_cart"></em>
                </a>
            </li>
        );
    }
}