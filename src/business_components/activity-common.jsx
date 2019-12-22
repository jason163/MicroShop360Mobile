

/*活动信息*/
class ActDetailTitle extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }
    render() {
        let nameStyle = {
            fontSize:`${18}px`,
            lineHeight:`${25}px`
        }
        return (
            <section id="proTitle" className="details_con box-line-t mb5">
                <div className="d_item text box-line-b">
                    <p className="name" style={nameStyle}>
                        {this.props.data.Name}
                    </p>
                    <p className="sales_word">{this.props.data.CDTitle}</p>
                    <p className="price">
                        <span className="mr5"><em>{this.props.data.CurrentPrice}</em></span>
                        <del>￥{this.props.data.MarketPrice}</del>
                    </p>
                </div>
            </section>
        );
    }
}

export {
    ActDetailTitle
}