export default class ApplicationCache{
	constructor(){
		this.cache=window.applicationCache;
		if(this.cache){
			window.addEventListener("load",()=>{
				alert("window loaded");
				this.cache.addEventListener("updateready",()=>{
					alert("application cache update ready : %s",this.cache.status);
					if(this.cache.status===this.cache.UPDATEREADY){
						alert("swap cache ...");
						this.cache.swapCache();
						//reload
						window.location.reload();
					}
				},false);
			},false);


			let logEvent=(event)=>{
				// alert(event.type);
				console.log(event.type);
			}
			this.cache.addEventListener('checking', logEvent, false);
			this.cache.addEventListener('noupdate', logEvent, false);
			this.cache.addEventListener('downloading', logEvent, false);
			this.cache.addEventListener('progress', logEvent, false);
			this.cache.addEventListener('cached', logEvent, false);
			this.cache.addEventListener('updateready', logEvent, false);
			this.cache.addEventListener('obsolete', logEvent, false);
			this.cache.addEventListener('error', logEvent, false);

			alert("begin update ...");
			try {
				this.cache.update();
			}
			catch(ex){
				alert("application cache update fail");
			}
		}
	}
}
