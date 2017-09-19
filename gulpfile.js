//引入gulp
var gulp = require('gulp');
//引入gulp插件加载模块
var $ = require('gulp-load-plugins')();//后面括号不能省略
//
var open = require('open');
//引入less编译
var gulpless = require('gulp-less');
//css压缩
var cssmin = require('gulp-cssmin');
//用来定义目录路径
var app = {
    srcPath:'src/',//源码路径
    devPath:'build/',//开发目录
    prdPath:'dist/'//生产目录
}

//lib任务 ：将bower安装的第三方文件，拷贝到

gulp.task('lib',function(){
    // 读取bower_components目录下面的所有文件
    gulp.src('bower_components/**/*')
    //拷贝到开发目录
    .pipe(gulp.dest(app.devPath+'vendor'))
    //拷贝到生产目录
    .pipe(gulp.dest(app.prdPath+'vendor'))
    //通知服务器刷新浏览器
    .pipe($.connect.reload());

})
//命令行执行 gulp lib 测试一下

//html任务：将src所有的html文件拷贝 到开发和测试目录下
gulp.task('html',function(){
    //读取src/目录下所有的html文件
    gulp.src(app.srcPath+"**/*.html")
    // 拷贝到开发目录
    .pipe(gulp.dest(app.devPath))
    //拷贝到生产目录
    .pipe(gulp.dest(app.prdPath))
    .pipe($.connect.reload());
})

//命令行执行 gulp html 测试一下

//json 任务：将模拟数据拷贝到开发生产目录
gulp.task('json',function(){
    gulp.src(app.srcPath+'data/**/*.json')
    .pipe(gulp.dest(app.devPath+'data'))
    .pipe(gulp.dest(app.prdPath+'data'))
    .pipe($.connect.reload())
})
//命令行执行 gulp json 测试一下

//less任务： 将less
//style/index.less中引入@import所有其他的less文件，编译只需要处理它即可
gulp.task('less',function(){
    //读取sytle/index.less文件
    gulp.src(app.srcPath+'style/index.less')
        //将less编译为css文件
        .pipe(gulpless())
        //将编译好的css文件放入开发目录的css文件夹中
        .pipe(gulp.dest(app.devPath+'css'))
        //将css文件压缩
        .pipe(cssmin())
        //将压缩的文件放入生产目录的css文件夹中
        .pipe(gulp.dest(app.prdPath+'css'))
        .pipe($.connect.reload())
})

//js任务
gulp.task('js',function(){
    //读取script目录下所有js文件
    gulp.src(app.srcPath+'script/**/*.js')
    //将这些js文件合并成一个 index.js
    .pipe($.concat('index.js'))
    //放入开发目录下
    .pipe(gulp.dest(app.devPath+'js'))
    //压缩js
    .pipe($.uglify())
    //放入声场目录下
    .pipe(gulp.dest(app.prdPath+'js'))
    .pipe($.connect.reload())
})

//image任务
gulp.task('image',function(){
    gulp.src(app.srcPath+'image/**/*')
    .pipe(gulp.dest(app.devPath+'image'))
    .pipe($.imagemin())
    .pipe(gulp.dest(app.prdPath+'image'))
    .pipe($.connect.reload())
})

//清除
gulp.task('clean',function(){
    //读取开发目录和生产目录
    gulp.src([app.devPath,app.prdPath])
    //清楚所有文件
    .pipe($.clean());
})

//总任务 build
gulp.task('build',['image','js','less','lib','html','json'])

//开启服务
gulp.task('serve',function(){
    $.connect.server({
        //默认从开发目录读起
        root:[app.devPath],
        //刷新浏览器
        livereload:true,
        port:8888
    });
    open('http://localhost:8888');
    //自动构建监听变动
    gulp.watch(app.srcPath+'script/**/*.js',['js']);
    gulp.watch('bower_components/**/*',['lib']);
    gulp.watch(app.srcPath+'**/*.html',['html']);
    gulp.watch(app.srcPath+'data/**/*.json',['json']);
    gulp.watch(app.srcPath+'style/**/*.less',['less']);
    gulp.watch(app.srcPath+'image/**/*',['image']);
})
//命令行输入 gulp 默认执行 gulp serve
gulp.task('default',['serve']);
