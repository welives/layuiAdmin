/**
 layuiAdmin pro 构建
*/

const pkg = require('./package.json')
const inds = pkg.independents

const { series, src, dest } = require('gulp')
const uglify = require('gulp-uglify') // 压缩js
const minify = require('gulp-minify-css') // 压缩css
const concat = require('gulp-concat')
const rename = require('gulp-rename') // 重命名
const replace = require('gulp-replace')
const header = require('gulp-header')
const del = require('del') // 删除
const gulpif = require('gulp-if') // 判断
const minimist = require('minimist')
const babel = require('gulp-babel')

//获取参数
const argv = require('minimist')(process.argv.slice(2), {
    default: {
      ver: 'all',
    },
  }),
  //注释
  note = [
    '/** <%= pkg.name %>-v<%= pkg.version %> <%= pkg.license %> License By <%= pkg.homepage %> */\n <%= js %>',
    { pkg: pkg, js: ';' },
  ],
  destDir = './dist', //构建的目标目录
  taskList = {
    // 清理
    clear(cb) {
      del(['./dist/*'])

      cb()
    },
    // 压缩JS
    minJS(cb) {
      let jsPath = [
        './src/**/*.js',
        '!./src/config.js',
        '!./src/lib/extend/echarts.js',
        '!./src/lib/extend/echartsTheme.js',
      ]
      // 读取匹配的文件
      src(jsPath)
        .pipe(babel()) // 转译成ES5语法
        .pipe(uglify()) // 压缩
        .pipe(header.apply(null, note)) // 添加文件头注释
        .pipe(dest(destDir)) // 复制文件到指定路径

      cb()
    },
    // 压缩CSS
    minCSS(cb) {
      let cssPath = ['./src/**/*.css'],
        noteNew = JSON.parse(JSON.stringify(note))
      noteNew[1].js = ''
      src(cssPath)
        .pipe(
          minify({
            compatibility: 'ie7',
          }),
        )
        .pipe(header.apply(null, noteNew))
        .pipe(dest(destDir))

      cb()
    },
    // 复制文件夹
    move(cb) {
      src('./src/config.js').pipe(dest(destDir))
      src('./src/lib/extend/echarts.js').pipe(dest(destDir + '/lib/extend'))
      src('./src/lib/extend/echartsTheme.js').pipe(
        dest(destDir + '/lib/extend'),
      )
      src('./src/style/res/**/*').pipe(dest(destDir + '/style/res'))
      src('./src/views/**/*').pipe(dest(destDir + '/views'))

      cb()
    },
  }

/**
 * gulp v4 版本写法
 */
exports.default = series(
  taskList.clear,
  taskList.minJS,
  taskList.minCSS,
  taskList.move,
)
