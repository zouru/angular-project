
angular.module('app').directive('appCitys',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/appCitys.html',
        replace:true,
        scope:{
            nowId:'@',
        },
        controller:['$scope','$http',function($scope,$http){
            $http.get('data/citys.json').then(function(res){
                $scope.citys = res.data;
            })
            $scope.changeCity= function(id){
                $scope.$emit('sendCityId',{id:id});

            }
        }]
    }
}])
