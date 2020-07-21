/**

 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define(['table', 'form'], (exports) => {
  let $ = layui.$,
    setter = layui.setter,
    view = layui.view,
    table = layui.table,
    form = layui.form,
    util = layui.util

  // 文章列表
  table.render({
    elem: '#LAY-app-content-list',
    url: setter.api + 'json/content/list.json',
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
            return util.toDateString(d.uploadtime * 1000, 'yyyy年MM月dd日')
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
  table.on('tool(LAY-filter-content-list)', (obj) => {
    let data = obj.data,
      label = ['美食', '新闻', '八卦', '体育', '音乐', '历史']
    label.forEach((v, index) => {
      console.log(index)
      if (v === data.label) data.label = index
    })
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑文章',
        id: 'LAY-popup-content-edit',
        area: ['550px', '550px'],
        // 成功打开弹窗后的回调
        success(layero, index) {
          view(this.id)
            .render('app/content/list-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-listform-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，静态更新表格中的数据
                // $.ajax({})
                table.reload('LAY-app-content-list') // 数据刷新
                layer.close(index) // 关闭弹层
              })
            })
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
    url: setter.api + 'json/content/tags.json',
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
  table.on('tool(LAY-filter-content-tags)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑分类',
        id: 'LAY-popup-content-edit',
        area: ['450px', '200px'],
        success(layero, index) {
          view(this.id)
            .render('app/content/tags-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-tagsform-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，静态更新表格中的数据
                // $.ajax({})
                table.reload('LAY-app-content-tags') // 数据刷新
                layer.close(index) // 关闭弹层
              })
            })
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
    url: setter.api + 'json/content/comment.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'reviewers', title: '评论者', minWidth: 100 },
        { field: 'content', title: '评论内容', minWidth: 100 },
        {
          field: 'commtime',
          title: '评论时间',
          minWidth: 100,
          sort: true,
          templet: (d) => {
            return util.toDateString(d.commtime * 1000, 'yyyy年MM月dd日')
          },
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

  // 监听评论管理行工具事件
  table.on('tool(LAY-filter-content-comment)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑评论',
        id: 'LAY-popup-content-edit',
        area: ['450px', '300px'],
        success(layero, index) {
          view(this.id)
            .render('app/content/comment-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-content-comment-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，静态更新表格中的数据
                // $.ajax({})
                table.reload('LAY-app-content-comment') // 数据刷新
                layer.close(index) // 关闭弹层
              })
            })
        },
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除此条评论？', (index) => {
        obj.del()
        layer.close(index)
      })
    }
  })

  exports('contlist', {})
})
