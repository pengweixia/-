// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: '男',
    username: '',
    password: '',
    Confirmpassword:'',
    phone:'',
    name:''
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  username:function(e){
    this.setData({
      username: e.detail.value
    });
  },

  name:function(e){
    this.setData({
      name: e.detail.value
    });
  },

  password:function(e){
    this.setData({
      password: e.detail.value
    });
  },

  Confirmpassword: function(e){
    this.setData({
      Confirmpassword: e.detail.value
    });
  },

  phone:function(e){
    this.setData({
      phone: e.detail.value
    });
  },

  onRegister(){
    var that = this
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
    }else if(that.data.name == ''){
      wx.showModal({
        title:'提示',
        content:'姓名不能为空',
        showCancel:false,
        success (res) {
        }
      })
    }else if(that.data.Confirmpassword == ''){
      wx.showModal({
        title:'提示',
        content:'密码确认不能为空',
        showCancel:false,
        success (res) {
        }
      })
    }else if(that.data.phone.length != 11){
      wx.showModal({
        title:'提示',
        content:'手机号码长度需为11位！',
        showCancel:false,
        success (res) {
        }
      })
    }else if(that.data.password != that.data.Confirmpassword){
      wx.showModal({
        title:'提示',
        content:'两次密码不一致',
        showCancel:false,
        success (res) {
          if(res.confirm){
            that.setData({
              Confirmpassword: '',
              password:''
            })
          }
        }
      })
    }else{
      var app =getApp()
      const db = wx.cloud.database()
      db.collection('user').add({
        data: {
          name : that.data.name,
          Sno : that.data.username,
          Phone : that.data.phone,
          sex : that.data.radio,
          password : that.data.password,
          count:0
        },
        success(res){
          wx.showModal({
            title:'提示',
            content:'注册成功，欢迎使用校园微快递~',
            showCancel:false
          })
        },
        fail(res){
          console.log(res)
          wx.showModal({
              title:'提示',
              content:'网络不在状态！',
              showCancel:false
          })
        }
      })
      if(app.globalData.type == 'worker'){
        db.collection('worker').add({
          data: {
            name : that.data.name,
            Sno : that.data.username,
            Phone : that.data.phone,
            sex : that.data.radio,
            password : that.data.password,
            count:0
          },
          success(res){
            
          },
          fail(res){
            console.log(res)
            wx.showModal({
                title:'提示',
                content:'网络不在状态！',
                showCancel:false
            })
          }
        })
      }
      that.load()
    }
  },

  load(){
    this.setData({
      radio: '男',
      username: '',
      password: '',
      Confirmpassword:'',
      phone:'',
      name:''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})