Page({
  data: {
    type: null,
    username: '',
    password: ''
  },

  username:function(e){
    this.setData({
      username: e.detail.value
    });
  },
  password:function(e){
    this.setData({
      password: e.detail.value
    });
  },

  changePwd:function(){
    this.data.defaultType= !this.data.defaultType
    this.data.passwordType= !this.data.passwordType
    this.setData({
      defaultType: this.data.defaultType,
      passwordType: this.data.passwordType
    })
  },

  onLoad (query) {
    // 这里的 query 将是 url 中，问号(?) 后面的键值对组成的一个对象
    // query = {type: 'worker'}
    this.setData({
      type: query.type
    });
  },

  onLogin() {
    let username = this.data.username
    let password = this.data.password
    let type = this.data.type

    wx.cloud.database().collection(type).where({
      Sno: username
    }).get({
      success(res) {
        let usr = res.data[0],name = usr.name
        console.log(usr)
        if (password == usr.password) {
          var app = getApp()
          app.globalData.username = username
          wx.showToast({
            title: '登录成功',
          })
          wx.navigateTo({
            url: '/pages/homepage/homepage?name='+name,
          })
          wx.setStorageSync('usr', usr)
          console.log("success")
        }
        else {
          wx.showToast({
            title: '账户与密码错误',
          })
          console.log("fail")
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
    
  }
});