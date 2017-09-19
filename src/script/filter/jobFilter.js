angular.module('app').filter('jobFilter',function(){
    // options {city:'北京',key:'阿里巴巴'}
    return function(data, options) {
        var jobList = [];
        for(var i=0;i<data.length;i++){
            //当前的职位数据
            var item = data[i];
            var flag = new RegExp(options.keywords).test(item.companyName) || new RegExp(options.keywords).test(item.job);
            if(!options.city){//如果城市没选，那么看公司和职位
                if(flag){
                    jobList.push(item);
                }
            }else{
                if(flag && item.cityName==options.city){
                    jobList.push(item);
                }
            }
        }
        return jobList;
    }
})
