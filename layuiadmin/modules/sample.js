layui.define((exports) => {
  let $ = layui.$,
    layer = layui.layer,
    admin = layui.admin,
    setter = layui.setter,
    laytpl = layui.laytpl,
    data

  // 初始化数据
  admin.req({
    url: setter.base + 'json/home/sample.json',
    success(res) {
      data = res.data
    },
  })

  layui.use('carousel', () => {
    let carousel = layui.carousel,
      device = layui.device()

    renderUpdateLogs(data.updateLogs)
    renderUserNews(data.userNews)
    renderComponents(data.components)
    renderUserNotes(data.userNotes)

    // 轮播切换
    $('.layadmin-carousel').each(function () {
      carousel.render({
        elem: this,
        width: '100%',
        arrow: 'none',
        autoplay: $(this).data('autoplay') === true,
        intervel: $(this).data('interval') || 3000,
        trigger: device.ios || device.android ? 'click' : 'hover',
        anim: $(this).data('anim') || 'default',
      })
    })
  })

  // 八卦新闻
  layui.use('echarts', () => {
    let echarts = layui.echarts,
      echartsApp = [],
      elemDataView = $('#LAY-index-demo1').children('div'),
      renderDataView = (index) => {
        echartsApp[index] = echarts.init(
          elemDataView[index],
          layui.echartsTheme,
        )
        echartsApp[index].setOption(data.players[index])
        window.onresize = echartsApp[index].resize
      }

    // 没找到DOM，终止执行
    if (!elemDataView[0]) return
    renderDataView(0)
  })

  // 访问量
  layui.use('echarts', () => {
    let echarts = layui.echarts,
      echartsApp = [],
      elemDataView = $('#LAY-index-demo2').children('div'),
      renderDataView = (index) => {
        echartsApp[index] = echarts.init(
          elemDataView[index],
          layui.echartsTheme,
        )
        echartsApp[index].setOption(data.pageView[index])
        window.onresize = echartsApp[index].resize
      }

    // 没找到DOM，终止执行
    if (!elemDataView[0]) return
    renderDataView(0)
  })

  // 全国用户分布图
  layui.use('echarts', () => {
    let echarts = layui.echarts,
      echartsApp = [],
      elemDataView = $('#LAY-index-demo3').children('div'),
      renderDataView = (index) => {
        echartsApp[index] = echarts.init(
          elemDataView[index],
          layui.echartsTheme,
        )
        echartsApp[index].setOption(data.userMap[index])
        window.onresize = echartsApp[index].resize
      }

    // 没找到DOM，终止执行
    if (!elemDataView[0]) return
    renderDataView(0)
  })

  // 本周活跃用户列表
  layui.use('table', () => {
    let table = layui.table
    table.render({
      elem: '#LAY-index-activeUser',
      url: setter.base + 'json/home/active-user.json',
      cols: [
        [
          {
            field: 'username',
            title: '用户名',
            templet: (d) => {
              if (d.username === '胡歌') {
                return `<span class="layui-text-red">${d.username}</span>`
              } else if (d.username === '彭于晏') {
                return `<span class="layui-text-orange">${d.username}</span>`
              } else if (d.username === '靳东') {
                return `<span class="layui-text-green">${d.username}</span>`
              } else {
                return d.username
              }
            },
          },
          {
            field: 'lastLogin',
            title: '最后登录时间',
            minWidth: 120,
            templet: `<div><i class="layui-icon layui-icon-log"> {{ d.lastLogin }}</i></div>`,
          },
          {
            field: 'status',
            title: '状态',
            templet: (d) => {
              if (d.status === '在线') {
                return `<span class="layui-text-cyan">${d.status}</span>`
              } else {
                return `<i>${d.status}</i>`
              }
            },
          },
          {
            field: 'praise',
            title: '获得赞',
            templet: `<div>{{ d.praise }} <i class="layui-icon layui-icon-praise"></i></div>`,
          },
        ],
      ],
      skin: 'line',
    })
  })

  // 项目进展
  layui.use('table', () => {
    let table = layui.table
    table.render({
      elem: '#LAY-index-prograss',
      url: setter.base + 'json/home/prograss.json',
      cols: [
        [
          { type: 'checkbox', fixed: 'left' },
          { field: 'prograss', title: '任务' },
          { field: 'time', title: '所需时间' },
          {
            field: 'complete',
            title: '完成情况',
            templet: (d) => {
              if (d.complete === '已完成') {
                return `<del class="layui-text-green">${d.complete}</del>`
              } else if (d.complete === '进行中') {
                return `<span class="layui-text-orange">${d.complete}</span>`
              } else {
                return `<span class="layui-text-red">${d.complete}</span>`
              }
            },
          },
        ],
      ],
      skin: 'line',
    })
  })

  // 回复留言
  admin.events.replyNote = (othis) => {
    let uid = othis.data('id')
    layer.prompt(
      {
        title: `回复留言 ID:${uid}`,
        formType: 2,
      },
      (value, index) => {
        // 这里可以请求 Ajax
        layer.msg(`回复了: ${value}`)
        layer.close(index)
      },
    )
  }

  /**
   * @description 更新日志
   * @param {array} data
   */
  function renderUpdateLogs(data) {
    laytpl(`
      <div class="layui-row layui-col-space10">
      {{# layui.each(d, (index, item)=>{ }}
        <div class="layui-col-xs12 layui-col-sm4">
          <div class="layadmin-update-logs">
            <div class="layadmin-text-top">
              <i class="layui-icon {{ item.icon }}"></i>
              <a lay-href="{{ item.link }}">{{ item.title }}</a>
            </div>
            <p class="layadmin-text-center">{{ item.content }}</p>
            <p class="layadmin-text-bottom">
              <a lay-href="{{ item.link }}">{{ item.module }}</a>
              <span>{{ item.date }}</span>
            </p>
          </div>
        </div>
      {{# }) }}
      </div>
    `).render(data, (html) => {
      $('#LAY-update-logs').html(html)
    })
  }

  /**
   * @description 用户动态
   * @param {array} data
   */
  function renderUserNews(data) {
    laytpl(`
    {{# layui.each(d, (index, item) => { }}
      <dd>
        <div class="layadmin-avatar-img layui-bg-green layui-circle">
          <a href="javascript:;">
            <img src="{{ item.avatar }}" alt="" />
          </a>
        </div>
        <div>
          <p>{{ item.user }} {{ item.text }}</p>
          <span>{{ item.date }}</span>
        </div>
      </dd>
    {{# }) }}
    `).render(data, (html) => {
      $('.layadmin-user-news').html(html)
    })
  }

  /**
   * @description 重点组件
   * @param {array} data
   */
  function renderComponents(data) {
    laytpl(`
    {{# layui.each(d, (index, item) =>{ }}
      <li class="layui-col-xs6">
        <a lay-href="{{ item.link }}">
          <span class="layui-bg-green layui-circle layadmin-cpn-img">
            <img src="{{ item.img }}" >
          </span>
          <span>{{ item.text }}</span>
        </a>
      </li>
    {{# }) }}
    `).render(data, (html) => {
      $('.layadmin-components').html(html)
    })
  }

  function renderCardList(data) {
    laytpl(`
    {{# layui.each(d, (index, item) => { }}
      <div class="layui-col-sm6 layui-col-md3">
        <div class="layui-card">
          <div class="layui-card-header">{{ item.title }}
            <span class="layadmin-badge layui-badge {{ item.badgeBg }}">{{ item.badgeText }}</span>
          </div>
          <div class="layui-card-body">
            <p class="layadmin-bg-font">{{ item.content }}</p>
            <p>{{ item.bottomText }}
              <span class="layadmin-span-color">{{ item.bottomSpan }}
                <i class="layui-inline layui-icon {{ item.bottomIcon }}"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    {{# }) }}
    `).render(data, (html) => {
      $('.layadmin-card-list').html(html)
    })
  }

  /**
   * @description 用户留言
   * @param {array} data
   */
  function renderUserNotes(data) {
    laytpl(`
    {{# layui.each(d, (index, item) => { }}
      <li>
        <h3>{{ item.user }}</h3>
        <p>{{ item.content }}</p>
        <span>{{ item.date }}</span>
        <a href="javascript:;" data-id="{{ item.id }}" class="layui-btn layui-btn-xs layadmin-reply" layadmin-event="replyNote">回复</a>
      </li>
    {{# }) }}
    `).render(data, (html) => {
      $('.layadmin-usernotes').html(html)
    })
  }

  // 输出接口
  exports('sample', {})
})
