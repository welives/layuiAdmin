layui.define(['element', 'moyuMenu', 'moyuTab'], (exports) => {
  let $ = layui.$,
    layer = layui.layer,
    element = layui.element,
    moyuMenu = layui.moyuMenu,
    moyuTab = layui.moyuTab

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
          this.renderAnim(options.pageAnim)
          this.listen()
          moyuMenu.render({
            menuList: data.menuInfo,
            multiModule: options.multiModule,
            menuChildOpen: options.menuChildOpen,
          })
          moyuTab.render({
            filter: 'layui-layout-tabs',
            urlHashLocation: options.urlHashLocation,
            multiModule: options.multiModule,
            menuChildOpen: options.menuChildOpen,
            maxTabNum: options.maxTabNum,
            menuList: data.menuInfo,
            homeInfo: data.homeInfo,
            listenSwitchCallback: () => {
              this.renderDevice()
            },
          })
          this.renderLoader(options.loadingTime)
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
      $('[lay-filter=logo]').html(
        `<a href="javascript:;" lay-href=${data.href}><img src=${data.image} alt="logo"><h1>${data.title}</h1>`,
      )
    },

    /**
     * @description 初始化缓存地址
     * @param {string} url
     */
    renderClear(url) {
      $('[lay-event=clear]').attr('clear-href', url)
    },

    /**
     * @description 初始化首页
     * @param {object} data
     */
    renderHome(data) {
      sessionStorage.setItem('layui-homeHref', data.href)
      $('#LAY_app_tabsHeader li:first-child').attr('lay-id', data.href)
      $('#LAY_app_body div:first-child').html(
        `<iframe class="layui-iframe" frameborder="0" src=${data.href}></iframe>`,
      )
    },

    /**
     * @description 初始化设备端
     */
    renderDevice() {
      if (this.isMobile()) {
        $('.layui-shrink [lay-event]').attr('lay-event', 'unfold')
        $('.layui-shrink i').attr('class', 'layui-icon layui-icon-shrink-right')
        $('body').removeClass('layui-mini').addClass('layui-default')
        layer.close(window.popupMenu)
      }
    },

    /**
     * @description 初始化iframe窗口动画
     * @param {boolean} anim
     */
    renderAnim(anim) {
      if (anim) {
        $('head').append(`<style id="layui-page-anim">
        .layui-tabsbody-item.layui-show{
          animation:moveTop 1s;-webkit-animation:moveTop 1s;animation-fill-mode:both;-webkit-animation-fill-mode:both;position:relative;height:100%;-webkit-overflow-scrolling:touch;
        }
        @keyframes moveTop{
          0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}
          100% {opacity:1; -webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
        }
        @-o-keyframes moveTop{
          0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}
          100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
        }
        @-moz-keyframes moveTop{
          0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}
          100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
        }
        @-webkit-keyframes moveTop{
          0% {opacity:0;-webkit-transform:translateY(30px);-ms-transform:translateY(30px);transform:translateY(30px);}
          100% {opacity:1;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
        }
        </style>`)
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
     * @description 全屏
     */
    fullscreen() {
      let el = document.documentElement,
        rfs = el.requestFullscreen || el.webkitRequestFullscreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        let wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      } else if (el.oRequestFullscreen) {
        el.oRequestFullscreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      } else if (el.mozRequestFullscreen) {
        el.mozRequestFullscreen()
      } else {
        this.error('您的浏览器不支持全屏模式!')
      }
    },

    /**
     * @description 退出全屏
     */
    exitFullscreen() {
      let el = document,
        cfs =
          el.cancelFullscreen || el.webkitCancelFullscreen || el.exitFullscreen
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        let wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) {
          wscript.SendKeys('{F11}')
        }
      } else if (el.msExitFullscreen) {
        el.msExitFullscreen()
      } else if (el.oCancelFullscreen) {
        el.oCancelFullscreen()
      } else if (el.webkitCancelFullscreen) {
        el.webkitCancelFullscreen()
      } else if (el.mozCancelFullscreen) {
        el.mozCancelFullscreen()
      } else {
        this.error('您的浏览器不支持全屏模式!')
      }
    },

    /**
     * @description 初始化加载时间
     * @param {number} loadingTime
     */
    renderLoader(loadingTime) {
      setTimeout(() => {
        $('.layui-loader').fadeOut()
      }, loadingTime * 1000)
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
     * @description 监听点击事件
     */
    listen() {
      // 点击遮罩层
      $('body').on('click', '.layui-mobile-shade', () => {
        this.renderDevice()
      })

      // 清理缓存
      $('body').on('click', '[lay-event=clear]', function () {
        sessionStorage.clear()
        let clearUrl = $(this).attr('clear-href')
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
      $('body').on('click', '[lay-event=refresh]', () => {
        $('.layui-tabsbody-item.layui-show')
          .find('iframe')[0]
          .contentWindow.location.reload()
        this.success('刷新成功')
      })

      // 全屏
      $('body').on('click', '.layui-fullscreen [lay-event]', function () {
        let event = $(this).attr('lay-event')
        if (event === 'fullscreen') {
          moyuAdmin.fullscreen()
          $(this).attr('lay-event', 'exit')
          $(this).html('<i class="layui-icon layui-icon-screen-restore"></i>')
        } else {
          moyuAdmin.exitFullscreen()
          $(this).attr('lay-event', 'fullscreen')
          $(this).html('<i class="layui-icon layui-icon-screen-full"></i>')
        }
      })

      // 弹出左侧菜单
      $('body').on('mouseenter', '.layui-side .layui-nav li', function () {
        if (moyuAdmin.isMobile()) return
        let classInfo = $(this).attr('class'),
          data = $(this).html(),
          event = $('.layui-shrink [lay-event]').attr('lay-event')
        if (event === 'fold' && data) {
          data = `<ul class="layui-nav layui-nav-tree"><li class="layui-nav-item layui-nav-itemed">${data}</li></ul>`
          window.popupMenu = layer.tips(data, $(this), {
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
      })

      $('body').on('mouseleave', '.layui-popup-menu', function () {
        if (moyuAdmin.isMobile()) return
        let event = $('.layui-shrink [lay-event]').attr('lay-event')
        if (event === 'fold') {
          try {
            layer.close(window.popupMenu)
          } catch (e) {
            console.log(e.message)
          }
        }
      })
    },
  }
  exports('moyuAdmin', moyuAdmin)
})
