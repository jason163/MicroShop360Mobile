import client from "utility/rest-client.jsx";

class CategoryService{
    loadTopCategories(){
        let url="/search/loadtopcategories";
        return client.get(url).then((response)=> {
            return response;
        });
    }

    loadCategoriesByParentCategoryCode(parentCategoryCode){
        if(!Object.is(parentCategoryCode,undefined)&&!Object.is(parentCategoryCode,null)&&!Object.is(parentCategoryCode,"")) {
            let url = "/search/loadcategoriesbyparentcategorycode";
            return client.post(url, {parentCategoryCode: parentCategoryCode}).then((response)=> {
                return response;
            });
        }
        return new Promise((resolve, reject)=>{});
    }
}

export default new CategoryService();