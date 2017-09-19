angular.module('app').directive('appPositionList',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/position.html',
        scope:{
            data:'='
        }
    }
}])
