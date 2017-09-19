
angular.module('app').controller('mainCtrl',['$scope','positionService',function($scope,positionService){
    positionService.all().then(function(data){
        $scope.positionList = data;
    })
}])
