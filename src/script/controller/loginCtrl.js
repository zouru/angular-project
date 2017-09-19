
angular.module('app').controller('loginCtrl',['$scope','$state',function($scope,$state){
    $scope.submit = function(){
        //假设用户输入了正确的用户名密码
        localStorage.setItem('userId',1);
        $state.go('myInfo');
    }
}])
