require ("assets/css/base.css");
require ("assets/css/index.css");

export default class PageLayout extends React.Component {
	static get propTypes() {
		return {
			children: React.PropTypes.any,
			style:React.PropTypes.object,
			isHome:React.PropTypes.number,
			isIndex:React.PropTypes.number
		};
	}
	static get defaultProps(){
		return {
			style:{}
		};
	}

	render() {
		return (
			<div className={classNames('layer',{'layerPd':this.props.isHome})} style={this.props.isIndex===1?{paddingTop:0}:this.props.style}>
				{this.props.children}
			</div>
		);
	}
}
