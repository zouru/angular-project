
angular.module('app').directive('yuKeywords',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/keywords.html',
        replace:true,
        scope:{
            data:'=',
        },
        controller:['$scope',function($scope){
            $scope.removeKeywords = function(index){
                $scope.$emit('removeKeywords',{index:index});
            }
            $scope.changeKeywords = function(keywords){
                console.log(keywords,'keywords');
                $scope.$emit('oldSearch',keywords);
            }
        }]

    }
}])
