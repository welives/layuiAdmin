layui.define(['element'], (exports) => {
  let $ = layui.$,
    layer = layui.layer,
    element = layui.element,
    tabs = $('#LAY_app_tabsHeader>li')

  let moyuTab = {
    render(options) {
      options.filter = options.filter || null
      options.urlHashLocation = options.urlHashLocation || false
      options.multiModule = options.multiModule || false
      options.maxTabNum = options.maxTabNum || 10
      options.menuList = options.menuList || []
      options.homeInfo = options.homeInfo || {}
      options.listenSwitchCallback =
        options.listenSwitchCallback || function () {}
      this.listen(options)
    },

    /**
     * @description 新建tab窗口
     * @param {object} options
     */
    createTab(options) {
      options.tabId = options.tabId || null
      options.href = options.href || null
      options.title = options.title || null
      options.isIframe = options.isIframe || false
      options.filter = options.filter || null
      options.maxTabNum = options.maxTabNum || 10
      if (tabs.length >= options.maxTabNum) {
        return layer.msg('Tab窗口已达到数量上限,请先关闭部分Tab')
      }
      let el = options.isIframe ? parent.layui.element : element
      $('#LAY_app_body').append([
        `<div class="layui-tabsbody-item layui-show"><iframe frameborder="0" class="layui-iframe" src=${options.href}></iframe></div>`,
      ])
      el.tabAdd(options.filter, {
        id: options.tabId,
        title: `<i class="layui-tab-active"></i><span>${options.title}</span>`,
      })
      // $('[lay-filter=side-menu]').attr('layui-tab-tag', 'add')
      // sessionStorage.setItem('layui-menu-' + options.tabId, options.title)
    },

    changeTab(filter, tabId) {
      element.tabChange(filter, tabId)
    },

    deleteTab(tabId, isParent) {
      // $('.layui-tab .layui-tab-title .layui-unselect.layui-tab-bar').remove()
      if (isParent === true) {
        parent.layui.element.tabDelete('layui-layout-tabs', tabId)
      } else {
        element.tabDelete('layui-layout-tabs', tabId)
      }
    },

    /**
     * @description 检查tab窗口是否已存在
     * @param {string} tabId
     * @param {boolean} [isIframe=false]
     * @returns {boolean}
     */
    isExist(tabId, isIframe = false) {
      let check = false
      if (isIframe === undefined || isIframe === false) {
        tabs.each(function () {
          let layId = $(this).attr('lay-id')
          if (layId !== null && layId === tabId) {
            check = true
          }
        })
      } else {
        parent.layui.tabs.each(function () {
          let layId = $(this).attr('lay-id')
          if (layId !== null && layId === tabId) {
            check = true
          }
        })
      }
      return check
    },

    listenTabSwitch(options) {
      options.filter = options.filter || null
      options.multiModule = options.multiModule || false
      options.urlHashLocation = options.urlHashLocation || false
      options.listenSwitchCallback =
        options.listenSwitchCallback || function () {}
      element.on(`tab(${options.filter})`, function (data) {
        let tabId = $(this).attr('lay-id')
        if (options.urlHashLocation) {
          location.hash = '/' + tabId
        }
        if (typeof options.listenSwitchCallback === 'function') {
          options.listenSwitchCallback()
        }
      })
    },

    /**
     * @description 监听
     * @param {object} [options={}]
     */
    listen(options = {}) {
      // 打开新的tab窗口
      $('body').on('click', '*[lay-href]', function () {
        let tabId = $(this).attr('lay-href'),
          href = $(this).attr('lay-href'),
          title = $(this).text(),
          target = $(this).attr('target')
        layer.close(window.popupMenu)
        // let el = $(`.layui-side [lay-href='${href}']`)
        // if (el.length) {
        //   $(el)
        //     .closest('.layui-nav-tree')
        //     .find('.layui-this')
        //     .removeClass('layui-this')
        //   $(el).parent().addClass('layui-this')
        // }
        if (
          target === '_blank' ||
          options.filter === null ||
          options.filter === undefined
        ) {
          return window.open(href, '_blank')
        }
        if (tabId === null || tabId === undefined) tabId = new Date().getTime()
        let check = moyuTab.isExist(tabId)
        if (!check) {
          moyuTab.createTab({
            tabId,
            href,
            title,
            isIframe: false,
            filter: options.filter,
            maxTabNum: options.maxTabNum,
          })
        }
        element.tabChange(options.filter, tabId)
      })
    },
  }
  exports('moyuTab', moyuTab)
})
