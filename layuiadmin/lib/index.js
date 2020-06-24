layui
  .extend({
    setter: 'lib/config',
    admin: 'lib/admin',
    view: 'lib/view',
  })
  .define(['setter', 'admin'], (exports) => {
    let $ = layui.$,
      $win = $(window),
      setter = layui.setter,
      element = layui.element,
      admin = layui.admin,
      view = layui.view,
      tabsPage = admin.tabsPage,
      APP_TABS_HEADER = 'LAY-app-tabs-header',
      APP_TABS_BODY = 'LAY-app-tabs-body',
      FILTER_TABS_LIST = 'layadmin-tabs-list',
      // 打开标签页
      openTabsPage = function (url, text = '新标签页') {
        // 遍历页签选项卡
        let matchTo,
          tabs = $(`#${APP_TABS_HEADER}>li`),
          path = url.replace(/(^http(s?):\/\/)|(\?[\s\S]*$)/g, '')
        tabs.each(function (index) {
          let li = $(this),
            layid = li.attr('lay-id')
          if (layid === url) {
            matchTo = true
            tabsPage.index = index
          }
        })
        if (setter.pageTabs) {
          // 如果未在选项卡中匹配到，则追加选项卡
          if (!matchTo) {
            $(`#${APP_TABS_BODY}`).append([
              `<div class="layadmin-tabs-body-item layui-show"><iframe src="${url}" frameborder="0" class="layadmin-iframe"></iframe></div>`,
            ])
            tabsPage.index = tabs.length
            element.tabAdd(FILTER_TABS_LIST, {
              id: url, // 选项卡标题的lay-id属性值
              attr: path,
              title: `<span>${text}</span>`, // 选项卡的标题
            })
          }
        } else {
          let iframe = admin
            .getTabsBody(admin.tabsPage.index)
            .find('.layadmin-iframe')
          iframe[0].contentWindow.location.href = url
        }
        // 定位当前tabs
        element.tabChange(FILTER_TABS_LIST, url)
        admin.tabsBodyChange(tabsPage.index, {
          url,
          text,
        })
      }

    layui
      .config({
        // 设置模块根路径
        base: setter.base + 'modules/',
      })
      // 加载公共模块
      .use('common')

    // 扩展 lib 目录下的其它模块
    layui.each(setter.extend, (index, item) => {
      // layui.each(obj, fn) 对象（Array、Object、DOM 对象等）遍历，可用于取代for语句
      let mods = {}
      mods[item] = `${setter.base}lib/extend/${item}`
      layui.extend(mods)
    })

    view().autoRender()

    // 输出接口
    exports('index', { openTabsPage })
  })
