
angular.module('app').controller('diliveredCtrl',['$scope','dileveredService',function($scope,dileveredService){
    dileveredService.all().then(function(data){
        $scope.positionList = data;
    })
}])
