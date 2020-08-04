/**

 @Name：全局配置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL（layui付费产品协议）

 */

layui.define(['laytpl', 'layer', 'element', 'util'], (exports) => {
  exports('setter', {
    container: 'LAY_app', // 应用容器ID
    base: layui.cache.base, // 记录静态资源所在路径
    views: layui.cache.base + 'views/', // 视图所在目录
    entry: 'index', // 默认视图文件名
    engine: '.html', // 视图文件后缀名
    pageTabs: true, // 是否开启页面选项卡功能
    api: '', // 后台接口的地址 ,如果你的域名直接指向public目录，则直接填域名/（需要加斜杠）
    webUrl: 'http://127.0.0.1:5501/iframe/', // 前台地址（区别于后台前端地址）
    name: 'LAYUI 摸🐟',
    tableName: 'layuiAdmin', // 本地存储表名
    MOD_NAME: 'admin', // 模块事件名
    debug: true, // 是否开启调试模式
    interceptor: false, //是否开启未登入拦截
    // 自定义请求字段
    request: {
      tokenName: 'access_token', // 自动携带 token 的字段名。可设置 false 不携带
    },
    // 自定义响应字段
    response: {
      statusName: 'code', // 数据状态字段名
      statusCode: {
        ok: 0, // 数据状态正常的状态码
        logout: 1001, // 登录状态失效的状态码
      },
      msgName: 'msg', // 状态信息的字段名称
      dataName: 'data', // 数据详情的字段名称
    },
    indPage: [
      '/user/reg.html', // 前台注册页
      '/user/login.html', //前台登入页
      '/user/forget.html', // 前台找回密码页
    ],
    // 扩展到第三方模块
    extend: ['echarts', 'echartsTheme', 'wangEditor'],
    // 主题配置
    theme: {
      color: [
        {
          main: '#42b983', //主题色
          selected: '#009688', //选中色
          alias: 'default', //默认别名
        },
        {
          main: '#03152A',
          selected: '#3B91FF',
          alias: 'dark-blue', //藏蓝
        },
        {
          main: '#2E241B',
          selected: '#A48566',
          alias: 'coffee', //咖啡
        },
        {
          main: '#50314F',
          selected: '#7A4D7B',
          alias: 'purple-red', //紫红
        },
        {
          main: '#344058',
          logo: '#1E9FFF',
          selected: '#1E9FFF',
          alias: 'ocean', //海洋
        },
        {
          main: '#3A3D49',
          logo: '#2F9688',
          selected: '#5FB878',
          alias: 'green', //墨绿
        },
        {
          main: '#20222A',
          logo: '#F78400',
          selected: '#F78400',
          alias: 'red', //橙色
        },
        {
          main: '#28333E',
          logo: '#AA3130',
          selected: '#AA3130',
          alias: 'fashion-red', //时尚红
        },
        {
          main: '#24262F',
          logo: '#3A3D49',
          selected: '#009688',
          alias: 'classic-black', //经典黑
        },
        {
          logo: '#226A62',
          header: '#2F9688',
          alias: 'green-header', //墨绿头
        },
        {
          main: '#344058',
          logo: '#0085E8',
          selected: '#1E9FFF',
          header: '#1E9FFF',
          alias: 'ocean-header', //海洋头
        },
        {
          header: '#393D49',
          alias: 'classic-black-header', //经典黑头
        },
      ],
      //初始的颜色索引，对应上面的配色方案数组索引
      //如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
      initColorIndex: 0,
    },
  })
})
