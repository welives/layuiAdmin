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
          tabs = $(`${TABS_HEADER}>li`),
          path = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, ''),
          tabChange = () => {
            // 定位当前tabs
            element.tabChange(FILTER_TAB_TABS, url)
            admin.tabsBodyChange(tabsPage.index, {
              url,
              text,
            })
          }
        tabs.each(function (index) {
          let li = $(this),
            layid = li.attr('lay-id')
          if (layid === url) {
            matchTo = true
            tabsPage.index = index
          }
        })

        // 如果未在选项卡中匹配到，则追加选项卡
        if (setter.pageTabs) {
          if (!matchTo) {
            $(APP_BODY).append([
              '<div class="LAY-tabsBody-item layui-show"><iframe src="' +
                url +
                '" frameborder="0" class="layadmin-iframe"></iframe></div>',
            ])
            tabsPage.index = tabs.length
            element.tabAdd(FILTER_TAB_TABS, {
              id: url, // 选项卡标题的lay-id属性值
              attr: path,
              title: `<span>${text}</span>`, // 选项卡的标题
            })
          }
        } else {
          let iframe = admin
            .tabsBody(admin.tabsPage.index)
            .find('.layadmin-iframe')
          iframe[0].contentWindow.location.href = url
        }
        tabChange()
      }

    // 移动端初始化页面选择器
    admin.screen() < 2 && admin.sideFlexible()

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