angular.module('app').controller('companyDetailCtrl',['$scope','$state','companyService',function($scope,$state,companyService){
    var cid = $state.params.cid;
    companyService.findById(cid).then(function(data){
        $scope.company = data;
        $scope.nowIndex = 0;

        $scope.changeList = function(index){
            $scope.jobList = data.positionClass[index].positionList;
            $scope.nowIndex = index;
        }
        $scope.changeList(0);
        console.log($scope.company,888);
    })
}])
