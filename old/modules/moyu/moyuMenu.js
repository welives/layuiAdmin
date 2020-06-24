layui.define(['element', 'laytpl'], (exports) => {
  let $ = layui.$,
    layer = layui.layer,
    element = layui.element,
    laytpl = layui.laytpl

  let moyuMenu = {
    /**
     * @description 渲染菜单模块
     * @param {object} options
     */
    render(options) {
      options.multiModule = options.multiModule || false
      if (options.multiModule) {
        // 渲染多模块
        this.renderMultiModule(options.menuList, options.menuChildOpen)
      } else {
        // 渲染单模块
        this.renderSingleModule(options.menuList, options.menuChildOpen)
      }
      this.listen()
    },

    /**
     * @description 单模块菜单渲染
     * @param {array} [menuList=[]] 菜单数据
     * @param {boolean} [menuChildOpen=false] 是否默认展开左侧菜单
     */
    renderSingleModule(menuList = [], menuChildOpen = false) {
      let leftMenusHtml = '',
        childOpenClass = menuChildOpen ? 'layui-nav-itemed' : ''

      leftMenusHtml = this.renderLeftMenu(menuList, { childOpenClass })
      $('body').addClass('layui-single-module') // 单模块标识
      $('.layui-header-menu').remove() // 移除头部导航节点
      $('[lay-filter=side-menu]').html(leftMenusHtml) // 左侧菜单
      element.init()
    },

    /**
     * @description 多模块菜单渲染
     * @param {*} [menuList=[]] 菜单数据
     * @param {boolean} [menuChildOpen=false] 是否默认展开左侧菜单
     */
    renderMultiModule(menuList = [], menuChildOpen = false) {
      let headerMenusHtml = '',
        headerMobileMenusHtml = '',
        leftMenusHtml = '',
        childOpenClass = menuChildOpen ? 'layui-nav-itemed' : ''

      // 遍历顶部菜单列表
      headerMenusHtml = this.each(menuList, (index, val) => {
        let menu = 'header_menu_' + index,
          id = menu + '_id',
          // 编译pc端单个顶部菜单
          headerMenuItemHtml = this.compileMenu({
            menu,
            title: val.title,
            childOpenClass,
            activeClass: index === 0 ? 'layui-this' : '', // 默认选中顶部菜单第一项
          })
        // 编译移动端顶部菜单
        headerMobileMenusHtml += this.compileMenu(
          {
            menu,
            icon: val.icon,
            title: val.title,
            activeClass: index === 0 ? 'layui-this' : '', // 默认选中顶部菜单第一项
          },
          true,
        )
        // 左侧菜单
        if (val.child && val.child.length) {
          leftMenusHtml += this.renderLeftMenu(val.child, {
            parentMenuId: menu, // 关联顶部菜单
            childOpenClass, // 是否默认展开左侧菜单
            leftMenuActiveClass: index === 0 ? 'layui-this' : 'layui-hide', // 当前显示的左侧菜单
          })
        }
        return headerMenuItemHtml
      }).join('')
      $('body').addClass('layui-multi-module') // 多模块标识
      $('[lay-filter=header-menu-pc]').html(headerMenusHtml) // pc端
      $('[lay-filter=header-menu-mobile]').html(headerMobileMenusHtml) // 移动端
      $('[lay-filter=side-menu]').html(leftMenusHtml) // 左侧菜单
      element.init()
    },

    /**
     * @description 列表项编译
     * @param {object} menu
     * @param {boolean} [isSub=false] 是否为子菜单
     * @returns {string}
     */
    compileMenu(menu, isSub = false) {
      let menuHtml = isSub
        ? `<dd {{d.menu?'data-id="'+d.menu+'"':''}} {{d.id?'id="'+d.id+'"':''}} class="{{d.activeClass||''}} {{d.childOpenClass||''}}"><a href="javascript:;" {{d.href?'lay-href="'+d.href+'"':''}} {{d.target?'target="'+d.target+'"':''}}>{{d.icon?'<i class="'+d.icon+'"></i>':''}}<span>{{d.title||''}}</span></a>{{d.children||''}}</dd>`
        : `<li {{d.menu?'data-id="'+d.menu+'"':''}} class="layui-nav-item {{d.activeClass||''}} {{d.childOpenClass||''}}" {{d.id?'id="'+d.id+'"':''}}><a href="javascript:;" {{d.href?'lay-href="'+d.href+'"':''}} {{d.target?'target="'+d.target+'"':''}}>{{d.icon?'<i class="'+d.icon+'"></i>':''}}<span>{{d.title||''}}</span></a>{{d.children||''}}</li>`
      return laytpl(menuHtml).render(menu)
    },

    /**
     * @description 组装成列表并编译
     * @param {object} menu
     * @param {boolean} [isSub=false] 是否为子菜单
     * @returns {string}
     */
    compileMenuContainer(menu, isSub = false) {
      let wrapperHtml = isSub
        ? `<dl class="layui-nav-child">{{d.children||''}}</dl>`
        : `<ul class="layui-nav layui-nav-tree {{d.activeClass||''}}" {{d.id?'id="'+d.id+'"':''}}>{{d.children||''}}</ul>`
      if (!menu.children) return ''
      return laytpl(wrapperHtml).render(menu)
    },

    /**
     * @description 遍历数据
     * @param {array} list
     * @param {function} callback
     * @returns {array}
     */
    each(list, callback) {
      let _list = []
      for (let i = 0; i < list.length; i++) {
        _list[i] = callback(i, list[i])
      }
      return _list
    },

    /**
     * @description 渲染子菜单
     * @param {array} [menuList=[]] 菜单数据
     * @param {object} [options={}]
     * @returns {string}
     */
    renderChildrenMenu(menuList = [], options = {}) {
      // 遍历子菜单
      let subMenushtml = this.each(menuList, (index, val) => {
        // 递归遍历子菜单
        if (val.child && val.child.length) {
          val.children = this.renderChildrenMenu(val.child, {
            childOpenClass: options.childOpenClass || '',
          })
        }
        val.childOpenClass = options.childOpenClass || ''
        // 编译单个子菜单
        return this.compileMenu(val, true)
      }).join('')
      // 将编译好的子菜单项组装成列表
      return this.compileMenuContainer({ children: subMenushtml }, true)
    },

    /**
     * @description 渲染左侧菜单
     * @param {array} [leftMenus=[]] 菜单数据
     * @param {object} [options={}]
     * @returns {string}
     */
    renderLeftMenu(leftMenus = [], options = {}) {
      // 遍历左侧一级菜单
      let leftMenusHtml = this.each(leftMenus, (index, val) => {
        let children
        // 如果左侧一级菜单中存在子菜单则渲染
        if (val.child && val.child.length) {
          children = this.renderChildrenMenu(val.child, {
            childOpenClass: options.childOpenClass,
          })
        }
        // 编译单个左侧一级菜单
        let leftMenuItemHtml = this.compileMenu({
          href: val.href,
          target: val.target,
          childOpenClass: options.childOpenClass,
          icon: val.icon,
          title: val.title,
          children,
        })
        return leftMenuItemHtml
      }).join('')
      // 将编译好的一级菜单组装成列表
      return this.compileMenuContainer({
        id: options.parentMenuId, // 关联顶部菜单
        activeClass: options.leftMenuActiveClass,
        children: leftMenusHtml,
      })
    },

    /**
     * @description 监听菜单事件
     */
    listen() {
      // PC端菜单模块切换
      $('body').on('click', '[data-id]', function () {
        let menuId = $(this).attr('data-id')
        // pc端头部导航
        $('[lay-filter=header-menu-pc] .layui-this').removeClass('layui-this')
        // 移动端头部导航
        $('[lay-filter=header-menu-mobile] .layui-this').removeClass(
          'layui-this',
        )
        // 给当前点击项添加layui-this类
        $(`[data-id=${menuId}]`).addClass('layui-this')

        // 左侧菜单
        $('.layui-side .layui-this')
          .addClass('layui-hide')
          .removeClass('layui-this')
        $(`#${menuId}`).removeClass('layui-hide').addClass('layui-this')
        layer.close(window.popupMenu)
      })

      // 移动端点击菜单模块弹出左侧菜单
      $('body').on('click', '[lay-filter=header-menu-mobile] dd', function () {
        let event = $('.layui-shrink [lay-event]').attr('lay-event')
        if (event === 'unfold') {
          $('.layui-side-mobile').trigger('click')
        }
      })

      // PC端左侧菜单折叠
      $('body').on('click', '.layui-shrink [lay-event]', function () {
        let event = $(this).attr('lay-event')
        if (event === 'unfold') {
          // 折叠
          $(this).attr('lay-event', 'fold')
          $(this).html('<i class="layui-icon layui-icon-spread-left"></i>')
          $('body').removeClass('layui-default').addClass('layui-mini')
        } else {
          // 展开
          $(this).attr('lay-event', 'unfold')
          $(this).html('<i class="layui-icon layui-icon-shrink-right"></i>')
          $('body').removeClass('layui-mini').addClass('layui-default')
          layer.close(window.popupMenu)
        }
      })

      // 移动端左侧菜单折叠
      $('body').on('click', '.layui-side-mobile', function () {
        let el = $('.layui-shrink [lay-event]'),
          event = el.attr('lay-event')
        if (event === 'unfold') {
          // 展开
          el.attr('lay-event', 'fold')
          $('.layui-shrink i').attr(
            'class',
            'layui-icon layui-icon-spread-left',
          )
          $('body').removeClass('layui-default').addClass('layui-mini')
        }
      })
    },
  }
  exports('moyuMenu', moyuMenu)
})
