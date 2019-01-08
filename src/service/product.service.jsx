
import client from "utility/rest-client.jsx";


export class productService{

    /*商品详细页服务*/
    getProductDetail(sysNo){
        return client.get(`/Product/ProductDetail?productSysNo=${sysNo}`).then((res)=>{
            if(res.body.Success){
                return res.body;
            }
            throwError(res.body.Message);
            return false;
        });
    }

    /*商品评论服务*/
    updateProductUserful(commentSysNo){
        //debugger;
        return client.post("/ProductComment/SetCommentUseful",{commentsysno:commentSysNo}).then((res)=>{
            if(res.body.Success){
                return true;
            }
            showMessage(res.body.Message);
            return false;
        })
    }

    updateProductUnUserful(commentSysNo){
        return client.post("/ProductComment/SetCommentUnUseful",{commentsysno:commentSysNo}).then((res)=>{
            if(res.body.Success){
                return true;
            }
            showMessage(res.body.Message);
            return false;
        })
    }

    getProductCommentList(productSysNo,condition,index){
        return client.post("/Product/QueryProductComments",
            {productsysno:productSysNo,condition:condition,pageindex:index}).then((res)=>{
            if(res.body.Success){
                return res.body.Data;
            }
            return false;
        })
    }

    getProductCommnetStatistic(productSysNo)
    {
        return client.post("/Product/QueryProductCommentStatistics",
            {productsysno:productSysNo}).then((res)=>{
                return res;
        })
    }

    /*收藏商品*/
    favoriteProduct(productsysno){
        return client.post("/Customer/FavoriteProduct",{productsysno}).then((res)=>{
            if(res.body.Success){
                return true;
            }
            throwError(res.body.Message);
            return false;
        })
    }

}

export default new productService();