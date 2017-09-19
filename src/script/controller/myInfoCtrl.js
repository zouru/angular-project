
angular.module('app').controller('myInfoCtrl',['$scope','$state',function($scope,$state){
    $scope.logout = function(){
        localStorage.removeItem('userId');
        $state.go('my');
    }
}])
