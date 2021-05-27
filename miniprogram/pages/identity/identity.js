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

  onLoad (query) {
    // 这里的 query 将是 url 中，问号(?) 后面的键值对组成的一个对象
    // query = {type: 'worker'}
    this.setData({
      type: query.type
    });
  },

  onLogin() {
    var that = this
    let username = that.data.username
    let password = that.data.password
    let type = that.data.type
    console.log(type,username,password)
    if(that.data.username == ''){
      wx.showModal({
        title:'提示',
        content:'账号不能为空',
        showCancel:false,
        success (res) {
        }
      })
    }else if(that.data.password == ''){
        wx.showModal({
          title:'提示',
          content:'密码不能为空',
          showCancel:false,
          success (res) {
          }
        })
    }else{
      wx.cloud.database().collection(type).where({
        Sno: username,
        password: password
      }).get({
        success(res) {
          if(res.data.length){
            let usr = res.data[0]
            if (password == usr.password) {
              var app = getApp()
              app.globalData.username = username
              wx.showToast({
                title: '登录成功',
              })
              if(type != 'admin'){
                let name = usr.name
                wx.redirectTo({
                  url: '/pages/homepage/homepage?name='+name,
                })
              }else{
                wx.redirectTo({
                  url: '/pages/complain/complain',
                })
              }          
            }
          }else {
            console.log(res.data.length)
            wx.showModal({
              title:'提示',
              content:'账号或密码错误',
              showCancel:false,
              success (res) {
                if(res.confirm){
                  that.setData({
                    username: '',
                    password: ''
                  })
                }
              }
            })
          }
        },
        fail(res) {
          console.log("获取数据失败", res)
        }
      })
    }       
  }
});