import client from "utility/rest-client.jsx";

class HomeService{
	getHomeData(){
		return client.get("/home/GetHomeInfo").then((res)=>{
			return res.body;
		});
	}
}

export default new HomeService();