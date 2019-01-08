export default class ConfirmBox extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            display:false,
            message:"",
            onConfirm:()=>{},
            onCancel:()=>{}
        };
    }
    
    confirm(nextStates)
    {
        this.setState(Object.assign(nextStates,{display:!this.state.display}));
    }

    static get propTypes() {
        return {
            display:React.PropTypes.bool,
            message:React.PropTypes.string,
            onCancel:React.PropTypes.func,
            onConfirm:React.PropTypes.func
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign(this.state,nextProps));
    }

    render(){
        return <section className="mid_up layer1" style={{display: this.state.display?'block':'none'}}>
            <div className="mid_up_cart">
                <i className="close" onClick={()=>{
                    this.state.onCancel();
                }}></i>
                <p>{this.state.message}</p>
                <div className="bnt_up clearFix">
                    <a className="fl sure" onClick={()=>{
                    this.state.onConfirm();
                }}>确定</a><a className="fr cancel" onClick={()=>{
                    this.state.onCancel();
                }}>取消</a>
                </div>
            </div>
        </section>
    }
}
