// 获取项目根目录
window.rootPath = (() => {
  src = document.scripts[document.scripts.length - 1].src
  let jsPath = src.substring(0, src.lastIndexOf('/') + 1)
  return jsPath.substring(0, jsPath.lastIndexOf('js'))
})()

layui
  .config({
    // 自定义模块的根目录
    base: rootPath + 'modules/',
  })
  .extend({
    moyuAdmin: 'moyu/moyuAdmin', // 后台扩展
    moyuMenu: 'moyu/moyuMenu', // 菜单扩展
    moyuTab: 'moyu/moyuTab', // 菜单扩展
    echarts: 'echarts/echarts.min', // echarts图表扩展
    echartsTheme: 'echarts/echartsTheme', // echarts图表主题扩展
  })
  .use('layer', () => {
    let layer = layui.layer
    if (!/http(s)?:\/\//.test(location.href)) {
      let tip =
        '请先将项目部署至web环境(Apache/Tomcat/Nginx/IIS/等),否则部分数据将无法正常显示!'
      return layer.alert(tip)
    }
  })
