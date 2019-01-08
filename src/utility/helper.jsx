/*数据有效性校验*/
class dataValidator {

    isEmpty(str){
        return !str || str.length === 0;
    }
    
}

export default{
    dataValidator: new dataValidator()
}