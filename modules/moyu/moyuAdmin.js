layui.define(['element', 'moyuMenu'], (exports) => {
  let $ = layui.$,
    layer = layui.layer,
    element = layui.element,
    moyuMenu = layui.moyuMenu

  let moyuAdmin = {
    /**
     * @description 渲染页面
     * @param {object} options
     */
    render(options) {
      options.initUrl = options.initUrl || null
      options.clearUrl = options.clearUrl || null
      options.urlHashLocation = options.urlHashLocation || false
      options.multiModule = options.multiModule || false
      options.menuChildOpen = options.menuChildOpen || false
      options.loadingTime = options.loadingTime || 1
      options.pageAnim = options.pageAnim || false
      options.maxTabNum = options.maxTabNum || 10
      $.getJSON(options.initUrl, (data) => {
        if (data === null) {
          this.error('暂无数据')
        } else {
          this.renderLogo(data.logoInfo)
          this.renderClear(options.clearUrl)
          this.renderHome(data.homeInfo)
          this.listen()
          moyuMenu.render({
            menuList: data.menuInfo,
            multiModule: options.multiModule,
            menuChildOpen: options.menuChildOpen,
          })
        }
      }).fail(() => {
        this.error('菜单接口异常')
      })
    },

    /**
     * @description 渲染logo
     * @param {string} data
     */
    renderLogo(data) {
      $('.layui-moyu-logo').html(
        `<a href=${data.href}><img src=${data.image} alt="logo"><h1>${data.title}</h1>`,
      )
    },

    /**
     * @description 初始化首页
     * @param {object} data
     */
    renderHome(data) {
      sessionStorage.setItem('layui-moyu-homeHref', data.href)
      // 添加tab项
      $('#layui-moyu-homeTab')
        .attr('lay-id', data.href)
        .html(
          `<i class="layui-tab-active"></i><i class="layui-icon layui-icon-home"></i><i class="layui-icon layui-unselect layui-tab-close">ဆ</i>`,
        )
      // 添加iframe
      $('#layui-moyu-homeTabIframe')
        .addClass('layui-show')
        .html(
          `<iframe width="100%" height="100%" frameborder="0" border="0" marginwidth="0" marginheight="0" src=${data.href}></iframe>`,
        )
    },

    /**
     * @description 初始化缓存地址
     * @param {string} url
     */
    renderClear(url) {
      $('[data-clear]').attr('data-href', url)
    },

    /**
     * @description 成功消息
     * @param {string} msg
     * @returns
     */
    success(msg) {
      return layer.msg(msg, { icon: 1, time: 2000 })
    },

    /**
     * @description 失败消息
     * @param {string} msg
     * @returns
     */
    error(msg) {
      return layer.msg(msg, { icon: 2, time: 2000 })
    },

    /**
     * @description 初始化设备端
     */
    renderDevice() {
      if (this.isMobile()) {
        $('.layui-shrink [moyu-event]').attr('moyu-event', 'unfold')
        $('.layui-shrink i').attr('class', 'layui-icon layui-icon-shrink-right')
        $('body').removeClass('layui-mini').addClass('layui-default')
      }
    },

    /**
     * @description 判断是否为移动端设备
     * @returns {boolean}
     */
    isMobile() {
      let userAgent = navigator.userAgent.toLocaleLowerCase(),
        platform = navigator.platform.toLocaleLowerCase(),
        isAndroid =
          /android/i.test(userAgent) ||
          (/iPhone|iPad|iPod/i.test(userAgent) && /linux/i.test(platform)) ||
          /ucweb.*linux/i.test(userAgent),
        isIOS = /iPhone|iPad|iPod/i.test(userAgent) && !isAndroid,
        isWinPhone = /Windows Phone|ZuneWP7/i.test(userAgent),
        clientWidth = document.documentElement.clientWidth
      if (!isAndroid && !isIOS && !isWinPhone && clientWidth > 1024) {
        return false
      } else {
        return true
      }
    },

    /**
     * @description 监听点击事件
     */
    listen() {
      // 点击遮罩层
      $('body').on('click', '.layui-mobile-shade', () => {
        this.renderDevice()
      })

      // 清理缓存
      $('body').on('click', '[data-clear]', function () {
        let clearUrl = $(this).attr('data-href')
        if (clearUrl !== undefined && clearUrl !== '' && clearUrl !== null) {
          $.getJSON(clearUrl, (data, status) => {
            if (data.code !== 0) {
              return moyuAdmin.error(data.msg)
            } else {
              return moyuAdmin.success(data.msg)
            }
          }).fail(() => {
            return moyuAdmin.error('接口异常')
          })
        } else {
          return moyuAdmin.success('缓存清理成功')
        }
      })

      // 刷新
      $('body').on('click', '[data-refresh]', () => {
        $('.layui-tab-content-item.layui-show')
          .find('iframe')[0]
          .contentWindow.location.reload()
        this.success('刷新成功')
      })

      // 左侧菜单折叠时,鼠标滑过菜单项则弹出子级菜单
      $('body').on(
        'mouseenter',
        '.layui-side-menu .layui-this li',
        function () {
          if (moyuAdmin.isMobile()) return false
          let classInfo = $(this).attr('class'),
            tips = $(this).html(),
            attrEvent = $('.layui-shrink [moyu-event]').attr('moyu-event')
          if (attrEvent === 'fold' && tips) {
            tips = `<ul class="layui-nav layui-nav-tree layui-this"><li class="layui-nav-item layui-nav-itemed">${tips}</li></ul>`
            window.openTips = layer.tips(tips, $(this), {
              // 弹出方向
              tips: [2],
              // 给弹出层容器传入自定义类
              skin: 'layui-popup-menu',
              // 弹出层创建成功后的回调,el即弹出层的dom节点
              success(el) {
                let left = $(el).position().left - 10
                $(el).css({ left })
                element.init()
              },
            })
          }
        },
      )

      $('body').on('mouseleave', '.layui-popup-menu', function () {
        if (moyuAdmin.isMobile()) return false
        let attrEvent = $('.layui-shrink [moyu-event]').attr('moyu-event')
        if (attrEvent === 'fold') {
          try {
            layer.close(window.openTips)
          } catch (e) {
            console.log(e.message)
          }
        }
      })
    },
  }
  exports('moyuAdmin', moyuAdmin)
})
