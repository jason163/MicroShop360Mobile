

export default class TipsBox extends React.Component {

    constructor(props){
        super(props);
        this.timer=null;
        this.delay = this.props.delay;
        this.state={
            show:this.props.show,
            content:this.props.content,
            random:0
        }
    }

    static get propTypes(){
        return{
            content:React.PropTypes.string,
            delay:React.PropTypes.number,
            show:React.PropTypes.bool
        }
    }

    static get defaultProps(){
        return{
            delay:1000
        }
    }

    componentWillUnmount(){
        this.clearTimer();
    }

    componentWillUpdate(){
        this.clearTimer();
        this.timer=setTimeout(()=>{
            this.hideTips();
        },this.delay);
    }

    componentWillReceiveProps(nextProps){
        this.setState({show:nextProps.show,content:nextProps.content});
    }

    hideTips(){
        this.setState({show:false});
    }

    clearTimer(){
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        return(
            <div className="text_tips layer1" style={{display:this.state.show?'block':'none'}}>
                <div className="text">
                    <p>{this.state.content}</p>
                </div>
            </div>
        )
    }
}