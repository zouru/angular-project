angular.module('app').directive('headBar',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/headBar.html',
        replace:true,
        scope:{
            isLeftShow:'=',
            title:'@',
            fade:'@'
        },
        controller:['$scope',function($scope){

            $scope.back = function(){
                if($scope.fade){
                    $scope.$emit('closeCitys',{});
                }else{
                    window.history.back();
                }
            }
        }]
    }
}])
