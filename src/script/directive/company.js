
angular.module('app').directive('companyInfo',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/companyInfo.html',
        replace:true,
        scope:{
            data:'='
        }
    }
}])
