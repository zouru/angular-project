
angular.module('app').directive('appFooter',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/footer.html',
        replace:true,
        scope:{

        },
        controller:['$scope',function($scope){
            $scope.isLogin = localStorage.getItem('userId');
        }]
    }
}])
