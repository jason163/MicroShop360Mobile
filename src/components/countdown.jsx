
export default class Countdown extends React.Component{
    static get propTypes(){
        return{
          showIcon:React.PropTypes.bool
            ,leftSeconds:React.PropTypes.number.isRequired
            ,timeoutCallback:React.PropTypes.func
        };
    }

    static get defaultProps(){
        return{
            showIcon:true
            ,leftSeconds:0
        };
    }

    constructor(props){
        super(props);
        this.timer = null;
        this.state={
          totalSeconds:this.props.leftSeconds
        };
    }

    run(){
        this.clearTimer();
        this.timer = setInterval(()=>{
            let nextTotalSeconds = this.state.totalSeconds -1;
            this.setState(Object.assign({},this.state,{totalSeconds:nextTotalSeconds}));
            if(nextTotalSeconds < 1){
                this.clearTimer();
                this.props.timeoutCallback();
            }
        },1*1000);
    }

    clearTimer(){
        if(this.timer){
            clearInterval(this.timer);
        }
    }

    componentDidMount(){
        if(this.state.totalSeconds > 0){
            this.run();
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.leftSeconds > 0){
            this.setState(Object.assign({},this.state,{totalSeconds:nextProps.leftSeconds}));
            this.run();
        }
    }

    componentWillUnmount(){
        this.clearTimer();
    }

    padNumber(num,fill){
        let len = String(num).length;
        return Array(fill>len ? fill-len+1||0:0).join(0)+num;
    }

    render(){
       let totalSecond = this.state.totalSeconds;
        let leftSecond =this.padNumber(parseInt(totalSecond%60,10),2);
        let totalMinute = totalSecond/60;
        let leftMinute = this.padNumber(parseInt(totalMinute%60,10),2) ;
        let leftHour =this.padNumber(parseInt(totalSecond/(60*60),10),2);
        return(
            <em className="timer">
                <i ref="hour">{leftHour}</i>:
                <i ref="minute">{leftMinute}</i>:
                <i ref="second">{leftSecond}</i>
            </em>
        );
    }


}