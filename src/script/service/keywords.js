angular.module('app').service('keywordsService',[function(){
    //通过key值获取 localstorage中的数据并返回数组
    this.get = function(key){
        var arr = localStorage.getItem(key);
        return arr ? JSON.parse(arr) : [];
    }
    //给定键名和数组，把转化的json字符串加入 localstorage
    this.set = function(key,value){
        if(typeof value ==='string'){
            localStorage.setItem(key,value);
        }else{
            localStorage.setItem(key,JSON.stringify(value));
        }
    }
}])
