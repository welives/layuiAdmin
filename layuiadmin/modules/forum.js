layui.define(['table', 'form'], (exports) => {
  let $ = layui.$,
    table = layui.table,
    form = layui.form

  // 帖子列表
  table.render({
    elem: '#LAY-app-forum-list',
    url: layui.setter.base + 'json/forum/list.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'poster', title: '发帖人' },
        {
          field: 'avatar',
          title: '头像',
          width: 100,
          templet: '#avatarTpl',
        },
        { field: 'content', title: '发帖内容' },
        { field: 'posttime', title: '发帖时间', sort: true },
        {
          field: 'top',
          title: '置顶',
          minWidth: 80,
          align: 'center',
          templet: '#topTpl',
        },
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

  // 监听帖子列表行工具事件
  table.on('tool(LAY-app-forum-list)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑帖子',
        content: layui.setter.root + 'views/app/forum/list-form.html',
        area: ['550px', '400px'],
        btn: ['确定', '取消'],
        resize: false,
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero
            .find('iframe')
            .contents()
            .find('#LAY-app-forum-listform')
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'poster':
                $(this).val(data.poster)
                break
              case 'top':
                $(this).attr('checked', data.top)
                break
              case 'avatar':
                $(this).val(data.avatar)
                break
              case 'content':
                $(this).val(data.content)
                break
            }
          })
        },
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-app-forum-listform-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field // 获取提交的字段
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-app-forum-list') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此条帖子？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })

  // 回帖列表
  table.render({
    elem: '#LAY-app-forum-replys',
    url: layui.setter.base + 'json/forum/replys.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'replyer', title: '回帖人' },
        { field: 'cardid', title: '回帖ID', sort: true },
        { field: 'avatar', title: '头像', width: 100, templet: '#avatarTpl' },
        { field: 'content', title: '回帖内容', width: 200 },
        { field: 'replytime', title: '回帖时间', sort: true },
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

  // 监听回帖列表行工具事件
  table.on('tool(LAY-app-forum-replys)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑评论',
        content: layui.setter.root + 'views/app/forum/replys-form.html',
        area: ['550px', '350px'],
        btn: ['确定', '取消'],
        resize: false,
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero
            .find('iframe')
            .contents()
            .find('#LAY-app-forum-replys-form')
          iframe.find('[name=content]').val(data.content)
        },
        yes(index, layero) {
          let iframe = layer.getChildFrame('body', index),
            content = iframe.find('[name=content]').val()

          //提交 Ajax 成功后，静态更新表格中的数据
          // $.ajax({})
          obj.update({
            content,
          })
          layer.close(index)
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此条评论？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })
  exports('forum', {})
})
