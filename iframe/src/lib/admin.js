/**

 @Name：layuiAdmin 核心模块
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define('view', (exports) => {
  let $ = layui.$,
    laytpl = layui.laytpl,
    element = layui.element,
    setter = layui.setter,
    view = layui.view,
    device = layui.device(),
    $win = $(window),
    $body = $('body'),
    container = $(`#${setter.container}`), // 应用容器
    SHOW = 'layui-show', // 元素显示类
    HIDE = 'layui-hide', // 元素隐藏类
    THIS = 'layui-this', // 当前元素类
    DISABLED = 'layui-disabled', // 禁用元素类
    TEMP = 'template',
    APP_TABS = '#LAY_app_tabs', // 页面标签容器ID
    APP_BODY = '#LAY_app_body', // 主体内容容器ID
    TABS_HEADER = '#LAY_app_tabsHeader', // tab标签列表ID
    TABS_BODY_ITEM = 'LAY-tabsBody-item', // iframe标签或内容页的容器类
    FILTER_TAB_TABS = 'LAY-filter-layout-tabs', // tab标签容器过滤器
    FILTER_TAB_OPERATE = 'LAY-filter-tabs-operate', // tab标签更多操作的过滤器
    APP_FLEXIBLE = '#LAY_app_flexible', // 侧边收缩按钮
    ICON_SHRINK = 'layui-icon-shrink-right', // 侧边菜单处于展开时的按钮图标
    ICON_SPERAD = 'layui-icon-spread-left', // 侧边菜单处于收缩时的按钮图标
    SIDE_SHRINK = 'LAY-side-shrink', // PC端标记
    APP_SPREAD_SM = 'LAY-side-spread-sm', // 移动端标记
    SIDE_MENU = '#LAY_app_side_menu', // 侧边菜单容器ID
    FILTER_SIDE_MENU = 'LAY-filter-side-menu', // 侧边菜单容器过滤器
    // 同步路由
    setThisRouter = (othis) => {
      let layid = othis.attr('lay-id'),
        attr = othis.attr('lay-attr'),
        index = othis.index()

      admin.tabsBodyChange(index, { url: attr })
    },
    resizeSystem = (layui.data.resizeSystem = () => {
      layer.closeAll('tips')
      if (!resizeSystem.lock) {
        setTimeout(() => {
          admin.sideFlexible(admin.screen() < 2 ? '' : 'spread')
          delete resizeSystem.lock
        }, 100)
      }
      resizeSystem.lock = true
    }),
    // 通用方法
    admin = {
      v: '1.0.0 std',
      // 数据异步请求
      req: view.req,
      // 清除本地 token，并跳转到登入页
      exit: view.exit,
      // 弹出面板
      popup: view.popup,
      // 记录最近一次点击的页面标签数据
      tabsPage: {},

      /**
       * @description 发送验证码
       * @param {object} options
       */
      sendAuthCode(options) {
        options = $.extend(
          {
            seconds: 60,
            elemPhone: '#LAY_phone',
            elemSMScode: '#LAY_smscode',
          },
          options,
        )

        let seconds = options.seconds,
          btn = $(options.elem),
          token = null,
          timer,
          countDown = (loop) => {
            seconds--
            if (seconds < 0) {
              btn.removeClass(DISABLED).html('获取验证码')
              seconds = options.seconds
              clearInterval(timer)
            } else {
              btn.addClass(DISABLED).html(seconds + '秒后重新获取')
            }

            if (!loop) {
              timer = setInterval(() => {
                countDown(true)
              }, 1000)
            }
          }

        // 监听按钮点击事件
        btn.on('click', function () {
          options.elemPhone = $(options.elemPhone)
          options.elemSMScode = $(options.elemSMScode)
          let success,
            value = options.elemPhone.val()

          // 如果还在倒计时则终止执行
          if (seconds !== options.seconds || $(this).hasClass(DISABLED)) return
          if (!/^1\d{10}$/.test(value)) {
            options.elemPhone.focus()
            return layer.msg('请输入正确的手机号')
          }
          if (typeof options.ajax === 'object') {
            success = options.ajax.success
            delete options.ajax.success
          }

          admin.req(
            $.extend(
              true,
              {
                url: '/auth/code',
                type: 'get',
                data: { phone: value },
                success(res) {
                  layer.msg('验证码已发送至你的手机，请注意查收', {
                    icon: 1,
                    shade: 0,
                  })
                  options.elemSMScode.focus()
                  countDown()
                  success && success(res)
                },
              },
              options.ajax,
            ),
          )
        })
      },

      /**
       * @description 侧边伸缩
       * @param {string} status 侧边菜单状态
       */
      sideFlexible(status) {
        let app = container,
          iconElem = $(APP_FLEXIBLE),
          screen = this.screen()

        // 设置状态，PC：默认展开、移动端：默认收缩
        if (status === 'spread') {
          // 切换到展开状态的 icon，箭头：←
          iconElem.removeClass(ICON_SPERAD).addClass(ICON_SHRINK)

          // 移动端：从左到右位移；PC：清除多余选择器恢复默认
          if (screen < 2) {
            app.addClass(APP_SPREAD_SM)
          } else {
            app.removeClass(APP_SPREAD_SM)
          }
          app.removeClass(SIDE_SHRINK)
        } else {
          // 切换到收缩状态的 icon，箭头：→
          iconElem.removeClass(ICON_SHRINK).addClass(ICON_SPERAD)

          // 移动端：清除多余选择器恢复默认；PC：从右往左收缩
          if (screen < 2) {
            app.removeClass(SIDE_SHRINK)
          } else {
            app.addClass(SIDE_SHRINK)
          }
          app.removeClass(APP_SPREAD_SM)
        }
        // 执行自定义事件 side ,事件在console模块中注册
        layui.event.call(this, setter.MOD_NAME, 'side({*})', { status })
      },

      /**
       * @description 判断屏幕大小
       * @returns {number}
       */
      screen() {
        let width = $win.width()
        if (width >= 1200) {
          return 3 // 大屏幕
        } else if (width >= 992) {
          return 2 // 中屏幕
        } else if (width >= 768) {
          return 1 // 小屏幕
        } else {
          return 0 // 超小屏幕
        }
      },

      /**
       * @description xss 转义
       * @param {string} [html='']
       * @returns {string}
       */
      escape(html = '') {
        return String(html)
          .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&#39;')
          .replace(/"/g, '&quot;')
      },

      /**
       * @description 注册监听事件
       * @param {string} events 事件名
       * @param {function} callback
       * @returns
       */
      on(events, callback) {
        /**
         * layui.onevent(modName, events, callback) 注册自定义模块事件
         * modName 事件所属模块
         * events 事件名
         * callback 事件的方法体
         */
        return layui.onevent.call(this, setter.MOD_NAME, events, callback)
      },

      /**
       * @description 右侧面板
       * @param {object} options
       * @returns
       */
      popupRight(options) {
        return (this.popup.index = layer.open(
          $.extend(
            {
              type: 1,
              id: 'LAY_adminPopupR',
              anim: -1,
              title: false,
              closeBtn: false,
              offset: 'r',
              shade: 0.1,
              shadeClose: true,
              skin: 'layui-anim layui-anim-rl layui-layer-admin-right',
              area: '300px',
            },
            options,
          ),
        ))
      },

      /**
       * @description 主题设置
       * @param {object} options
       */
      theme(options) {
        let theme = setter.theme,
          local = layui.data(setter.tableName),
          id = 'LAY_admin_theme',
          style = document.createElement('style'),
          styleText = laytpl(
            [
              // 主题色
              '.layui-side-menu,',
              '.layui-layer-admin .layui-layer-title,',
              '.layadmin-pageTabs .layui-tab-title li:after,',
              '.layadmin-pageTabs .layui-tab-title li.layui-this:after,',
              '.LAY-side-shrink .layui-side-menu .layui-nav > .layui-nav-item > .layui-nav-child { ',
              'background-color: {{ d.color.main }} !important; }',
              // 选中色
              '.layui-nav-tree .layui-this,',
              '.layui-nav-tree .layui-this > a,',
              '.layui-nav-tree .layui-nav-child dd.layui-this,',
              '.layui-nav-tree .layui-nav-child dd.layui-this a { ',
              'background-color: {{ d.color.selected }} !important; }',
              // logo
              '.layui-layout-admin .layui-logo',
              '{ background-color: {{ d.color.logo || d.color.main }} !important; }',
              // 头部色
              '{{# if(d.color.header){ }}',
              '.layui-layout-admin .layui-header { background-color: {{ d.color.header }}; }',
              '.layui-layout-admin .layui-header a, .layui-layout-admin .layui-header a cite { color: #f8f8f8; }',
              '.layui-layout-admin .layui-header a:hover { color: #fff; }',
              '.layui-layout-admin .layui-header .layui-nav .layui-nav-more { border-top-color: #fbfbfb; }',
              '.layui-layout-admin .layui-header .layui-nav .layui-nav-mored { border-color: transparent; border-bottom-color: #fbfbfb; }',
              '.layui-layout-admin .layui-header .layui-nav .layui-this:after,',
              '.layui-layout-admin .layui-header .layui-nav-bar { background-color: rgba(255, 255, 255, 0.5); }',
              '.layadmin-pageTabs .layui-tab-title li:after { display: none; }',
              '{{# } }}',
            ].join(''),
          ).render($.extend({}, local.theme, options)),
          styleElem = document.getElementById(id)

        // 添加主题样式
        if ('styleSheet' in style) {
          style.setAttribute('type', 'text/css')
          style.styleSheet.cssText = styleText
        } else {
          style.innerHTML = styleText
        }
        style.id = id
        styleElem && $body[0].removeChild(styleElem)
        $body[0].appendChild(style)
        $body.attr('layadmin-theme-alias', options.color.alias)

        // 本地存储记录
        local.theme = local.theme || {}
        layui.each(options, (key, value) => {
          local.theme[key] = value
        })
        layui.data(setter.tableName, {
          key: 'theme',
          value: local.theme,
        })
      },

      /**
       * @description 初始化主题
       * @param {number} [index=0]
       */
      initTheme(index = 0) {
        let theme = setter.theme
        if (theme.color[index]) {
          theme.color[index].index = index
          this.theme({ color: theme.color[index] })
        }
      },

      /**
       * @description 获取标签页的头元素
       * @param {number} [index=0] tab页索引
       * @returns jQuery对象
       */
      tabsHeader(index = 0) {
        return $(`${TABS_HEADER}>li`).eq(index)
      },

      /**
       * @description 获取页面标签主体元素
       * @param {number} [index=0] tab页索引
       * @returns {object} jQuery对象
       */
      tabsBody(index = 0) {
        return $(APP_BODY).find(`.${TABS_BODY_ITEM}`).eq(index)
      },

      /**
       * @description 切换页面标签主体
       * @param {number} index tab页索引
       * @param {object} [options={}]
       */
      tabsBodyChange(index, options = {}) {
        // jQuery.siblings 取得一个包含匹配的元素集合中每一个元素的所有唯一同辈元素的元素集合
        this.tabsBody(index).addClass(SHOW).siblings().removeClass(SHOW)
        events.rollPage('auto', index)
        /**
         * layui.event(modName, events, params) 执行自定义模块事件，搭配onevent使用
         * modName 事件所属模块
         * events 事件名
         * params 传递给事件方法体的参数
         */
        //执行 {setter.MOD_NAME}.tabsPage 下的事件
        layui.event.call(this, setter.MOD_NAME, 'tabsPage({*})', {
          url: options.url,
          text: options.text,
        })
      },

      // resize事件管理
      resizeFn: {},
      resize(fn) {
        let router = layui.router(),
          key = router.path.join('-')

        if (this.resizeFn[key]) {
          $win.off('resize', this.resizeFn[key])
          delete this.resizeFn[key]
        }
        if (fn === 'off') return // 如果是清除 resize 事件，则终止往下执行
        fn()
        this.resizeFn[key] = fn
        $win.on('resize', this.resizeFn[key])
      },
      runResize() {
        let router = layui.router(),
          key = router.path.join('-')
        this.resizeFn[key] && this.resizeFn[key]()
      },
      delResize() {
        this.resize('off')
      },

      /**
       * @description 关闭当前 pageTabs
       */
      closeThisTabs() {
        if (!this.tabsPage.index) return
        $(`${TABS_HEADER}>li`)
          .eq(this.tabsPage.index)
          .find(`.layui-tab-close`)
          .trigger('click')
      },

      /**
       * @description 全屏
       */
      fullScreen() {
        let elem = document.documentElement,
          reqFullScreen =
            elem.requestFullscreen ||
            elem.webkitRequestFullScreen ||
            elem.mozRequestFullScreen ||
            elem.msRequestFullScreen

        typeof reqFullScreen !== 'undefined' &&
          reqFullScreen &&
          reqFullScreen.call(elem)
      },

      /**
       * @description 退出全屏
       */
      exitScreen() {
        document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitCancelFullScreen
          ? document.webkitCancelFullScreen()
          : document.msExitFullscreen && document.msExitFullscreen()
      },
    },
    events = (admin.events = {
      /**
       * @description 侧边伸缩
       * @param {object} othis jQuery对象
       */
      flexible(othis) {
        let iconElem = othis.find(APP_FLEXIBLE),
          isSpread = iconElem.hasClass(ICON_SPERAD)
        admin.sideFlexible(isSpread ? 'spread' : null)
      },

      /**
       * @description 刷新
       */
      refresh() {
        let iframeElem = '.layadmin-iframe',
          length = $(`.${TABS_BODY_ITEM}`).length
        if (admin.tabsPage.index >= length) {
          admin.tabsPage.index = length - 1
        }
        let iframe = admin.tabsBody(admin.tabsPage.index).find(iframeElem)
        iframe[0].contentWindow.location.reload(true)
      },

      /**
       * @description 输入框搜索
       * @param {object} othis jQuery对象
       */
      search(othis) {
        othis.off('keypress').on('keypress', function (e) {
          if (!this.value.replace(/\s/g, '')) return
          // 回车跳转
          if (e.keyCode === 13) {
            let href = othis.attr('lay-action'),
              text = othis.attr('lay-text') || '搜索'
            href += this.value
            text = `${text} <span class="layui-text-red">${admin.escape(
              this.value,
            )}</span>`
            // 打开标签页
            layui.index.openTabsPage(href, text)
            // 如果搜索关键词已经打开，则刷新页面即可
            events.search.keys || (events.search.keys = {})
            events.search.keys[admin.tabsPage.index] = this.value
            if (this.value === events.search.keys[admin.tabsPage.index]) {
              events.refresh(othis)
            }
            // 清空输入框
            this.value = ''
          }
        })
      },

      /**
       * @description 退出
       */
      logout() {
        admin.req({
          url: setter.base + 'json/user/logout.json',
          type: 'get',
          data: {},
          //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
          done(res) {
            //清空本地记录的 token，并跳转到登入页
            admin.exit(() => {
              location.href = 'useradmin/login.html'
            })
          },
        })
      },

      /**
       * @description 点击消息
       * @param {object} othis jQuery对象
       */
      message(othis) {
        othis.find('.layui-badge-dot').remove()
      },

      /**
       * @description 弹出主题面板
       */
      theme() {
        admin.popupRight({
          id: 'LAY_adminPopupTheme',
          success() {
            view(this.id).render('system/theme')
          },
        })
      },

      /**
       * @description 主题设置
       * @param {object} othis jQuery对象
       */
      setTheme(othis) {
        let index = othis.data('index'),
          prevIndex = othis.siblings('layui-this').data('index')

        if (othis.hasClass(THIS)) return
        // 移除兄弟元素的layui-this
        othis.addClass(THIS).siblings('layui-this').removeClass(THIS)
        admin.initTheme(index)
      },

      /**
       * @description 便签
       * @param {object} othis jQuery对象
       */
      note(othis) {
        let isMobile = admin.screen() < 2,
          note = layui.data(setter.tableName).note
        events.note.index = admin.popup({
          title: '便签',
          shade: 0,
          offset: ['41px', isMobile ? null : `${othis.offset().left - 250}px`],
          anim: -1,
          id: 'LAY_adminNote',
          skin: 'layui-anim layui-anim-upbit layadmin-note',
          content: '<textarea placeholder="内容"></textarea>',
          resize: false,
          success(layero, index) {
            let textarea = layero.find('textarea'),
              value =
                note === undefined
                  ? '便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录'
                  : note
            textarea
              .val(value)
              .focus()
              .on('keyup', function () {
                layui.data(setter.tableName, {
                  key: 'note',
                  value: this.value, // this指向textarea对象
                })
              })
          },
        })
      },

      /**
       * @description 全屏
       * @param {object} othis jQuery对象
       */
      fullscreen(othis) {
        let SCREEN_FULL = 'layui-icon-screen-full',
          SCREEN_REST = 'layui-icon-screen-restore',
          iconElem = othis.children('i')
        if (iconElem.hasClass(SCREEN_FULL)) {
          admin.fullScreen()
          iconElem.addClass(SCREEN_REST).removeClass(SCREEN_FULL)
        } else {
          admin.exitScreen()
          iconElem.addClass(SCREEN_FULL).removeClass(SCREEN_REST)
        }
      },

      /**
       * @description 弹出关于面板
       */
      about() {
        admin.popupRight({
          id: 'LAY_adminPopupAbout',
          success() {
            view(this.id).render('system/about')
          },
        })
      },

      /**
       * @description 弹出更多面板
       */
      more() {
        admin.popupRight({
          id: 'LAY_adminPopupMore',
          success() {
            view(this.id).render('system/more')
          },
        })
      },

      /**
       * @description 返回上一页
       */
      back() {
        history.back()
      },

      /**
       * @description 左右滚动页面标签
       * @param {string} type
       * @param {number} index
       */
      rollPage(type, index) {
        let tabsHeader = $(TABS_HEADER),
          liItem = tabsHeader.children('li'),
          scrollWidth = tabsHeader.prop('scrollWidth'),
          outerWidth = tabsHeader.outerWidth(),
          tabsLeft = parseFloat(tabsHeader.css('left'))

        // 从左往右
        if (type === 'left') {
          if (!tabsLeft && tabsLeft <= 0) return

          // 当前的left减去可视宽度，用于与上一轮的页标比较
          let prefLeft = -tabsLeft - outerWidth
          liItem.each((i, item) => {
            let li = $(item),
              left = li.position().left
            if (left >= prefLeft) {
              tabsHeader.css('left', -left)
              return false
            }
          })
        }
        // 自动滚动
        else if (type === 'auto') {
          ;(function () {
            let thisLi = liItem.eq(index),
              thisLeft
            if (!thisLi[0]) return
            thisLeft = thisLi.position().left

            // 当目标标签在可视区域左侧时
            if (thisLeft < -tabsLeft) return tabsHeader.css('left', -thisLeft)

            // 当目标标签在可视区域右侧时
            if (thisLeft + thisLi.outerWidth() >= outerWidth - tabsLeft) {
              let subLeft =
                thisLeft + thisLi.outerWidth() - (outerWidth - tabsLeft)
              liItem.each((i, item) => {
                let li = $(item),
                  left = li.position().left

                // 从当前可视区域的最左第二个节点遍历，如果减去最左节点的差 > 目标在右侧不可见的宽度，则将该节点放置可视区域最左
                if (left + tabsLeft > 0) {
                  if (left - tabsLeft > subLeft) {
                    tabsHeader.css('left', -left)
                    return false
                  }
                }
              })
            }
          })()
        } else {
          // 默认向左滚动
          liItem.each((i, item) => {
            let li = $(item),
              left = li.position().left
            if (left + li.outerWidth() >= outerWidth - tabsLeft) {
              tabsHeader.css('left', -left)
              return false
            }
          })
        }
      },

      /**
       * @description 向右滚动页面标签
       */
      leftPage() {
        events.rollPage('left')
      },

      /**
       * @description 向左滚动页面标签
       */
      rightPage() {
        events.rollPage()
      },

      /**
       * @description 关闭当前标签页
       */
      closeThisTabs() {
        admin.closeThisTabs()
      },

      /**
       * @description 关闭其它标签页
       * @param {string} type
       */
      closeOtherTabs(type) {
        let TABS_REMOVE = 'LAY-tabsPage-remove'
        if (type === 'all') {
          // jQuery :gt(index) 匹配所有大于给定索引值的元素
          $(`${TABS_HEADER}>li:gt(0)`).remove()
          $(APP_BODY).find(`.${TABS_BODY_ITEM}:gt(0)`).remove()
          $(`${TABS_HEADER}>li`).eq(0).trigger('click')
        } else {
          $(`${TABS_HEADER}>li`).each((index, item) => {
            // 主页默认index是0,所以下面的逻辑判断自然会不通过,也就不会被标记
            if (index && index !== admin.tabsPage.index) {
              $(item).addClass(TABS_REMOVE)
              admin.tabsBody(index).addClass(TABS_REMOVE)
            }
          })
          $(`.${TABS_REMOVE}`).remove()
        }
      },

      /**
       * @description 关闭全部标签页
       */
      closeAllTabs() {
        events.closeOtherTabs('all')
      },

      /**
       * @description 遮罩
       */
      shade() {
        admin.sideFlexible()
      },
    })

  // 注册tabsPage(setMenuStatus)事件, 用于监听选项卡切换，改变菜单状态
  admin.on(`tabsPage(setMenuStatus)`, (router) => {
    let pathURL = router.url,
      getData = (item) => {
        return {
          list: item.children('.layui-nav-child'),
          a: item.children(`*[lay-href]`),
        }
      },
      sideMenu = $(SIDE_MENU),
      SIDE_NAV_ITEMD = 'layui-nav-itemed',
      // 捕获对应菜单
      matchMenu = (list) => {
        list.each((index1, item1) => {
          let data1 = getData($(item1)),
            listChildren1 = data1.list.children('dd'),
            matched1 = pathURL === data1.a.attr('lay-href')

          listChildren1.each((index2, item2) => {
            let data2 = getData($(item2)),
              listChildren2 = data2.list.children('dd'),
              matched2 = pathURL === data2.a.attr('lay-href')

            listChildren2.each((index3, item3) => {
              let data3 = getData($(item3)),
                matched3 = pathURL === data3.a.attr('lay-href')

              if (matched3) {
                let selected = data3.list[0] ? SIDE_NAV_ITEMD : THIS
                $(item3).addClass(selected).siblings().removeClass(selected)
                return false
              }
            })

            if (matched2) {
              let selected = data2.list[0] ? SIDE_NAV_ITEMD : THIS
              $(item2).addClass(selected).siblings().removeClass(selected)
              return false
            }
          })

          if (matched1) {
            let selected = data1.list[0] ? SIDE_NAV_ITEMD : THIS
            $(item1).addClass(selected).siblings().removeClass(selected)
            return false
          }
        })
      }
    // 移动端点击菜单时自动收缩
    admin.screen() < 2 && admin.sideFlexible()
    // 重置状态
    sideMenu.find(`.${THIS}`).removeClass(THIS)
    // 开始捕获
    matchMenu(sideMenu.children('li'))
  })

  // 监听侧边导航点击事件
  element.on(`nav(${FILTER_SIDE_MENU})`, (el) => {
    // PC端时才会进入if内部
    if (el.siblings('.layui-nav-child')[0] && container.hasClass(SIDE_SHRINK)) {
      admin.sideFlexible('spread')
      layer.close(el.data('index'))
    }
    admin.tabsPage.type = 'nav'
  })

  // 监听选项卡的更多操作
  element.on(`nav(${FILTER_TAB_OPERATE})`, (el) => {
    let dd = el.parent()
    dd.removeClass(THIS)
    dd.parent().removeClass(SHOW)
  })

  // 监听 tabspage 删除
  element.on(`tabDelete(${FILTER_TAB_TABS})`, (el) => {
    let tab = $(`${TABS_HEADER}>li.layui-this`)
    el.index && admin.tabsBody(el.index).remove()
    setThisRouter(tab)

    // 移除resize事件
    admin.delResize()
  })

  // 监听 tab 组件切换，同步 index
  element.on(`tab(${FILTER_TAB_TABS})`, (el) => {
    admin.tabsPage.index = el.index
  })

  // 点击标签页标题
  $body.on('click', `${TABS_HEADER}>li`, function () {
    let index = $(this).index()
    // 更新tab页数据
    admin.tabsPage.type = 'tab'
    admin.tabsPage.index = index
    // 更新路由
    setThisRouter($(this))
  })

  // 页面跳转
  $body.on('click', '*[lay-href]', function () {
    let href = $(this).attr('lay-href'),
      text = $(this).attr('lay-text') || $(this).text(),
      router = layui.router()
    admin.tabsPage.elem = $(this)
    // 执行跳转
    let topLayui = parent === self ? layui : top.layui
    topLayui.index.openTabsPage(href, text)
  })

  // 点击事件
  $body.on('click', '*[layadmin-event]', function () {
    let attrEvent = $(this).attr('layadmin-event')
    events[attrEvent] && events[attrEvent].call(this, $(this))
  })

  // hover提示
  $body
    .on('mouseenter', '*[lay-tips]', function () {
      // 不是PC端时,终止执行
      if (
        $(this).parent().hasClass('layui-nav-item') &&
        !container.hasClass(SIDE_SHRINK)
      )
        return
      let tips = $(this).attr('lay-tips'),
        offset = $(this).attr('lay-offset'),
        direction = $(this).attr('lay-direction'),
        index = layer.tips(tips, this, {
          tips: direction || 1,
          time: -1,
          success(layero, index) {
            if (offset) {
              layero.css('margin-left', offset + 'px')
            }
          },
        })
      $(this).data('index', index)
    })
    .on('mouseleave', '*[lay-tips]', function () {
      layer.close($(this).data('index'))
    })

  // 窗口resize事件
  $win.on('resize', layui.data.resizeSystem)

  // 后台初始化
  !(function () {
    let local = layui.data(setter.tableName)
    // 主题初始化，本地主题记录优先，其次为 initColorIndex
    if (local.theme) {
      admin.theme(local.theme)
    } else if (setter.theme) {
      admin.initTheme(setter.theme.initColorIndex)
    }

    // 常规版默认开启多标签页
    if (!('pageTabs' in setter)) layui.setter.pageTabs = true

    // 不开启页面标签时
    if (!setter.pageTabs) {
      $(APP_TABS).addClass(HIDE)
      container.addClass('LAY-pageTabs-false')
    }

    // 低版本IE提示
    if (device.ie && device.ie < 10) {
      view.error(
        `IE${device.ie}下访问可能不佳，推荐使用：Chrome / Firefox / Edge 等高级浏览器`,
        { offset: 'auto', id: 'LAY_errorIE' },
      )
    }
  })()

  // 输出接口
  exports('admin', admin)
})
