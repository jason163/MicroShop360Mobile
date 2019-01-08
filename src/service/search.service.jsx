import client from "utility/rest-client.jsx";

class SearchService{
    search(request){
        let url="/Search/Index";
        let args=[];
        if(!this.isEmptyObject(request))
        {
            for(let prop in request)
            {
                let arg={};
                arg.key=prop;
                arg.value=request[prop];
                if(!Object.is(arg.value,undefined)&&!Object.is(arg.value,null)&&!Object.is(arg.value,"")) {
                    args.push(arg);
                }
            }
        }
        if(args.length>0)
        {
            url=`${url}?`;
            args.forEach(arg=>{
                url=`${url}${arg.key}=${arg.value}&`;
            })
            url=url.substr(0,url.length-1);
        }
        return client.get(url).then((response)=> {
            return response;
        });
    }

    isEmptyObject( obj ) {
        let name;
        for (name in obj) {
            return false;
        }
        return true;
    }
    
}

export default new SearchService();