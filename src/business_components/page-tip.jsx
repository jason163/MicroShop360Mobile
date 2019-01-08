

export default class PageTip extends React.Component {
	static get contextTypes(){
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	static get propTypes(){
		return {
			messageCount:React.PropTypes.number,
			scoreCount:React.PropTypes.number
		};
	}

	constructor(props){
		super(props);
		this.state={
			messageCount:0,
			scoreCount:0
		};
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			messageCount:nextProps.messageCount,
			scoreCount:nextProps.scoreCount
		});
	}

	linkToMessages() {
		this.context.router.push("/mine/messagecenter");
	}

	linkToPoints() {
		this.context.router.push("/mine/points");
	}

	render() {
		return (
			<div className="page-tip">
				<span className="title">用户消息</span>
				<span className="score" onClick={this.linkToPoints.bind(this)}>
					<i className="iconfont icon-weibiaoti2"></i>可用积分(<em>{this.state.scoreCount}</em>)</span>
				<span className="message" onClick={this.linkToMessages.bind(this)}>
					<i className="iconfont icon-xiaoxi"></i>消息(<em>{this.state.messageCount}</em>)
				</span>
			</div>
		)
	}
}