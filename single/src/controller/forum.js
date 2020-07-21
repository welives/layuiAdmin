/**

 @Name：layuiAdmin 社区系统
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

  // 帖子列表
  table.render({
    elem: '#LAY-app-forum-list',
    url: setter.api + 'json/forum/list.json',
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
        {
          field: 'posttime',
          title: '发帖时间',
          sort: true,
          templet: (d) => {
            return util.toDateString(d.posttime * 1000, 'yyyy年MM月dd日')
          },
        },
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
  table.on('tool(LAY-filter-forum-list)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑帖子',
        id: 'LAY-popup-forum-edit',
        area: ['550px', '400px'],
        resize: false,
        success(layero, index) {
          view(this.id)
            .render('app/forum/list-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-forum-listform-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，静态更新表格中的数据
                // $.ajax({})
                table.reload('LAY-app-forum-list') // 数据刷新
                layer.close(index) // 关闭弹层
              })
            })
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
    url: setter.api + 'json/forum/replys.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 100, sort: true },
        { field: 'replyer', title: '回帖人' },
        { field: 'cardid', title: '回帖ID', sort: true },
        { field: 'avatar', title: '头像', width: 100, templet: '#avatarTpl' },
        { field: 'content', title: '回帖内容', width: 200 },
        {
          field: 'replytime',
          title: '回帖时间',
          sort: true,
          templet: (d) => {
            return util.toDateString(d.replytime * 1000, 'yyyy年MM月dd日')
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

  // 监听回帖列表行工具事件
  table.on('tool(LAY-filter-forum-replys)', (obj) => {
    let data = obj.data
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑回帖',
        id: 'LAY-popup-forum-edit',
        area: ['550px', '350px'],
        resize: false,
        success(layero, index) {
          view(this.id)
            .render('app/forum/replys-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-forum-replysform-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，静态更新表格中的数据
                // $.ajax({})
                table.reload('LAY-app-forum-replys') // 数据刷新
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

  exports('forum', {})
})
