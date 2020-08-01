/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.define((exports) => {
  let $ = layui.$,
    setter = layui.setter,
    view = layui.view,
    admin = layui.admin
  // 公共业务的逻辑处理可以写在此处，切换任何页面都会执行

  /**
   * @description 退出
   */
  admin.events.logout = () => {
    admin.req({
      url: setter.api + 'json/user/logout.json',
      type: 'get',
      data: {},
      //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行
      done(res) {
        //清空本地记录的 token，并跳转到登入页
        admin.exit(() => {
          location.href = setter.views + 'user/login.html'
        })
      },
    })
  }

  // 输出接口
  exports('common', {})
})
