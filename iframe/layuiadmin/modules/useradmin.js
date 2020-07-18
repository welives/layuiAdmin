layui.define(['table', 'form'], (exports) => {
  let $ = layui.$,
    table = layui.table,
    form = layui.form

  // 用户列表
  table.render({
    elem: '#LAY-user-list',
    url: layui.setter.base + 'json/useradmin/userlist.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 80, sort: true },
        { field: 'username', title: '用户名', minWidth: 100 },
        { field: 'avatar', title: '头像', width: 100, templet: '#imgTpl' },
        { field: 'phone', title: '手机' },
        { field: 'email', title: '邮箱' },
        { field: 'sex', title: '性别', width: 80 },
        { field: 'ip', title: 'IP地址' },
        { field: 'jointime', title: '加入时间', sort: true },
        {
          title: '操作',
          width: 160,
          align: 'center',
          fixed: 'right',
          toolbar: '#table-tool-userlist',
        },
      ],
    ],
    page: true,
    limit: 30,
    height: 'full-220',
    text: '加载出现异常!',
  })

  // 监听用户列表行工具事件
  table.on('tool(LAY-user-list)', (obj) => {
    // 注：tool 是工具条事件名，LAY-user-list 是 table 原始容器的属性 lay-filter="对应的值"
    let data = obj.data, //获得当前行数据
      tr = $(obj.tr) // 获得当前行 tr 的 DOM 对象

    if (obj.event === 'del') {
      layer.confirm(
        '确定删除该条数据吗?',
        { icon: 3, title: '提示' },
        (index) => {
          obj.del()
          layer.close(index)
        },
      )
    } else if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑用户',
        content: layui.setter.root + 'views/useradmin/user/userform.html',
        maxmin: true,
        area: ['500px', '450px'],
        btn: ['确定', '取消'],
        // 成功打开弹窗后的回调
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero.find('iframe').contents().find('#LAY-form-user')
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'username':
                $(this).val(data.username)
                break
              case 'phone':
                $(this).val(data.phone)
                break
              case 'email':
                $(this).val(data.email)
                break
              case 'avatar':
                $(this).val(data.avatar)
                break
              case 'sex':
                $(this).val() === data.sex ? $(this).attr('checked', true) : ''
                break
            }
          })
        },
        // 点击确定按钮后的回调
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-user-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-user-list') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    }
  })

  // 管理员列表
  table.render({
    elem: '#LAY-admin-list',
    url: layui.setter.base + 'json/useradmin/adminlist.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 80, sort: true },
        { field: 'loginname', title: '登入名', minWidth: 100 },
        { field: 'phone', title: '手机' },
        { field: 'email', title: '邮箱' },
        { field: 'role', title: '角色' },
        { field: 'jointime', title: '加入时间', sort: true },
        {
          field: 'check',
          title: '审核状态',
          templet: '#buttonTpl',
          width: 100,
          align: 'center',
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          fixed: 'right',
          toolbar: '#table-tool-adminlist',
        },
      ],
    ],
    text: '加载出现异常',
  })

  // 监听管理员列表行工具事件
  table.on('tool(LAY-admin-list)', (obj) => {
    let data = obj.data, //获得当前行数据
      tr = $(obj.tr), // 获得当前行 tr 的 DOM 对象
      roles = [
        '管理员',
        '超级管理员',
        '纠错员',
        '采购员',
        '推销员',
        '运营人员',
        '编辑',
      ]

    if (obj.event === 'del') {
      layer.confirm(
        '确定删除该条数据吗?',
        { icon: 3, title: '提示' },
        (index) => {
          obj.del()
          layer.close(index)
        },
      )
    } else if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑管理员',
        content: layui.setter.root + 'views/useradmin/admin/adminform.html',
        maxmin: true,
        area: ['420px', '650px'],
        btn: ['确定', '取消'],
        // 成功打开弹窗后的回调
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero.find('iframe').contents().find('#LAY-form-admin')
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'loginname':
                $(this).val(data.loginname)
                break
              case 'phone':
                $(this).val(data.phone)
                break
              case 'email':
                $(this).val(data.email)
                break
              case 'role':
                roles.forEach((v, index) => {
                  if (v === data.role) $(this).val(index)
                })
                break
              case 'check':
                $(this).attr('checked', data.check)
                break
            }
          })
        },
        // 点击确定按钮后的回调
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-admin-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-admin-list') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    }
  })

  // 角色列表
  table.render({
    elem: '#LAY-role-list',
    url: layui.setter.base + 'json/useradmin/role.json',
    cols: [
      [
        { type: 'checkbox', fixed: 'left' },
        { field: 'id', title: 'ID', width: 80, sort: true },
        { field: 'rolename', title: '角色名' },
        { field: 'limits', title: '权限' },
        { field: 'descr', title: '具体描述' },
        {
          field: 'check',
          title: '审核状态',
          width: 100,
          templet: '#buttonTpl',
          align: 'center',
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          fixed: 'right',
          toolbar: '#table-tool-rolelist',
        },
      ],
    ],
    text: '加载出现异常',
  })

  // 监听角色列表行工具事件
  table.on('tool(LAY-role-list)', (obj) => {
    let data = obj.data, //获得当前行数据
      tr = $(obj.tr), // 获得当前行 tr 的 DOM 对象
      roles = [
        '管理员',
        '超级管理员',
        '纠错员',
        '采购员',
        '推销员',
        '运营人员',
        '编辑',
        '统计人员',
        '评估员',
      ]

    if (obj.event === 'del') {
      layer.confirm(
        '确定删除该条数据吗?',
        { icon: 3, title: '提示' },
        (index) => {
          obj.del()
          layer.close(index)
        },
      )
    } else if (obj.event === 'edit') {
      layer.open({
        type: 2,
        title: '编辑角色',
        content: layui.setter.root + 'views/useradmin/role/roleform.html',
        maxmin: true,
        area: ['500px', '480px'],
        btn: ['确定', '取消'],
        // 成功打开弹窗后的回调
        success(layero, index) {
          // 给iframe表单元素赋值
          let iframe = layero.find('iframe').contents().find('#LAY-form-role')
          $.each(iframe.find('[name]'), function () {
            switch ($(this)[0].name) {
              case 'rolename':
                roles.forEach((v, index) => {
                  if (v === data.rolename) $(this).val(index)
                })
                break
              case 'descr':
                $(this).val(data.descr)
                break
            }
          })
        },
        // 点击确定按钮后的回调
        yes(index, layero) {
          // 通过 window[name] 获取iframe窗体
          let iframeWindow = window['layui-layer-iframe' + index],
            submitID = 'LAY-role-submit',
            submit = layero.find('iframe').contents().find(`#${submitID}`)

          // 监听iframe表单提交
          iframeWindow.layui.form.on(`submit(${submitID})`, (data) => {
            let field = data.field
            //提交 Ajax 成功后，静态更新表格中的数据
            // $.ajax({})
            table.reload('LAY-role-list') // 数据刷新
            layer.close(index) // 关闭弹层
          })
          submit.trigger('click')
        },
      })
    }
  })

  exports('useradmin', {})
})
