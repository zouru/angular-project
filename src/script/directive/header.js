
angular.module('app').directive('appHeader',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/header.html'
    }
}])
