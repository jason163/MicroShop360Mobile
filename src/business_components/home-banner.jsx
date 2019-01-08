
let React = require('react');

class HomeBanner extends React.Component {
	constructor(props) {
		super(props);
		this.delay = 3000;
		this.timer = null;
		this.state = {
			banners: this.props.banners,
			index: 0
		};
	}

	static get propTypes(){
		return{
			sectionStyle:React.PropTypes.string
			,banners:React.PropTypes.array
		}
	}

	componentWillReceiveProps(nextProps) {

		let newState=Object.assign({},this.state);
		newState.banners=nextProps.banners;
		this.setState(newState);
		if(newState.banners.length>0){
			this.start();
		}
	}

	roll() {
		let nextIndex = this.state.index + 1;
		if (nextIndex >= this.state.banners.length) {
			nextIndex = 0;
		}
		this.setState(Object.assign({}, this.state, {index: nextIndex}));
		this.start();
	}

	start() {
		this.clearTimer();
		this.timer=setTimeout(()=>{
			this.roll();
		},this.delay);
	}

	clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	componentDidMount() {
		if (this.state.banners.length > 0) {
			this.start();
		}
	}
	componentWillUnmount() {
		this.clearTimer();
	}


	render() {
		let contentStyle = {
			width: `${100 * this.state.banners.length}%`
		};
		/*if (this.state.banners.length > 0) {
			let txValue = this.state.index * (100 / this.state.banners.length) * -1;
			let tx = `translate3d(${txValue}%,0,0)`;
			contentStyle.transform = tx;
			contentStyle.WebkitTransform = tx;
		}*/

		let bannerImgs = this.state.banners.map((item, index)=> {
							return <div key={index} style={{width:`${100/this.state.banners.length}%`}}>
										<a className={index===this.state.index?"img current":"img"}
											  style={{backgroundImage:`url(${item.BannerSrcUrl})`}}
												key={index} onTouchMove={(event)=>{
															event.preventDefault();
															this.roll();
															}}></a>
									</div>
						});

		let bannerIdoit = this.state.banners.map((item,index)=>{
			return <li key={index} className={index === this.state.index?"on":""}></li>
		})

		return (
			<section className={this.props.sectionStyle}>
				<div className="sliding">
					<div style={contentStyle}>
						{bannerImgs}
					</div>

					<ul className="sd">
						{bannerIdoit}
					</ul>

				</div>
			</section>
		);
	}
}

require("swipers/js/swiper.min.js")
require("swipers/css/swiper.min.css")
class BannerSlider extends React.Component{

	constructor(props){
		super(props);
		this.swipe = null;
		this.state={
				count:10
		}
	}

	static get propTypes(){
		return{
			banners:React.PropTypes.array
		}
	}

	componentDidMount(){
		this.swipe = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: 1,
			paginationClickable: true,
			loop: true,
			speed:1000,
			autoplay:true,
			onInit:function (swiper){
				swiper.stopAutoplay();
				setTimeout(()=>{swiper.startAutoplay()},5000);
			},
			onTransitionEnd: function (swiper){
				swiper.stopAutoplay();
				setTimeout(()=>{swiper.startAutoplay()},5000);
			},
			onSlideChangeEnd: function (swiper){
				swiper.stopAutoplay();
				setTimeout(()=>{swiper.startAutoplay()},5000);
			}
		});
	}

	componentWillUnmount(){
		this.swipe = null;
	}

	render(){
		return(
			<section className="main-banner">
				<div className="swiper-container">
					<div className="swiper-wrapper">
						{
							this.props.banners.map((item,index)=>{
								return(
									<div className="swiper-slide" key={item.BannerSrcUrl+index}>
										<a href={item.BannerLinkUrl}
										   style={{backgroundImage:`url(${item.BannerSrcUrl})`}}></a></div>
								)
							})
						}
					</div>
					<div className="swiper-pagination"></div>
				</div>
			</section>
		)
	}
}

export {HomeBanner,BannerSlider}