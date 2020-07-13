layui.define(['table', 'form', 'util'], (exports) => {
  let $ = layui.$,
    table = layui.table,
    form = layui.form,
    util = layui.util

  // 文章列表
  table.render({
    elem: '#LAY-app-content-list',
    url: layui.setter.base + 'json/content/list.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: '文章ID', width: 100, sort: true },
        { field: 'label', title: '文章标签', minWidth: 100 },
        { field: 'title', title: '文章标题' },
        { field: 'author', title: '作者' },
        {
          field: 'uploadtime',
          title: '上传时间',
          sort: true,
          templet: (d) => {
            return util.toDateString(d.uploadtime, 'yyyy年MM月dd日')
          },
        },
        {
          field: 'status',
          title: '发布状态',
          minWidth: 80,
          align: 'center',
          templet: '#statusTpl',
        },
        {
          title: '操作',
          minWidth: 150,
          align: 'center',
          fixed: 'right',
          toolbar: '#toolTpl',
        },
      ],
    ],
    page: true,
    limit: 10,
    limits: [10, 15, 20, 25, 30],
    text: '对不起，加载出现异常！',
  })

  // 监听文章列表行工具事件
  table.on('tool(LAY-app-content-list)', (obj) => {
    let data = obj.data,
      label = ['美食', '新闻', '八卦', '体育', '音乐']
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑文章',
        content: layui.setter.root + 'views/app/content/list-form.html',
        maxmin: true,
        area: ['550px', '550px'],
        btn: ['确定', '取消'],
        // 成功打开弹窗后的回调
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero
            .find('iframe')
            .contents()
            .find('#LAY-app-content-listform')
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'title':
                $(this).val(data.title)
                break
              case 'author':
                $(this).val(data.author)
                break
              case 'label':
                label.forEach((v, index) => {
                  if (v === data.label) $(this).val(index)
                })
                break
              case 'status':
                $(this).attr('checked', data.status)
                break
              case 'content':
                $(this).val(data.content)
                break
            }
          })
        },
        // 点击确定按钮后的回调
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-app-content-listform-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field // 获取提交的字段
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-app-content-list') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此文章？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })

  // 分类管理
  table.render({
    elem: '#LAY-app-content-tags',
    url: layui.setter.base + 'json/content/tags.json',
    cols: [
      [
        { type: 'numbers', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'tags', title: '分类名', minWidth: 100 },
        {
          title: '操作',
          width: 150,
          align: 'center',
          fixed: 'right',
          templet: '#toolTpl',
        },
      ],
    ],
    text: '对不起，加载出现异常！',
  })

  // 监听分类管理行工具事件
  table.on('tool(LAY-app-content-tags)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑分类',
        content: layui.setter.root + 'views/app/content/tags-form.html',
        area: ['460px', '200px'],
        btn: ['确定', '取消'],
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero
            .find('iframe')
            .contents()
            .find('#LAY-app-content-tagsform')
          iframe.find('[name=tags]').val(data.tags)
        },
        yes(index, layero) {
          // 获取iframe元素的值
          let iframe = layer.getChildFrame('body', index),
            tags = iframe.find('[name=tags]').val()

          if (!tags.replace(/\s/g, '')) return

          //提交 Ajax 成功后，静态更新表格中的数据
          // $.ajax({})
          obj.update({
            tags,
          })
          layer.close(index)
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此分类？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })

  // 评论管理
  table.render({
    elem: '#LAY-app-content-comment',
    url: layui.setter.base + 'json/content/comment.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'reviewers', title: '评论者', minWidth: 100 },
        { field: 'content', title: '评论内容', minWidth: 100 },
        { field: 'commtime', title: '评论时间', minWidth: 100, sort: true },
        {
          title: '操作',
          width: 150,
          align: 'center',
          fixed: 'right',
          toolbar: '#toolTpl',
        },
      ],
    ],
    page: true,
    limit: 10,
    limits: [10, 15, 20, 25, 30],
    text: '对不起，加载出现异常！',
  })

  // 监听评论管理行工具事件
  table.on('tool(LAY-app-content-comment)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑评论',
        content: layui.setter.root + 'views/app/content/comment-form.html',
        area: ['450px', '300px'],
        btn: ['确定', '取消'],
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero
            .find('iframe')
            .contents()
            .find('#LAY-app-content-comment-form')
          iframe.find('[name=content]').val(data.content)
        },
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-app-content-comment-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field // 获取提交的字段
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-app-content-comment') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此条评论？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })
  exports('conlist', {})
})
