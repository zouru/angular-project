angular.module('app').directive('positionInfo',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/positionInfo.html',
        scope:{
            data:'='
        }
    }
}])
