angular.module('app').controller('positionDetailCtrl',['$scope','$state','positionService','companyService',function($scope,$state,positionService,companyService){
    var id = $state.params.id;
    var promise = positionService.findById(id);
    promise.then(function(data){
        $scope.job = data;
        companyService.findById(data.companyId).then(function(data){
            $scope.company = data;
            console.log($scope.company,888);
        })

    })

}])
