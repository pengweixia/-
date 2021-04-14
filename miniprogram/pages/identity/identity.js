Page({
  data: {
    radio: 'user',
    type: 'user',
    username: '',
    password: ''
  },

  getUsr(event) {
    this.setData({
      username: event.detail,
    });
  },

  getPwd(event) {
    this.setData({
      password: event.detail,
    });
  },
  
  getType(event) {
    this.setData({
      type: event.detail,
      radio: event.detail,
    });
  },

  onLogin() {
    let username = this.data.username
    let password = this.data.password
    let type = this.data.type

    wx.cloud.database().collection(type).where({
      username: username
    }).get({
      success(res) {
        let usr = res.data[0]
        console.log(usr)
        if (password == usr.password) {
          wx.showToast({
            title: '登录成功',
          })
          wx.navigateTo({
            url: '/pages/homepage/homepage?type='+type,
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