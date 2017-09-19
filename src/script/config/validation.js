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
