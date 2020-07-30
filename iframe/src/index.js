/**

 @Name：layuiAdmin 主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui
  .extend({
    setter: 'config', // 配置文件
    admin: 'lib/admin', // 核心模块
    view: 'lib/view', // 核心模块
  })
  .define(['setter', 'admin'], (exports) => {
    let $ = layui.$,
      $win = $(window),
      setter = layui.setter,
      admin = layui.admin,
      view = layui.view,
      element = layui.element,
      tabsPage = admin.tabsPage,
      APP_BODY = '#LAY_app_body', // 主体内容容器ID
      TABS_HEADER = '#LAY_app_tabsHeader', // tab标签列表ID
      FILTER_TAB_TABS = 'LAY-filter-layout-tabs', // tab标签容器过滤器
      // 打开标签页
      openTabsPage = (url, text = '新标签页') => {
        // 遍历页签选项卡
        let matchTo,
          isIndPage,
          tabs = $(`${TABS_HEADER}>li`),
          attr = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, ''),
          realURL = url.indexOf('http') > -1 ? url : setter.views + url,
          pathURL = admin.correctRouter(url), // 用来检查独立页
          tabChange = () => {
            // 定位当前tabs
            element.tabChange(FILTER_TAB_TABS, url)
            admin.tabsBodyChange(tabsPage.index, {
              url,
              text,
            })
          }
        // 遍历页面标签
        tabs.each(function (index) {
          let li = $(this),
            layid = li.attr('lay-id')
          if (layid === url) {
            matchTo = true
            tabsPage.index = index
          }
        })
        // 检查是否属于独立页面
        layui.each(setter.indPage, (index, item) => {
          if (pathURL === item) return (isIndPage = true)
        })
        if (isIndPage) return window.open(setter.views + url)

        // 如果未在选项卡中匹配到，则追加选项卡
        if (setter.pageTabs) {
          if (!matchTo) {
            setTimeout(() => {
              $(APP_BODY).append(
                '<div class="LAY-tabsBody-item layui-show"><iframe src="' +
                  realURL +
                  '" frameborder="0" class="layadmin-iframe"></iframe></div>',
              )
              tabChange()
            }, 10)
            tabsPage.index = tabs.length
            element.tabAdd(FILTER_TAB_TABS, {
              id: url, // 选项卡标题的lay-id属性值
              attr,
              title: `<span>${text}</span>`, // 选项卡的标题
            })
          }
        } else {
          let iframe = admin.tabsBody(admin.tabsPage.index).find('.layadmin-iframe')
          iframe[0].contentWindow.location.href = realURL
        }
        tabChange()
      }

    // 移动端初始化页面选择器
    admin.screen() < 2 && admin.sideFlexible()
    element.render('breadcrumb', 'LAY-filter-breadcrumb')
    // 将模块根路径设置为 controller 目录
    layui
      .config({
        // 设置模块根路径
        base: setter.base + 'controller/',
      })
      // 加载公共模块
      .use('common')

    // 扩展 lib 目录下的其它模块
    layui.each(setter.extend, (index, item) => {
      let mods = {}
      mods[item] = `{/}${setter.base}lib/extend/${item}`
      layui.extend(mods)
    })

    view().autoRender()

    // 输出接口
    exports('index', { openTabsPage })
  })
