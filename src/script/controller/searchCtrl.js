angular.module('app').controller('searchCtrl',['$filter','keywordsService','$scope','positionService','cityService',function($filter,keywordsService,$scope,positionService,cityService){
    //获取本地存储的关键字
    $scope.keywordsList = JSON.parse(localStorage.getItem('keywordsList'));

    $scope.showCitys = function(){
        $scope.isCitysShow = true;
        $scope.isLeftShow = false;
    }
    $scope.$on('closeCitys',function(event,res){
        $scope.isLeftShow = false;
        $scope.isCitysShow = false;
    })
    positionService.all().then(function(data){
        // $scope.positionList = data;
        //
    })
    $scope.$on('sendCityId',function(event,res){
        var cityId = res.id;
        $scope.nowId = cityId;
        $scope.isLeftShow = false;
        $scope.isCitysShow = false;
        cityService.findById(cityId).then(function(data){
            //$scope.city是搜索条件之一
            $scope.city = data.name;
            $scope.search();
        })
    });
    $scope.search = function(){
        if(!$scope.keywords) return ;
        var options = {city:$scope.city,keywords:$scope.keywords};
        positionService.all().then(function(data){
            var data = $filter('jobFilter')(data,options);
            $scope.positionList = data;
            if(data.length==0){
                $scope.keywords = '';
            }else{
                var keywordsList = keywordsService.get('keywordsList');
                if(!(keywordsList.indexOf($scope.keywords)>-1)){
                    keywordsList.push($scope.keywords);
                }
                $scope.keywordsList = keywordsList;
                keywordsService.set('keywordsList',keywordsList);
            }
            console.log(data,'filter');
        })


    }

    //接收keywords组件的发射的removeKeywords事件
    $scope.$on('removeKeywords',function(event,data){
        $scope.keywordsList.splice(data.index,1);
        keywordsService.set('keywordsList',$scope.keywordsList);
    })

    //点击横条 回到原始查找
    $scope.$on('oldSearch',function(event,keywords){
        $scope.keywords = keywords;
        $scope.search();
    })
}])
