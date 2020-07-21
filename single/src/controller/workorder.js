/**

 @Name：layuiAdmin 工单系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：GPL-2

 */

layui.define(['table', 'form', 'element'], (exports) => {
  let $ = layui.$,
    setter = layui.setter,
    view = layui.view,
    table = layui.table,
    form = layui.form,
    element = layui.element

  table.render({
    elem: '#LAY-app-order',
    url: setter.api + 'json/workorder/demo.json',
    cols: [
      [
        { type: 'numbers', fixed: 'left' },
        { field: 'orderid', title: '工单号', width: 100, sort: true },
        { field: 'attr', title: '业务性质', width: 100 },
        { field: 'title', title: '工单标题', width: 300 },
        {
          field: 'progress',
          title: '进度',
          width: 200,
          align: 'center',
          templet: '#progressTpl',
        },
        { field: 'submit', title: '提交者', width: 100 },
        { field: 'accept', title: '受理人员', width: 100 },
        {
          field: 'state',
          title: '工单状态',
          minWidth: 80,
          align: 'center',
          templet: '#stateTpl',
        },
        { title: '操作', align: 'center', fixed: 'right', toolbar: '#toolTpl' },
      ],
    ],
    page: true,
    limit: 10,
    limits: [10, 15, 20, 25, 30],
    text: '对不起，加载出现异常！',
    done() {
      element.render('progress')
    },
  })

  // 监听工具条
  table.on('tool(LAY-filter-order)', (obj) => {
    let data = obj.data,
      state = ['未分配', '处理中', '已处理'],
      accept = ['员工-1', '员工-2', '员工-3', '员工-4', '员工-5']
    state.forEach((v, index) => {
      if (v === data.state) data.state = index
    })
    accept.forEach((v, index) => {
      if (v === data.accept) data.accept = index + 1
    })
    if (obj.event === 'edit') {
      layer.open({
        type: 1,
        title: '编辑工单',
        id: 'LAY-popup-workorder-edit',
        area: ['450px', '450px'],
        success(layero, index) {
          console.log(data)
          view(this.id)
            .render('app/workorder/list-form', data)
            .done(() => {
              form.render()
              form.on('submit(LAY-filter-order-submit)', (data) => {
                let field = data.field
                //提交 Ajax 成功后，关闭当前弹层并重载表格
                //$.ajax({});
                table.reload('LAY-app-order')
                layer.close(index)
              })
            })
        },
      })
    }
  })

  exports('workorder', {})
})
