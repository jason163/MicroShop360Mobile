
export default class Empty extends React.Component{
	render(){
		return (
			<div className="list-empty">
				<div className="empty-content">
					<img src={require("assets/images/empty.png")}/>
					<p>暂无数据</p>
				</div>
			</div>
		);
	}
}