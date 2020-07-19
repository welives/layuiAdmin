layui.define(['table', 'form', 'element'], (exports) => {
  let $ = layui.$,
    table = layui.table,
    form = layui.form,
    element = layui.element

  table.render({
    elem: '#LAY-app-order',
    url: '/iframe/json/workorder/demo.json',
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
    if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑工单',
        content: layui.setter.views + 'app/workorder/list-form.html',
        area: ['450px', '450px'],
        btn: ['确定', '取消'],
        success(layero, index) {
          let iframe = layer.getChildFrame('body', index)
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'attr':
                $(this).focus().val(data.attr)
                break
              case 'title':
                $(this).val(data.title)
                break
              case 'progress':
                $(this).val(data.progress)
                break
              case 'state':
                state.forEach((value, index) => {
                  if (value === data.state) return $(this).val(index)
                })
                break
              case 'accept':
                accept.forEach((value, index) => {
                  if (value === data.accept) return $(this).val(index + 1)
                })
                break
            }
          })
        },
        yes(index, layero) {
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = '#LAY-app-order-submit',
            filter = 'LAY-filter-order-submit',
            submit = layero.find('iframe').contents().find(submitID)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${filter})`, (data) => {
            let field = data.field // 获取提交的字段
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-app-order') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    }
  })
  exports('workorder', {})
})
