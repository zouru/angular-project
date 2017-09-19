angular.module('app',['ui.router','validation','validation.rule','ngAnimate']);


angular.module('app').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $stateProvider
        .state('main',{
            url:'/main',
            templateUrl:'view/main.html',
            controller:'mainCtrl'//命名规则，页面名+ctrl
        })
        .state('search',{
            url:'/search',
            templateUrl:'view/search.html',
            controller:'searchCtrl'//命名规则，页面名+ctrl
        })
        .state('my',{
            url:'/my',
            templateUrl:'view/my.html',
            controller:'myCtrl'//命名规则，页面名+ctrl
        })
        .state('position',{
            url:'/position/:id',
            templateUrl:'view/positionDetail.html',
            controller:'positionDetailCtrl'//命名规则，页面名+ctrl
        })

        .state('company',{
            url:'/company/:cid',
            templateUrl:'view/companyDetail.html',
            controller:'companyDetailCtrl'//命名规则，页面名+ctrl
        })
        .state('login',{
            url:'/login',
            templateUrl:'view/login.html',
            controller:'loginCtrl',
            replace:true
        })
        .state('myInfo',{
            url:'/myInfo',
            templateUrl:'view/myInfo.html',
            controller:'myInfoCtrl',
            replace:true
        })
        .state('dilivered',{
            url:'/dilivered',
            templateUrl:'view/dilivered.html',
            controller:'diliveredCtrl',
            replace:true
        })
    $urlRouterProvider.otherwise('main');
}])

//validation框架出错，1，加入如下代码。2，需要同时引入 validation-rule模块
angular.module('app').config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

angular.module('app').config(['$validationProvider',function($validationProvider){
    //配置校验规则
    var expression = {
        phone:/^1[\d]{10}$/,
        password: function(value){
            value = value+'';
            return value.length>5;
        }
    }
    //错误提示
    var defaultMsg = {
        phone:{
            success:'',
            error:'必须是11位手机号'
        },
        password:{
            success:'',
            error:'长度至少6位'
        }
    }
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])

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


angular.module('app').controller('diliveredCtrl',['$scope','dileveredService',function($scope,dileveredService){
    dileveredService.all().then(function(data){
        $scope.positionList = data;
    })
}])


angular.module('app').controller('loginCtrl',['$scope','$state',function($scope,$state){
    $scope.submit = function(){
        //假设用户输入了正确的用户名密码
        localStorage.setItem('userId',1);
        $state.go('myInfo');
    }
}])


angular.module('app').controller('mainCtrl',['$scope','positionService',function($scope,positionService){
    positionService.all().then(function(data){
        $scope.positionList = data;
    })
}])


angular.module('app').controller('myCtrl',['$scope',function($scope){

}])


angular.module('app').controller('myInfoCtrl',['$scope','$state',function($scope,$state){
    $scope.logout = function(){
        localStorage.removeItem('userId');
        $state.go('my');
    }
}])

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


angular.module('app').directive('companyInfo',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/companyInfo.html',
        replace:true,
        scope:{
            data:'='
        }
    }
}])


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


angular.module('app').directive('fourButton',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/fourButton.html',
        replace:true,

    }
}])

angular.module('app').directive('headBar',[function(){
    return {
        restrict:'E',
        templateUrl:'./view/template/headBar.html',
        replace:true,
        scope:{
            isLeftShow:'=',
            title:'@',
            fade:'@'
        },
        controller:['$scope',function($scope){

            $scope.back = function(){
                if($scope.fade){
                    $scope.$emit('closeCitys',{});
                }else{
                    window.history.back();
                }
            }
        }]
    }
}])


angular.module('app').directive('appHeader',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/header.html'
    }
}])

angular.module('app').directive('positionInfo',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/positionInfo.html',
        scope:{
            data:'='
        }
    }
}])

angular.module('app').directive('appPositionList',[function(){
    return {
        restrict:'E',
        replace:true,
        templateUrl:'view/template/position.html',
        scope:{
            data:'='
        }
    }
}])


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

angular.module('app').filter('jobFilter',function(){
    // options {city:'北京',key:'阿里巴巴'}
    return function(data, options) {
        var jobList = [];
        for(var i=0;i<data.length;i++){
            //当前的职位数据
            var item = data[i];
            var flag = new RegExp(options.keywords).test(item.companyName) || new RegExp(options.keywords).test(item.job);
            if(!options.city){//如果城市没选，那么看公司和职位
                if(flag){
                    jobList.push(item);
                }
            }else{
                if(flag && item.cityName==options.city){
                    jobList.push(item);
                }
            }
        }
        return jobList;
    }
})

angular.module('app').service('cityService',['$http',function($http){
    this.all = function(){
        return $http({
            url:'../data/citys.json',
            method:'get',
            cache:true
        }).then(function(res){
            return res.data;
        })
    }
    this.findById = function(id){
        return this.all().then(function(data){
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(data[i].id===id){
                    return data[i];
                }
            }
        })
    }
}])

angular.module('app').service('companyService',['$http',function($http){
    this.all = function(){
        return $http({
            url:'../data/company.json',
            method:'get',
            cache:true
        }).then(function(res){
            return res.data;
        })
    }
    this.findById = function(id){
        return this.all().then(function(data){
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(data[i].id===id){
                    return data[i];
                }
            }
        })
    }
}])

angular.module('app').service('dileveredService',['$http',function($http){
    this.all = function(){
        return $http({
            url:'../data/dilivered.json',
            method:'get',
            cache:true
        }).then(function(res){
            return res.data;
        })
    }
    this.findById = function(id){
        return this.all().then(function(data){
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(data[i].id===id){
                    return data[i];
                }
            }
        })
    }
}])

angular.module('app').service('keywordsService',[function(){
    //通过key值获取 localstorage中的数据并返回数组
    this.get = function(key){
        var arr = localStorage.getItem(key);
        return arr ? JSON.parse(arr) : [];
    }
    //给定键名和数组，把转化的json字符串加入 localstorage
    this.set = function(key,value){
        if(typeof value ==='string'){
            localStorage.setItem(key,value);
        }else{
            localStorage.setItem(key,JSON.stringify(value));
        }
    }
}])

angular.module('app').service('positionService',['$http',function($http){
    this.all = function(){
        return $http({
            url:'../data/positionList.json',
            method:'get',
            cache:true
        }).then(function(res){
            return res.data;
        })
    }
    this.findById = function(id){
        return this.all().then(function(data){
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(data[i].id===id){
                    return data[i];
                }
            }
        })
    }
}])
