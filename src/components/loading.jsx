export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    static get propTypes() {
        return {
            inline: React.PropTypes.bool,
            isModal:React.PropTypes.bool
        };
    }

    static get defaultProps() {
        return {
            inline: false,
            isModal:false
        };
    }

    loading() {
        let newValue = this.state.count + 1;
        this.setState({
            count: newValue
        });
    }

    loaded() {
        if(this.state.count>0) {
            let newValue = this.state.count - 1;
            this.setState({
                count: newValue
            });
        }
    }

    render() {
        let loadding;
        if(!this.props.isModal) {
            loadding= <div className={classNames("loadingInner",{'on':this.state.count>0})}><em>loading</em><i></i></div>
        }
        else {
            loadding= <div className={classNames("loading",{'on':this.state.count>0})}>
                <div className="loadingInner">
                    <em>loading</em><i></i>
                </div>
            </div>
        }
        return (
           loadding
        );
    }
}